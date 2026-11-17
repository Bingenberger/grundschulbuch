#!/usr/bin/env python3
# SPDX-License-Identifier: CC-BY-NC-SA-4.0
"""Wandelt Microsoft-Publisher-Dateien (.pub) in Heftdateien des Grundschulbuchs um.

LibreOffice liest die Publisher-Datei (über libmspub) und speichert sie als
ODF-Zeichnung (.odg). Dieses Skript übersetzt die Zeichnung in Seiten des
Grundschulbuchs: Texte werden bearbeitbare Textfelder, Fotos bleiben Bilder,
Linien und Flächen werden Formen. Was das Grundschulbuch nicht nachbauen kann
(Kurven, Verläufe, WordArt, Vektorgrafiken), rendert LibreOffice als PNG mit
transparentem Hintergrund.

Ergebnis ist eine Datei NAME.grundschulbuch, die im Regal unter „Importieren“
geladen wird. Benötigt nur Python 3.9+ und LibreOffice; siehe
docs/publisher-import.md.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import math
import os
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import uuid
import xml.etree.ElementTree as ET
import zipfile
from dataclasses import dataclass, field
from pathlib import Path

NS = {
    'office': 'urn:oasis:names:tc:opendocument:xmlns:office:1.0',
    'style': 'urn:oasis:names:tc:opendocument:xmlns:style:1.0',
    'text': 'urn:oasis:names:tc:opendocument:xmlns:text:1.0',
    'table': 'urn:oasis:names:tc:opendocument:xmlns:table:1.0',
    'draw': 'urn:oasis:names:tc:opendocument:xmlns:drawing:1.0',
    'fo': 'urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0',
    'xlink': 'http://www.w3.org/1999/xlink',
    'svg': 'urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0',
    'loext': 'urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0',
    'presentation': 'urn:oasis:names:tc:opendocument:xmlns:presentation:1.0',
}
PREFIX = {uri: prefix for prefix, uri in NS.items()}


def q(name: str) -> str:
    """'draw:frame' -> '{urn:…drawing:1.0}frame'"""
    prefix, local = name.split(':')
    return '{%s}%s' % (NS[prefix], local)


def qname(tag: str) -> str:
    """'{urn:…drawing:1.0}frame' -> 'draw:frame' (unbekannte Namensräume: nur lokaler Name)."""
    if tag.startswith('{'):
        uri, local = tag[1:].split('}')
        return f'{PREFIX[uri]}:{local}' if uri in PREFIX else local
    return tag


# ---------------------------------------------------------------- Grundwerte

A4 = (210.0, 297.0)
MAX_PAGES = 300
MAX_ELEMENTS = 2000
MAX_IMAGE_BYTES = 12 * 1024 * 1024
MAX_IMAGE_PIXELS = 40_000_000
MAX_ARCHIVE_BYTES = 95 * 1024 * 1024
SERVER_RASTER = {'png', 'jpg', 'gif', 'webp'}
IMAGE_COLOR = '#253c42'
BOOK_COLOR = '#52796f'

# Schriften des Grundschulbuchs (src/lib/notebook-model.ts).
APP_FONTS = ['Arial', 'Andika', 'Playwrite DE Grund', 'Playwrite DE VA', 'Playwrite DE SAS', 'Lexend',
             'Nunito', 'Atkinson Hyperlegible', 'Merriweather', 'Caveat', 'Bangers']
FONT_ALIASES = {
    'grundschrift': 'Playwrite DE Grund', 'va': 'Playwrite DE VA', 'sas': 'Playwrite DE SAS',
    'leseschrift': 'Andika', 'handschrift': 'Caveat', 'comic': 'Bangers',
}
# Reihenfolge zählt: die erste passende Regel gewinnt.
FONT_RULES = [
    (r'grundschrift|grundschul|^gs($|[ _-])|^gs\d', 'Playwrite DE Grund'),
    (r'schulausgangs|(^|[ _-])sas($|[ _-])', 'Playwrite DE SAS'),
    (r'vereinfacht|(^|[ _-])va($|[ _-])|lateinisch|(^|[ _-])la($|[ _-])', 'Playwrite DE VA'),
    (r'andika|comic sans|sassoon|fibel|druckschrift|schulschrift', 'Andika'),
    (r'lexend', 'Lexend'),
    (r'nunito', 'Nunito'),
    (r'atkinson', 'Atkinson Hyperlegible'),
    (r'sans', 'Arial'),
    (r'merriweather|times|georgia|cambria|garamond|antiqua|palatino|serif|constantia|minion|century|bookman',
     'Merriweather'),
    (r'caveat|segoe print|segoe script|bradley|kristen|ink free|handwrit|script|hand|marker|chalk', 'Caveat'),
    (r'bangers|impact|cooper|showcard|frente|jokerman|chiller|cartoon|berlin sans|bauhaus', 'Bangers'),
]
SYMBOL_FONTS = r'wingdings|webdings|^symbol$|dingbat|marlett|zapf|mt extra|bookshelf symbol'


def app_font(name: str, overrides: dict[str, str]) -> str:
    key = name.strip().lower()
    for pattern, font in overrides.items():
        if pattern.lower() == key:
            return font
    for pattern, font in FONT_RULES:
        if re.search(pattern, key):
            return font
    return 'Arial'


# ---------------------------------------------------------------- Hilfen

UNITS = {'cm': 10.0, 'mm': 1.0, 'in': 25.4, 'pt': 25.4 / 72, 'pc': 25.4 / 6, 'px': 25.4 / 96, '': 1.0}


def mm(value: str | None, default: float = 0.0) -> float:
    if value is None:
        return default
    m = re.fullmatch(r'\s*(-?\d*\.?\d+(?:[eE]-?\d+)?)\s*(cm|mm|in|pt|pc|px)?\s*', value)
    if not m:
        return default
    return float(m.group(1)) * UNITS[m.group(2) or '']


def percent(value: str | None) -> float | None:
    m = re.fullmatch(r'\s*(-?\d*\.?\d+)\s*%\s*', value or '')
    return float(m.group(1)) / 100 if m else None


def hex_color(value: str | None) -> str | None:
    if value and re.fullmatch(r'#[0-9a-fA-F]{6}', value):
        return value.lower()
    return None


def new_id() -> str:
    return str(uuid.uuid4())


def r2(value: float) -> float:
    return round(value, 2)


def image_info(data: bytes) -> tuple[str, int, int] | None:
    """Bildformat und Pixelgröße aus dem Dateikopf."""
    if data[:8] == b'\x89PNG\r\n\x1a\n' and len(data) > 24:
        w, h = struct.unpack('>II', data[16:24])
        return 'png', w, h
    if data[:4] == b'GIF8' and len(data) > 10:
        w, h = struct.unpack('<HH', data[6:10])
        return 'gif', w, h
    if data[:4] == b'RIFF' and data[8:12] == b'WEBP':
        return 'webp', 0, 0
    if data[:3] == b'\xff\xd8\xff':
        i = 2
        while i + 9 < len(data):
            if data[i] != 0xFF:
                i += 1
                continue
            marker = data[i + 1]
            if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7:
                i += 2
                continue
            size = struct.unpack('>H', data[i + 2:i + 4])[0]
            if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
                h, w = struct.unpack('>HH', data[i + 5:i + 9])
                return 'jpg', w, h
            i += 2 + size
        return 'jpg', 0, 0
    return None


# ---------------------------------------------------------------- Geometrie

@dataclass
class Box:
    x: float
    y: float
    w: float
    h: float

    @property
    def x2(self):
        return self.x + self.w

    @property
    def y2(self):
        return self.y + self.h

    def union(self, other: 'Box') -> 'Box':
        x, y = min(self.x, other.x), min(self.y, other.y)
        return Box(x, y, max(self.x2, other.x2) - x, max(self.y2, other.y2) - y)

    def grow(self, d: float) -> 'Box':
        return Box(self.x - d, self.y - d, self.w + 2 * d, self.h + 2 * d)

    def touches(self, other: 'Box', gap: float = 0.0) -> bool:
        return not (self.x2 + gap < other.x or other.x2 + gap < self.x or
                    self.y2 + gap < other.y or other.y2 + gap < self.y)


Matrix = tuple  # (a, b, c, d, e, f): x' = a x + c y + e, y' = b x + d y + f


def mat_mul(m: Matrix, n: Matrix) -> Matrix:
    """Erst m, dann n anwenden."""
    a, b, c, d, e, f = m
    A, B, C, D, E, F = n
    return (A * a + C * b, B * a + D * b, A * c + C * d, B * c + D * d, A * e + C * f + E, B * e + D * f + F)


def parse_transform(value: str) -> Matrix | None:
    """draw:transform; die Teile werden von links nach rechts angewendet."""
    m: Matrix = (1, 0, 0, 1, 0, 0)
    found = False
    for name, args in re.findall(r'(rotate|translate|scale|skewX|skewY|matrix)\s*\(([^)]*)\)', value or ''):
        found = True
        parts = args.replace(',', ' ').split()
        if name == 'rotate':
            a = float(parts[0])
            # ODF: positiver Winkel dreht gegen den Uhrzeigersinn (y nach unten).
            n = (math.cos(a), -math.sin(a), math.sin(a), math.cos(a), 0, 0)
        elif name == 'translate':
            n = (1, 0, 0, 1, mm(parts[0]), mm(parts[1]) if len(parts) > 1 else 0)
        elif name == 'scale':
            sx = float(parts[0])
            n = (sx, 0, 0, float(parts[1]) if len(parts) > 1 else sx, 0, 0)
        elif name == 'skewX':
            n = (1, 0, math.tan(float(parts[0])), 1, 0, 0)
        elif name == 'skewY':
            n = (1, math.tan(float(parts[0])), 0, 1, 0, 0)
        else:
            a, b, c, d = (float(p) for p in parts[:4])
            n = (a, b, c, d, mm(parts[4]), mm(parts[5]))
        m = mat_mul(m, n)
    return m if found else None


def apply(m: Matrix, x: float, y: float) -> tuple[float, float]:
    a, b, c, d, e, f = m
    return a * x + c * y + e, b * x + d * y + f


def pure_rotation(m: Matrix) -> float | None:
    """Drehwinkel in Grad (im Uhrzeigersinn wie CSS), falls m nur dreht und verschiebt."""
    a, b, c, d, _, _ = m
    if abs(a * d - b * c - 1) > 1e-3 or abs(a - d) > 1e-3 or abs(b + c) > 1e-3:
        return None
    return math.degrees(math.atan2(b, a))


# ---------------------------------------------------------------- Formate

class Styles:
    """Formatvorlagen mit Vererbung; getrennt für content.xml und styles.xml."""

    def __init__(self, content: ET.Element, styles: ET.Element):
        self.common: dict[tuple[str, str], ET.Element] = {}
        self.auto = {'content': {}, 'styles': {}}
        self.defaults: dict[str, ET.Element] = {}
        self.fill_images: dict[str, str] = {}
        self.list_styles = {'content': {}, 'styles': {}}
        self.fonts: dict[str, str] = {}
        self.page_layouts: dict[str, ET.Element] = {}
        self.masters: dict[str, ET.Element] = {}
        for scope, root in (('styles', styles), ('content', content)):
            for decl in root.iter(q('style:font-face')):
                self.fonts[decl.get(q('style:name'))] = (decl.get(q('svg:font-family')) or
                                                         decl.get(q('style:name'))).strip('\'"')
            for section in root:
                tag = qname(section.tag)
                target = self.common if tag == 'office:styles' else self.auto[scope] \
                    if tag == 'office:automatic-styles' else None
                if target is None:
                    continue
                for st in section:
                    stag = qname(st.tag)
                    if stag == 'style:style':
                        target[(st.get(q('style:family')), st.get(q('style:name')))] = st
                    elif stag == 'style:default-style':
                        self.defaults[st.get(q('style:family'))] = st
                    elif stag == 'draw:fill-image':
                        self.fill_images[st.get(q('draw:name'))] = st.get(q('xlink:href'))
                    elif stag == 'text:list-style':
                        self.list_styles[scope][st.get(q('style:name'))] = st
                    elif stag == 'style:page-layout':
                        self.page_layouts[st.get(q('style:name'))] = st
        for master in styles.iter(q('style:master-page')):
            self.masters[master.get(q('style:name'))] = master

    def find(self, scope: str, family: str, name: str | None) -> ET.Element | None:
        if not name:
            return None
        found = self.auto[scope].get((family, name))
        return found if found is not None else self.common.get((family, name))

    def chain(self, scope: str, family: str, name: str | None) -> list[ET.Element]:
        """Vorlage samt Eltern, die allgemeinste zuerst."""
        out, seen = [], set()
        st = self.find(scope, family, name)
        while st is not None and id(st) not in seen:
            seen.add(id(st))
            out.append(st)
            st = self.find(scope, family, st.get(q('style:parent-style-name')))
        return out[::-1]

    def props(self, scope: str, family: str, name: str | None, with_default: bool = True) -> dict[str, str]:
        result: dict[str, str] = {}
        sources = ([self.defaults[family]] if with_default and family in self.defaults else []) + \
            self.chain(scope, family, name)
        for st in sources:
            for child in st:
                for key, value in child.attrib.items():
                    result[qname(key)] = value
        return result

    def text_props(self, scope: str, family: str, name: str | None) -> list[dict[str, str]]:
        """Nur die Zeichenattribute, je Vorlage einzeln (für relative Schriftgrößen)."""
        out = []
        for st in self.chain(scope, family, name):
            for child in st:
                if qname(child.tag) == 'style:text-properties':
                    out.append({qname(k): v for k, v in child.attrib.items()})
        return out

    def page_size(self, master_name: str | None) -> tuple[float, float]:
        master = self.masters.get(master_name or '')
        if master is None:
            master = next(iter(self.masters.values()), None)
        layout = self.page_layouts.get(master.get(q('style:page-layout-name')) if master is not None else '')
        if layout is not None:
            for child in layout:
                if qname(child.tag) == 'style:page-layout-properties':
                    return mm(child.get(q('fo:page-width')), A4[0]), mm(child.get(q('fo:page-height')), A4[1])
        return A4


# ---------------------------------------------------------------- Text

@dataclass
class Fmt:
    font: str = 'Liberation Sans'
    size: float = 18.0
    bold: bool = False
    italic: bool = False
    underline: bool = False
    color: str = '#000000'
    upper: bool = False

    def apply(self, props: dict[str, str], fonts: dict[str, str]) -> 'Fmt':
        f = copy.copy(self)
        if 'style:font-name' in props:
            f.font = fonts.get(props['style:font-name'], props['style:font-name'])
        elif 'fo:font-family' in props:
            f.font = props['fo:font-family'].split(',')[0].strip('\'" ')
        if 'fo:font-size' in props:
            rel = percent(props['fo:font-size'])
            f.size = f.size * rel if rel is not None else mm(props['fo:font-size'], f.size * 25.4 / 72) * 72 / 25.4
        if 'fo:font-weight' in props:
            w = props['fo:font-weight']
            f.bold = w == 'bold' or (w.isdigit() and int(w) >= 600)
        if 'fo:font-style' in props:
            f.italic = props['fo:font-style'] in ('italic', 'oblique')
        if 'style:text-underline-style' in props:
            f.underline = props['style:text-underline-style'] != 'none'
        if hex_color(props.get('fo:color')):
            f.color = hex_color(props['fo:color'])
        if 'fo:text-transform' in props:
            f.upper = props['fo:text-transform'] == 'uppercase'
        return f


@dataclass
class Paragraph:
    align: str = 'left'
    line_height: float | None = None  # Faktor
    left: float = 0.0  # Einzug in Quell-mm (linker Rand + Erstzeileneinzug)
    right: float = 0.0
    runs: list = field(default_factory=list)  # [(text, Fmt)]

    @property
    def text(self):
        return ''.join(t for t, _ in self.runs)


ALIGN = {'start': 'left', 'left': 'left', 'center': 'center', 'end': 'right', 'right': 'right',
         'justify': 'justify'}
SKIP_IN_TEXT = {'text:note', 'office:annotation', 'office:annotation-end', 'text:bookmark', 'text:bookmark-start',
                'text:bookmark-end', 'text:soft-page-break', 'text:reference-mark', 'text:reference-mark-start',
                'text:reference-mark-end', 'text:change', 'text:change-start', 'text:change-end',
                'text:sequence-decls', 'draw:frame', 'draw:custom-shape', 'draw:a'}


class TextReader:
    def __init__(self, styles: Styles, scope: str):
        self.styles = styles
        self.scope = scope
        self.inline_shapes = 0

    def fmt(self, base: Fmt, family: str, name: str | None) -> Fmt:
        f = base
        for props in self.styles.text_props(self.scope, family, name):
            f = f.apply(props, self.styles.fonts)
        return f

    def paragraphs(self, container: ET.Element, base: Fmt, base_para: dict[str, str]) -> list[Paragraph]:
        out: list[Paragraph] = []
        self._block(container, base, base_para, out, 0, None)
        while out and not out[-1].text.strip():
            out.pop()
        for p in out:  # Publisher hängt an fast jeden Absatz ein Leerzeichen an.
            while p.runs and not p.runs[-1][0].rstrip(' \t'):
                p.runs.pop()
            if p.runs:
                t, f = p.runs[-1]
                p.runs[-1] = (t.rstrip(' \t'), f)
        return out

    def _block(self, el, base, base_para, out, depth, list_style):
        for child in el:
            tag = qname(child.tag)
            if tag in ('text:p', 'text:h'):
                out.append(self._paragraph(child, base, base_para, ''))
            elif tag == 'text:list':
                style = child.get(q('text:style-name')) or list_style
                self._list(child, base, base_para, out, depth + 1, style)
            elif tag == 'text:section':
                self._block(child, base, base_para, out, depth, list_style)

    def _list(self, lst, base, base_para, out, depth, style):
        number = int(lst.get(q('text:start-value')) or 1)
        for item in lst:
            if qname(item.tag) not in ('text:list-item', 'text:list-header'):
                continue
            first = qname(item.tag) == 'text:list-item'
            for child in item:
                tag = qname(child.tag)
                if tag in ('text:p', 'text:h'):
                    prefix = ''
                    if first:
                        prefix = '  ' * (depth - 1) + self._label(style, depth, number)
                        number += 1
                        first = False
                    out.append(self._paragraph(child, base, base_para, prefix))
                elif tag == 'text:list':
                    self._list(child, base, base_para, out, depth + 1, child.get(q('text:style-name')) or style)

    def _label(self, style_name, depth, number):
        style = self.styles.list_styles[self.scope].get(style_name) or \
            self.styles.list_styles['styles'].get(style_name)
        if style is not None:
            for level in style:
                if int(level.get(q('text:level')) or 1) != depth:
                    continue
                if qname(level.tag) == 'text:list-level-style-number':
                    fmt = level.get(q('style:num-format')) or '1'
                    if not fmt:
                        return ''
                    label = str(number) if fmt == '1' else \
                        chr(ord('a') + (number - 1) % 26) if fmt == 'a' else \
                        chr(ord('A') + (number - 1) % 26) if fmt == 'A' else str(number)
                    return (level.get(q('style:num-prefix')) or '') + label + \
                        (level.get(q('style:num-suffix')) or '.') + ' '
                if qname(level.tag) == 'text:list-level-style-bullet':
                    char = level.get(q('text:bullet-char')) or '•'
                    return ('•' if char in '\uf0b7\uf0a7\uf076\uf0d8' else char) + ' '
        return '• '

    def _paragraph(self, p, base, base_para, prefix) -> Paragraph:
        name = p.get(q('text:style-name'))
        props = dict(base_para)
        props.update(self.styles.props(self.scope, 'paragraph', name, with_default=False))
        para = Paragraph(align=ALIGN.get(props.get('fo:text-align', 'start'), 'left'))
        lh = props.get('fo:line-height')
        if lh and percent(lh) is not None:
            para.line_height = percent(lh)
        para.left = mm(props.get('fo:margin-left')) + mm(props.get('fo:text-indent'))
        para.right = mm(props.get('fo:margin-right'))
        fmt = self.fmt(base, 'paragraph', name)
        if prefix:
            para.runs.append((prefix, fmt))
        self._inline(p, fmt, para.runs)
        para.runs = [(t.upper() if f.upper else t, f) for t, f in para.runs if t]
        return para

    def _inline(self, el, fmt, runs):
        if el.text:
            runs.append((re.sub(r'[\r\n]+', ' ', el.text), fmt))
        for child in el:
            tag = qname(child.tag)
            if tag == 'text:span':
                self._inline(child, self.fmt(fmt, 'text', child.get(q('text:style-name'))), runs)
            elif tag == 'text:s':
                runs.append((' ' * int(child.get(q('text:c')) or 1), fmt))
            elif tag == 'text:tab':
                runs.append(('\t', fmt))
            elif tag == 'text:line-break':
                runs.append(('\n', fmt))
            elif tag in SKIP_IN_TEXT:
                if tag in ('draw:frame', 'draw:custom-shape'):
                    self.inline_shapes += 1
            else:  # text:a, Felder (Seitenzahl, Datum …), text:meta
                self._inline(child, fmt, runs)
            if child.tail:
                runs.append((re.sub(r'[\r\n]+', ' ', child.tail), fmt))


def para_size(p: Paragraph) -> float | None:
    sizes: dict = {}
    for t, f in p.runs:
        if t.strip():
            sizes[f.size] = sizes.get(f.size, 0) + len(t.strip())
    return max(sizes, key=sizes.get) if sizes else None


def line_factor(paras) -> float:
    """Zeilenabstand als CSS-Faktor; „einfach“ in Publisher entspricht etwa 1,2."""
    values = [p.line_height for p in paras if p.line_height]
    return 1.2 * (sum(values) / len(values) if values else 1.0)


def estimate_height(paras, width: float) -> float:
    """Geschätzte Höhe in Quell-mm (mittlere Zeichenbreite ≈ halbe Schriftgröße)."""
    height, factor, last = 0.0, line_factor(paras), 12.0
    for p in paras:
        size = para_size(p) or last
        last = size
        size_mm = size * 25.4 / 72
        per_line = max(1, int(max(width, 1) / (0.5 * size_mm)))
        lines = sum(max(1, math.ceil(len(segment) / per_line)) for segment in p.text.split('\n'))
        height += lines * size_mm * factor
    return height


# ---------------------------------------------------------------- Umwandlung

@dataclass
class RenderJob:
    scope: str  # 'content' oder 'styles' (Masterseite)
    master: str
    nodes: list  # Kopien der XML-Elemente
    box: Box  # Ausschnitt in Quell-mm
    background_of: ET.Element | None = None  # draw:page, deren Hintergrund gerendert wird
    scale: float = 1.0  # Quell-mm -> Heft-mm
    offset: tuple = (0.0, 0.0)
    page_size: tuple = A4
    png: bytes | None = None
    key: str = ''


@dataclass
class Report:
    pages: int = 0
    texts: int = 0
    images: int = 0
    shapes: int = 0
    rendered: int = 0
    fonts: dict = field(default_factory=dict)
    warnings: dict = field(default_factory=dict)  # Hinweis -> Seitenzahlen

    def warn(self, message: str, page: int | None = None):
        pages = self.warnings.setdefault(message, [])
        if page and page not in pages:
            pages.append(page)

    def lines(self):
        for message, pages in self.warnings.items():
            if not pages:
                yield message
                continue
            ranges, start = [], pages[0]
            for a, b in zip(pages, pages[1:] + [None]):
                if b != a + 1:
                    ranges.append(str(start) if start == a else f'{start}–{a}')
                    start = b
            yield f'{"Seite" if len(pages) == 1 else "Seiten"} {", ".join(ranges)}: {message}'


SHAPE_TAGS = {'draw:rect', 'draw:polygon', 'draw:polyline', 'draw:path', 'draw:ellipse', 'draw:circle',
              'draw:line', 'draw:custom-shape', 'draw:connector', 'draw:measure', 'draw:regular-polygon',
              'draw:caption'}
RECT_TYPES = {'rectangle', 'ooxml-rect', 'mso-spt1', 'flowchart-process'}
ELLIPSE_TYPES = {'ellipse', 'ooxml-ellipse', 'mso-spt3', 'flowchart-connector'}


class Converter:
    def __init__(self, odg: Path, args, report: Report):
        self.args = args
        self.report = report
        self.zip = zipfile.ZipFile(odg)
        self.content = ET.fromstring(self.zip.read('content.xml'))
        self.styles_root = ET.fromstring(self.zip.read('styles.xml'))
        self.styles = Styles(self.content, self.styles_root)
        self.names = set(self.zip.namelist())
        self.jobs: list[RenderJob] = []
        self.media: dict[str, bytes] = {}
        self.font_overrides = args.font_overrides
        self.image_fonts = [f.lower() for f in args.image_fonts]

    # -- Koordinaten: Quell-mm -> Seiten-mm des Grundschulbuchs
    def setup_page(self, w: float, h: float):
        landscape = w > h * 1.02
        self.orientation = 'landscape' if landscape else 'portrait'
        tw, th = (A4[1], A4[0]) if landscape else A4
        fit = min(tw / w, th / h)
        self.scale = min(fit, 1.0) if self.args.groesse == 'original' else fit
        self.ox = (tw - w * self.scale) / 2
        self.oy = (th - h * self.scale) / 2
        self.page_w, self.page_h = w, h

    def place(self, box: Box) -> Box:
        s = self.scale
        return Box(self.ox + box.x * s, self.oy + box.y * s, box.w * s, box.h * s)

    def point(self, x: float, y: float) -> tuple[float, float]:
        return self.ox + x * self.scale, self.oy + y * self.scale

    # -- Seiten
    def pages(self) -> list[dict]:
        out = []
        drawing = self.content.find('.//' + q('office:drawing'))
        if drawing is None:
            raise RuntimeError('Die Datei enthält keine Zeichnungsseiten.')
        for number, page in enumerate(drawing.iter(q('draw:page')), 1):
            master = page.get(q('draw:master-page-name')) or ''
            self.setup_page(*self.styles.page_size(master))
            self.page_number = number
            result = {'id': new_id(), 'revision': 0, 'orientation': self.orientation, 'ruling': 'blanko',
                      'elements': []}
            elements: list = []
            if self.args.nur_bilder:
                job = self.queue(RenderJob('content', master, [copy.deepcopy(c) for c in page
                                                              if qname(c.tag).startswith('draw:')],
                                           Box(0, 0, self.page_w, self.page_h), background_of=page))
                elements.append(self.image_for_job(job, Box(0, 0, self.page_w, self.page_h), locked=True,
                                                   alt=f'Seite {number}'))
            else:
                self.page_background(page, master, result, elements)
                master_el = self.styles.masters.get(master)
                if master_el is not None:
                    self.walk(list(master_el), 'styles', master, elements)
                self.walk(list(page), 'content', master, elements)
            result['elements'] = elements
            out.append(result)
            self.report.pages += 1
        return out

    def page_background(self, page, master, result, elements):
        props = {}
        master_el = self.styles.masters.get(master)
        if master_el is not None:
            props.update(self.styles.props('styles', 'drawing-page', master_el.get(q('draw:style-name'))))
        props.update({k: v for k, v in self.styles.props('content', 'drawing-page',
                                                          page.get(q('draw:style-name'))).items()
                      if not k.startswith('draw:fill') or 'draw:fill' in self.styles.props(
                          'content', 'drawing-page', page.get(q('draw:style-name')), with_default=False)})
        fill = props.get('draw:fill', 'none')
        if fill == 'solid' and hex_color(props.get('draw:fill-color')) not in (None, '#ffffff'):
            result['paperColor'] = hex_color(props['draw:fill-color'])
        elif fill in ('bitmap', 'gradient', 'hatch'):
            box = Box(0, 0, self.page_w, self.page_h)
            job = self.queue(RenderJob('content', master, [], box, background_of=page))
            elements.append(self.image_for_job(job, box, locked=True, alt='Seitenhintergrund'))

    # -- Formen durchlaufen; aufeinanderfolgende gerenderte Formen werden zusammengefasst
    def walk(self, nodes, scope, master, elements, link=None):
        for node in nodes:
            tag = qname(node.tag)
            if tag == 'draw:g':
                self.walk(list(node), scope, master, elements, link)
            elif tag == 'draw:a':
                self.walk(list(node), scope, master, elements, node.get(q('xlink:href')) or link)
            elif tag == 'draw:frame':
                self.add(self.frame(node, scope, master), elements, link)
            elif tag in SHAPE_TAGS:
                self.add(self.shape(node, scope, master), elements, link)
            elif tag in ('draw:control', 'draw:page-thumbnail', 'draw:plugin', 'draw:applet'):
                self.report.warn(f'Ein Steuerelement ({tag}) wurde ausgelassen.', self.page_number)
            elif tag.startswith('draw:') and tag not in ('draw:layer-set',):
                self.add([('render', node)], elements, link)

    def add(self, items, elements, link):
        for item in items:
            if item[0] == 'render':
                node = item[1]
                strip = item[2] if len(item) > 2 else False
                scope = item[3] if len(item) > 3 else 'content'
                master = item[4] if len(item) > 4 else ''
                box = self.bbox(node, scope)
                if box is None:
                    continue
                prev = elements[-1] if elements else None
                pending = prev.get('_job') if isinstance(prev, dict) else None
                if pending is not None and pending.scope == scope and \
                        pending.box.touches(box, 1.0) and not pending.background_of:
                    pending.nodes.append(self.render_copy(node, strip))
                    pending.box = pending.box.union(box)
                    continue
                job = RenderJob(scope, master, [self.render_copy(node, strip)], box)
                self.queue(job)
                elements.append({'_job': job})
            else:
                el = item[1]
                if link and re.match(r'https?://', link):
                    el['link'] = {'kind': 'url', 'url': link}
                elements.append(el)

    def queue(self, job: RenderJob) -> RenderJob:
        job.scale = self.scale
        job.offset = (self.ox, self.oy)
        job.page_size = (self.page_w, self.page_h)
        self.jobs.append(job)
        return job

    def render_copy(self, node, strip_text: bool):
        node = copy.deepcopy(node)
        if strip_text:
            for parent in node.iter():
                for child in list(parent):
                    if qname(child.tag) in ('text:p', 'text:h', 'text:list'):
                        parent.remove(child)
        return node

    # -- Begrenzungsrahmen (Quell-mm), inklusive Linienbreite
    def bbox(self, node, scope: str) -> Box | None:
        tag = qname(node.tag)
        if tag in ('draw:g', 'draw:a'):
            box = None
            for child in node:
                b = self.bbox(child, scope)
                if b is not None:
                    box = b if box is None else box.union(b)
            return box
        if tag in ('draw:line', 'draw:connector', 'draw:measure'):
            x1, y1, x2, y2 = (mm(node.get(q(f'svg:{k}'))) for k in ('x1', 'y1', 'x2', 'y2'))
            box = Box(min(x1, x2), min(y1, y2), abs(x2 - x1), abs(y2 - y1))
        else:
            w, h = mm(node.get(q('svg:width'))), mm(node.get(q('svg:height')))
            if node.get(q('svg:width')) is None and node.get(q('svg:height')) is None:
                return None
            m = parse_transform(node.get(q('draw:transform')))
            if m:
                pts = [apply(m, x, y) for x, y in ((0, 0), (w, 0), (0, h), (w, h))]
                xs, ys = [p[0] for p in pts], [p[1] for p in pts]
                box = Box(min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys))
            else:
                box = Box(mm(node.get(q('svg:x'))), mm(node.get(q('svg:y'))), w, h)
        props = self.styles.props(scope, 'graphic', node.get(q('draw:style-name')))
        pad = 0.6 + mm(props.get('svg:stroke-width'), 0.3)
        if props.get('draw:marker-start') or props.get('draw:marker-end'):
            pad += 3 + 4 * mm(props.get('svg:stroke-width'), 0.3)
        if props.get('draw:shadow') == 'visible':
            pad += max(abs(mm(props.get('draw:shadow-offset-x'), 2)), abs(mm(props.get('draw:shadow-offset-y'), 2)))
        return box.grow(pad)

    # -- Rahmen: Text, Bild, Tabelle, Objekt
    def frame(self, node, scope, master):
        box = Box(mm(node.get(q('svg:x'))), mm(node.get(q('svg:y'))),
                  mm(node.get(q('svg:width'))), mm(node.get(q('svg:height'))))
        rotation = 0.0
        transform = parse_transform(node.get(q('draw:transform')))
        if transform:
            rotation = pure_rotation(transform)
            if rotation is None:
                return [('render', node, False, scope, master)]
            cx, cy = apply(transform, box.w / 2, box.h / 2)
            box = Box(cx - box.w / 2, cy - box.h / 2, box.w, box.h)
        props = self.styles.props(scope, 'graphic', node.get(q('draw:style-name')))
        children = {qname(c.tag): c for c in reversed(list(node))}
        if 'draw:text-box' in children:
            return self.text_frame(node, children['draw:text-box'], box, rotation, props, scope, master)
        if 'table:table' in children:
            return self.table(node, children['table:table'], box, scope, master)
        if 'draw:object' in children or 'draw:object-ole' in children:
            return [('render', node, False, scope, master)]
        if 'draw:image' in children:
            return self.picture(node, children['draw:image'], box, rotation, props, scope, master)
        return []

    def text_frame(self, node, text_box, box, rotation, props, scope, master):
        fill, stroke = props.get('draw:fill', 'none'), props.get('draw:stroke', 'none')
        simple = fill in ('none', 'solid') and stroke in ('none', 'solid') and \
            props.get('draw:shadow') != 'visible' and not mm(props.get('draw:corner-radius'))
        items = self.text_items(text_box, box, rotation, props, scope, use_frame=simple)
        if items == 'render':
            return [('render', node, False, scope, master)]
        if not simple:
            return [('render', node, True, scope, master)] + items
        if not items and (fill == 'solid' or stroke == 'solid'):
            return self.rect_shapes(box, props, rotation)
        return items

    def text_items(self, container, box, rotation, props, scope, use_frame=True, base_fmt=None,
                   base_para=None):
        """Textfelder aus Absätzen. Absätze mit anderer Schriftgröße werden eigene, gruppierte
        Textfelder, weil ein Textfeld des Grundschulbuchs nur eine Größe kennt.
        Ergebnis: Liste von ('el', Element) oder 'render' bei Schriften, die nur als Bild gehen."""
        reader = TextReader(self.styles, scope)
        if base_fmt is None:
            base_fmt = Fmt()
            for p in self.styles.text_props(scope, 'graphic', None):
                base_fmt = base_fmt.apply(p, self.styles.fonts)
            base_fmt = base_fmt.apply(props, self.styles.fonts)
        paras = reader.paragraphs(container, base_fmt, base_para or {
            k: v for k, v in props.items() if k in ('fo:text-align', 'fo:line-height')})
        if reader.inline_shapes:
            self.report.warn(f'Bilder oder Formen innerhalb von Textfeldern wurden '
                             'ausgelassen.', self.page_number)
        if not any(p.text.strip() for p in paras):
            return []
        used_fonts = {f.font for p in paras for t, f in p.runs if t.strip()}
        for name in used_fonts:
            if re.search(SYMBOL_FONTS, name.lower()) or name.lower() in self.image_fonts:
                self.report.fonts[name] = 'als Bild'
                return 'render'
        for name in used_fonts:
            self.report.fonts.setdefault(name, app_font(name, self.font_overrides))

        groups: list = []  # [Schriftgröße, [Absätze]]
        for p in paras:
            size = para_size(p)
            if size is None:
                if groups:
                    groups[-1][1].append(p)
                else:
                    groups.append([None, [p]])
            elif groups and (groups[-1][0] is None or abs(groups[-1][0] - size) < 0.5):
                groups[-1][0] = size
                groups[-1][1].append(p)
            else:
                groups.append([size, [p]])
        if rotation:
            groups = [[groups[0][0], paras]]

        frame_fill = props.get('draw:fill') == 'solid' and use_frame
        frame_line = props.get('draw:stroke') == 'solid' and use_frame
        split = len(groups) > 1
        if (frame_fill or frame_line) and not split:
            area = box  # das Textfeld zeichnet Hintergrund und Rahmen samt Innenabstand selbst
        else:
            area = Box(box.x + mm(props.get('fo:padding-left')), box.y + mm(props.get('fo:padding-top')),
                       box.w - mm(props.get('fo:padding-left')) - mm(props.get('fo:padding-right')),
                       box.h - mm(props.get('fo:padding-top')) - mm(props.get('fo:padding-bottom')))
        written = [p for p in paras if p.text.strip()]
        left = max(0.0, min(p.left for p in written))
        right = max(0.0, min(p.right for p in written))
        if area.w - left - right > 5:
            area = Box(area.x + left, area.y, area.w - left - right, area.h)
        valign = props.get('draw:textarea-vertical-align') or props.get('style:vertical-align')

        if not split:
            el = self.text_dict(paras, area, rotation)
            if frame_fill:
                el['background'] = hex_color(props.get('draw:fill-color')) or '#ffffff'
            if frame_line:
                el['borderColor'] = hex_color(props.get('svg:stroke-color')) or '#000000'
                el['borderWidth'] = r2(min(5, max(0.1, mm(props.get('svg:stroke-width'), 0.26) * self.scale)))
            if valign == 'middle':
                el['referenceCentered'] = True
            elif valign == 'bottom':
                estimate = estimate_height(paras, area.w) * self.scale
                if estimate < el['height']:
                    el['y'] = r2(el['y'] + el['height'] - estimate)
                    el['height'] = r2(estimate)
            return [('el', el)]

        group_id = new_id()
        items = []
        if frame_fill or frame_line:
            items = self.rect_shapes(box, props, 0, group={'groupId': group_id})
        heights = [estimate_height(g[1], area.w) for g in groups]
        total = sum(heights) or 1
        shrink = min(1.0, area.h / total)
        y = area.y
        if total < area.h and valign == 'middle':
            y += (area.h - total) / 2
        elif total < area.h and valign == 'bottom':
            y += area.h - total
        for i, (_, group) in enumerate(groups):
            h = heights[i] * shrink
            if i == len(groups) - 1 and valign not in ('middle', 'bottom'):
                h = max(h, area.y2 - y)
            el = self.text_dict(group, Box(area.x, y, area.w, h), 0)
            el['groupId'] = group_id
            items.append(('el', el))
            y += h
        return items

    def text_dict(self, paras, area, rotation):
        counts: dict = {}
        for p in paras:
            for t, f in p.runs:
                for attr in ('font', 'size', 'color'):
                    counts.setdefault(attr, {}).setdefault(getattr(f, attr), 0)
                    counts[attr][getattr(f, attr)] += len(t.strip()) or 0.001
        dominant = {k: max(v, key=v.get) for k, v in counts.items()}
        size = dominant['size'] * self.scale
        if size > 150:
            self.report.warn(f'Sehr große Schrift ({size:.0f} pt) auf 150 pt verkleinert.', self.page_number)
        while paras and not paras[-1].text.strip():
            paras = paras[:-1]
        runs = []
        for i, p in enumerate(paras):
            if i:
                runs.append(['\n', runs[-1][1] if runs else Fmt()])
            for t, f in p.runs:
                if runs and runs[-1][1].bold == f.bold and runs[-1][1].italic == f.italic and \
                        runs[-1][1].underline == f.underline and runs[-1][1].color == f.color:
                    runs[-1][0] += t
                else:
                    runs.append([t, f])
        aligns: dict = {}
        for p in paras:
            aligns[p.align] = aligns.get(p.align, 0) + len(p.text) + 0.001
        place = self.place(area)
        el = {
            'id': new_id(), 'type': 'text',
            'x': r2(place.x), 'y': r2(place.y), 'width': r2(max(place.w, 2)), 'height': r2(max(place.h, 2)),
            'rotation': r2(rotation or 0), 'locked': False,
            'color': dominant['color'], 'text': ''.join(t for t, _ in runs),
            'font': app_font(dominant['font'], self.font_overrides),
            'fontSize': r2(min(150, max(6, size))), 'bold': all(f.bold for t, f in runs if t.strip()),
            'align': max(aligns, key=aligns.get),
            'lineHeight': r2(min(8, max(0.8, line_factor(paras)))),
        }
        if len(runs) > 1:
            el['runs'] = [{'text': t, 'bold': f.bold, 'italic': f.italic, 'underline': f.underline,
                           'color': f.color} for t, f in runs if t]
        else:
            el['italic'] = runs[0][1].italic
            el['underline'] = runs[0][1].underline
        self.report.texts += 1
        return el

    # -- Bilder
    def picture(self, node, image, box, rotation, props, scope, master):
        href = image.get(q('xlink:href')) or ''
        if rotation or not self.passable_image(href, props):
            return [('render', node, False, scope, master)]
        el = self.image_element(href, box, props, node)
        items = [('el', el)]
        if props.get('draw:stroke') == 'solid' or props.get('fo:border', 'none') != 'none':
            border_props = dict(props)
            if props.get('fo:border', 'none') != 'none' and props.get('draw:stroke') != 'solid':
                m = re.match(r'\s*(\S+)\s+\S+\s+(#[0-9a-fA-F]{6})', props['fo:border'])
                if m:
                    border_props.update({'draw:stroke': 'solid', 'svg:stroke-width': m.group(1),
                                         'svg:stroke-color': m.group(2)})
            border_props['draw:fill'] = 'none'
            items.extend(self.rect_shapes(box, border_props, 0, group=el))
        return items

    def passable_image(self, href: str, props: dict) -> bool:
        """Kann das Bild unverändert ins Heft (sonst rendert LibreOffice es)?"""
        if href not in self.names:
            return False
        data = self.zip.read(href)
        info = image_info(data)
        if not info or info[0] not in SERVER_RASTER or len(data) > MAX_IMAGE_BYTES or \
                info[1] * info[2] > MAX_IMAGE_PIXELS:
            return False
        neutral = {'draw:color-mode': 'standard', 'draw:luminance': '0%', 'draw:contrast': '0%',
                   'draw:red': '0%', 'draw:green': '0%', 'draw:blue': '0%', 'draw:gamma': '100%',
                   'draw:image-opacity': '100%', 'draw:color-inversion': 'false'}
        for key, value in neutral.items():
            if key in props and props[key] != value and not (key == 'draw:gamma' and percent(props[key]) == 1):
                return False
        clip = props.get('fo:clip', 'auto')
        if clip not in ('auto', '') and any(mm(v) for v in re.findall(r'-?[\d.]+\w*', clip)):
            return False
        if props.get('style:mirror', 'none') not in ('none', 'horizontal'):
            return False
        if props.get('draw:shadow') == 'visible':
            return False
        return True

    def image_element(self, href, box, props, node, fill=False):
        data = self.zip.read(href)
        ext = image_info(data)[0]
        name = f'media/{hashlib.sha256(data).hexdigest()[:40]}.{ext}'
        self.media[name] = data
        place = self.place(box)
        el = {'id': new_id(), 'type': 'image', 'x': r2(place.x), 'y': r2(place.y),
              'width': r2(max(place.w, 0.5)), 'height': r2(max(place.h, 0.5)), 'rotation': 0,
              'locked': False, 'color': IMAGE_COLOR, 'src': name, 'alt': self.alt(node),
              'crop': {'x': 0, 'y': 0, 'width': 1, 'height': 1}}  # crop = exakt gestreckt wie in Publisher
        if props.get('style:mirror') == 'horizontal':
            el['flip'] = True
        opacity = percent(props.get('draw:opacity')) or percent(props.get('draw:image-opacity'))
        if opacity is not None and opacity < 0.99:
            el['opacity'] = r2(max(0.01, opacity))
        self.report.images += 1
        return el

    def alt(self, node) -> str:
        for tag in ('svg:title', 'svg:desc'):
            child = node.find(q(tag))
            if child is not None and (child.text or '').strip():
                return child.text.strip()[:300]
        return (node.get(q('draw:name')) or '')[:300]

    # -- Formen
    def shape(self, node, scope, master):
        tag = qname(node.tag)
        props = self.styles.props(scope, 'graphic', node.get(q('draw:style-name')))
        has_text = any(qname(c.tag) in ('text:p', 'text:h', 'text:list') and ''.join(c.itertext()).strip()
                       for c in node)
        transform = parse_transform(node.get(q('draw:transform')))
        rotation = pure_rotation(transform) if transform else 0.0
        kind = self.simple_kind(node, tag)
        fill, stroke = props.get('draw:fill', 'none'), props.get('draw:stroke', 'none')
        plain = props.get('draw:shadow') != 'visible' and not props.get('draw:marker-start') and \
            not props.get('draw:marker-end') and stroke in ('none', 'solid')
        if tag == 'draw:line' and plain and stroke == 'solid':
            x1, y1, x2, y2 = (mm(node.get(q(f'svg:{k}'))) for k in ('x1', 'y1', 'x2', 'y2'))
            items = [('el', self.line_element(x1, y1, x2, y2, props))]
            return items + self.shape_text(node, Box(min(x1, x2), min(y1, y2), abs(x2 - x1), abs(y2 - y1)),
                                           props, scope, 0, use_frame=False)
        box = None
        if node.get(q('svg:width')) is not None:
            box = Box(mm(node.get(q('svg:x'))), mm(node.get(q('svg:y'))),
                      mm(node.get(q('svg:width'))), mm(node.get(q('svg:height'))))
            if transform and rotation is not None:
                cx, cy = apply(transform, box.w / 2, box.h / 2)
                box = Box(cx - box.w / 2, cy - box.h / 2, box.w, box.h)
        if box is None or rotation is None:
            return [('render', node, False, scope, master)]
        if kind == 'rect' and plain and fill in ('none', 'solid'):
            if has_text:
                items = self.text_items(node, box, rotation, props, scope)
                if items == 'render':
                    return [('render', node, False, scope, master)]
                if items:
                    return items
            return self.rect_shapes(box, props, rotation)
        if kind == 'rect' and plain and fill == 'bitmap' and not rotation and \
                props.get('style:repeat', 'repeat') == 'stretch':
            href = self.styles.fill_images.get(props.get('draw:fill-image-name'), '')
            if self.passable_image(href, {k: v for k, v in props.items() if k != 'draw:shadow'}):
                el = self.image_element(href, box, props, node)
                items = [('el', el)]
                if stroke == 'solid':
                    items.extend(self.rect_shapes(box, dict(props, **{'draw:fill': 'none'}), 0, group=el))
                return items + self.shape_text(node, box, props, scope, 0)
        if kind == 'ellipse' and plain and fill in ('none', 'solid') and \
                (stroke == 'none' or abs(box.w - box.h) <= 0.03 * max(box.w, box.h)):
            items = [('el', self.ellipse_element(box, props, rotation))]
            return items + self.shape_text(node, box, props, scope, rotation)
        items = [('render', node, has_text, scope, master)]
        return items + (self.shape_text(node, box, props, scope, rotation) if has_text else [])

    def shape_text(self, node, box, props, scope, rotation, use_frame=False):
        items = self.text_items(node, box, rotation, props, scope, use_frame=use_frame)
        return items if isinstance(items, list) else []

    def simple_kind(self, node, tag) -> str | None:
        if tag == 'draw:rect' and not mm(node.get(q('draw:corner-radius'))):
            return 'rect'
        if tag in ('draw:ellipse', 'draw:circle') and node.get(q('draw:kind'), 'full') == 'full':
            return 'ellipse'
        if tag == 'draw:polygon':
            vb = [float(v) for v in (node.get(q('svg:viewBox')) or '0 0 0 0').split()]
            pts = [tuple(float(v) for v in p.split(',')) for p in (node.get(q('draw:points')) or '').split()]
            if pts and pts[0] == pts[-1]:
                pts = pts[:-1]
            if len(pts) == 4 and len(vb) == 4 and vb[2] > 0 and vb[3] > 0:
                xs, ys = {round(p[0]) for p in pts}, {round(p[1]) for p in pts}
                corners = {(x, y) for x in xs for y in ys}
                if len(xs) == 2 and len(ys) == 2 and set((round(p[0]), round(p[1])) for p in pts) == corners and \
                        abs(min(xs) - vb[0]) <= 2 and abs(max(xs) - vb[0] - vb[2]) <= 2 and \
                        abs(min(ys) - vb[1]) <= 2 and abs(max(ys) - vb[1] - vb[3]) <= 2:
                    return 'rect'
        if tag == 'draw:custom-shape':
            geometry = node.find(q('draw:enhanced-geometry'))
            kind = geometry.get(q('draw:type')) if geometry is not None else None
            if geometry is not None and not geometry.get(q('draw:mirror-horizontal')) == 'true':
                if kind in RECT_TYPES:
                    return 'rect'
                if kind in ELLIPSE_TYPES:
                    return 'ellipse'
        return None

    def stroke(self, props) -> tuple[float, str]:
        width = mm(props.get('svg:stroke-width'), 0)
        return max(width, 0.2) * self.scale, hex_color(props.get('svg:stroke-color')) or '#000000'

    def opacity(self, el, props):
        o = percent(props.get('draw:opacity'))
        if o is not None and o < 0.99:
            el['opacity'] = r2(max(0.01, o))
        return el

    def bar(self, x1, y1, x2, y2, thickness, color, group=None):
        """Gerade Linie als schmales, gedrehtes Rechteck: exakt und mit knappem Auswahlrahmen."""
        length = math.hypot(x2 - x1, y2 - y1)
        cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
        w, h = max(length, 0.1) / 0.96, max(thickness, 0.1) / 0.96  # Rechteck füllt 96 % des Elements
        el = {'id': new_id(), 'type': 'shape', 'shape': 'rect', 'x': r2(cx - w / 2), 'y': r2(cy - h / 2),
              'width': r2(w), 'height': r2(h), 'rotation': r2(math.degrees(math.atan2(y2 - y1, x2 - x1))),
              'locked': False, 'color': 'none', 'fill': color, 'strokeWidth': 0}
        if group:
            el['groupId'] = group
        self.report.shapes += 1
        return el

    def line_element(self, x1, y1, x2, y2, props):
        t, color = self.stroke(props)
        (ax, ay), (bx, by) = self.point(x1, y1), self.point(x2, y2)
        return self.opacity(self.bar(ax, ay, bx, by, t, color), props)

    def rect_shapes(self, box, props, rotation, group=None):
        """Rechteck: Fläche plus vier Kantenbalken, zusammen gruppiert."""
        items = []
        place = self.place(box)
        group_id = (group.setdefault('groupId', new_id()) if isinstance(group, dict) else None)
        fill, stroke = props.get('draw:fill', 'none'), props.get('draw:stroke', 'none')
        parts = []
        if fill == 'solid':
            w, h = place.w / 0.96, place.h / 0.96
            cx, cy = place.x + place.w / 2, place.y + place.h / 2
            parts.append({'id': new_id(), 'type': 'shape', 'shape': 'rect', 'x': r2(cx - w / 2),
                          'y': r2(cy - h / 2), 'width': r2(max(w, 0.1)), 'height': r2(max(h, 0.1)),
                          'rotation': r2(rotation or 0), 'locked': False, 'color': 'none',
                          'fill': hex_color(props.get('draw:fill-color')) or '#ffffff', 'strokeWidth': 0})
            self.report.shapes += 1
        if stroke == 'solid':
            t, color = self.stroke(props)
            corners = [(place.x, place.y), (place.x2, place.y), (place.x2, place.y2), (place.x, place.y2)]
            if rotation:
                cx, cy = place.x + place.w / 2, place.y + place.h / 2
                a = math.radians(rotation)
                corners = [(cx + (x - cx) * math.cos(a) - (y - cy) * math.sin(a),
                            cy + (x - cx) * math.sin(a) + (y - cy) * math.cos(a)) for x, y in corners]
            for i in range(4):
                (x1, y1), (x2, y2) = corners[i], corners[(i + 1) % 4]
                length = math.hypot(x2 - x1, y2 - y1) or 1
                ex, ey = (x2 - x1) / length * t / 2, (y2 - y1) / length * t / 2  # Ecken schließen
                parts.append(self.bar(x1 - ex, y1 - ey, x2 + ex, y2 + ey, t, color))
        if len(parts) > 1 or group_id:
            group_id = group_id or new_id()
            for p in parts:
                p['groupId'] = group_id
        for p in parts:
            items.append(('el', self.opacity(p, props)))
        return items

    def ellipse_element(self, box, props, rotation):
        place = self.place(box)
        w, h = place.w / 0.94, place.h / 0.94  # Ellipse füllt 94 % des Elements
        cx, cy = place.x + place.w / 2, place.y + place.h / 2
        fill = hex_color(props.get('draw:fill-color')) or '#ffffff' if props.get('draw:fill') == 'solid' else 'none'
        stroke = props.get('draw:stroke') == 'solid'
        t, color = self.stroke(props)
        self.report.shapes += 1
        return self.opacity({'id': new_id(), 'type': 'shape', 'shape': 'ellipse', 'x': r2(cx - w / 2),
                             'y': r2(cy - h / 2), 'width': r2(w), 'height': r2(h), 'rotation': r2(rotation or 0),
                             'locked': False, 'color': color if stroke else 'none', 'fill': fill,
                             'strokeWidth': r2(min(10, t * 0.94)) if stroke else 0}, props)

    # -- Tabellen: Zellen als Textfelder, Linien und Hintergründe als Bild darunter
    def table(self, node, table, box, scope, master):
        columns = []
        for col in table.iter(q('table:table-column')):
            props = self.styles.props(scope, 'table-column', col.get(q('table:style-name')))
            columns += [mm(props.get('style:column-width'), 0)] * int(col.get(q('table:number-columns-repeated'))
                                                                      or 1)
        rows = [r for r in table.iter(q('table:table-row'))]
        heights = []
        for row in rows:
            props = self.styles.props(scope, 'table-row', row.get(q('table:style-name')))
            heights.append(mm(props.get('style:row-height') or props.get('style:min-row-height'), 0))
        if not columns or not rows:
            return []
        if sum(columns) <= 0:
            columns = [box.w / len(columns)] * len(columns)
        if sum(heights) <= 0:
            heights = [box.h / len(rows)] * len(rows)
        kx, ky = box.w / sum(columns), box.h / sum(heights)
        columns = [c * kx for c in columns]
        heights = [h * ky for h in heights]
        xs = [box.x + sum(columns[:i]) for i in range(len(columns) + 1)]
        ys = [box.y + sum(heights[:i]) for i in range(len(heights) + 1)]
        items, visible = [], False
        for r, row in enumerate(rows):
            c = 0
            for cell in row:
                tag = qname(cell.tag)
                if tag == 'table:covered-table-cell':
                    c += int(cell.get(q('table:number-columns-repeated')) or 1)
                    continue
                if tag != 'table:table-cell':
                    continue
                span_c = int(cell.get(q('table:number-columns-spanned')) or 1)
                span_r = int(cell.get(q('table:number-rows-spanned')) or 1)
                cprops = self.styles.props(scope, 'table-cell', cell.get(q('table:style-name')))
                if cprops.get('draw:fill') in ('solid', 'bitmap', 'gradient') or \
                        hex_color(cprops.get('fo:background-color')) or \
                        any(cprops.get(k, 'none') not in ('none', '') and not cprops.get(k, '').startswith('0')
                            for k in ('fo:border', 'fo:border-top', 'fo:border-bottom', 'fo:border-left',
                                      'fo:border-right')):
                    visible = True
                c2, r2_ = min(c + span_c, len(columns)), min(r + span_r, len(heights))
                if c < len(columns):
                    cell_box = Box(xs[c], ys[r], xs[c2] - xs[c], ys[r2_] - ys[r])
                    el = self.text_items(cell, cell_box, 0, {k: v for k, v in cprops.items()
                                                               if k.startswith('fo:padding') or
                                                               k == 'style:vertical-align'}, scope,
                                           use_frame=False,
                                           base_fmt=self.cell_fmt(scope, cprops))
                    if el == 'render':
                        return [('render', node, False, scope, master)]
                    items.extend(el)
                c += span_c
        if visible:
            items.insert(0, ('render', node, True, scope, master))
        return items

    def cell_fmt(self, scope, cprops):
        f = Fmt()
        for p in self.styles.text_props(scope, 'graphic', None):
            f = f.apply(p, self.styles.fonts)
        return f.apply(cprops, self.styles.fonts)

    # -- gerenderte Teile in Bildelemente verwandeln
    def image_for_job(self, job, box, locked=False, alt=''):
        return {'_job': job, '_locked': locked, '_alt': alt}

    def finish(self, pages):
        for page in pages:
            final = []
            for el in page['elements']:
                job = el.get('_job')
                if job is None:
                    final.append(el)
                    continue
                if not job.png:
                    self.report.warn(f'Ein Teil konnte nicht gerendert werden und fehlt '
                                     f'({len(job.nodes)} Form(en)).')
                    continue
                name = f'media/{hashlib.sha256(job.png).hexdigest()[:40]}.png'
                self.media[name] = job.png
                (ox, oy), s = job.offset, job.scale
                place = Box(ox + job.box.x * s, oy + job.box.y * s, job.box.w * s, job.box.h * s)
                final.append({'id': new_id(), 'type': 'image', 'x': r2(place.x), 'y': r2(place.y),
                              'width': r2(place.w), 'height': r2(place.h), 'rotation': 0,
                              'locked': el.get('_locked', False), 'color': IMAGE_COLOR, 'src': name,
                              'alt': el.get('_alt') or 'Zeichnung aus Publisher', 'fit': 'contain'})
                self.report.rendered += 1
            if len(final) > MAX_ELEMENTS:
                self.report.warn(f'Eine Seite hat {len(final)} Elemente; nur die ersten {MAX_ELEMENTS} bleiben.')
                final = final[:MAX_ELEMENTS]
            page['elements'] = final
        return pages


# ---------------------------------------------------------------- Rendern mit LibreOffice

class Renderer:
    """Baut für jede gerenderte Gruppe eine kleine ODG mit genau diesem Ausschnitt
    und lässt LibreOffice sie als transparentes PNG exportieren."""

    def __init__(self, converter: Converter, soffice: str, profile: Path, workdir: Path, ppm: float):
        self.c = converter
        self.soffice = soffice
        self.profile = profile
        self.workdir = workdir
        self.ppm = ppm
        self.skeletons = {}
        for prefix, uri in self.namespaces().items():
            try:
                ET.register_namespace(prefix, uri)
            except ValueError:
                pass

    def namespaces(self):
        found = {}
        for name in ('content.xml', 'styles.xml'):
            for _, (prefix, uri) in ET.iterparse(self.c.zip.open(name), events=('start-ns',)):
                found.setdefault(prefix, uri)
        return found

    def skeleton(self, keep_background: bool):
        if keep_background in self.skeletons:
            return self.skeletons[keep_background]
        styles = ET.fromstring(self.c.zip.read('styles.xml'))
        fill_images = {}
        for parent in styles.iter():
            for i, child in enumerate(list(parent)):
                if qname(child.tag) == 'draw:fill-image':
                    marker = ET.Element(q('draw:fill-image'), {q('draw:name'): f'__FILL__{len(fill_images)}'})
                    fill_images[len(fill_images)] = (child.get(q('draw:name')), ET.tostring(child, 'unicode'))
                    parent.remove(child)
                    parent.insert(i, marker)
        for props in styles.iter(q('style:page-layout-properties')):
            if not keep_background:
                props.set(q('fo:page-width'), '__PW__')
                props.set(q('fo:page-height'), '__PH__')
            for side in ('top', 'bottom', 'left', 'right'):
                props.set(q(f'fo:margin-{side}'), '0cm')
            if not keep_background:
                props.set(q('draw:fill'), 'none')
        content = ET.fromstring(self.c.zip.read('content.xml'))
        if not keep_background:
            for root in (styles, content):
                for st in root.iter(q('style:style')):
                    if st.get(q('style:family')) == 'drawing-page':
                        for child in st:
                            child.set(q('draw:fill'), 'none')
                            child.attrib.pop(q('fo:background-color'), None)
        for master in styles.iter(q('style:master-page')):
            for child in list(master):
                if qname(child.tag).split(':')[0] in ('draw', 'presentation', 'office'):
                    master.remove(child)
            master.append(ET.Element(q('draw:frame'), {q('draw:name'): f'__MASTER__{master.get(q("style:name"))}'}))
        drawing = content.find('.//' + q('office:drawing'))
        for page in list(drawing):
            drawing.remove(page)
        drawing.append(ET.Element(q('draw:page'), {q('draw:name'): '__PAGE__'}))
        result = (ET.tostring(content, 'unicode'), ET.tostring(styles, 'unicode'), fill_images)
        self.skeletons[keep_background] = result
        return result

    def styles_used(self, nodes, scope) -> tuple[set, set]:
        """Benötigte Füllbilder (Namen) und Bilddateien eines Ausschnitts."""
        names, files = set(), set()
        for node in nodes:
            for el in node.iter():
                for key, value in el.attrib.items():
                    k = qname(key)
                    if k == 'xlink:href' and value in self.c.names:
                        files.add(value)
                    elif k.endswith('style-name'):
                        for family in ('graphic', 'paragraph', 'table-cell', 'presentation'):
                            for st in self.c.styles.chain(scope, family, value):
                                for child in st:
                                    fill = child.get(q('draw:fill-image-name'))
                                    if fill:
                                        names.add(fill)
        return names, files

    @staticmethod
    def shift(node, dx, dy):
        for el in node.iter():
            if el.get(q('draw:transform')):
                el.set(q('draw:transform'), el.get(q('draw:transform')) + f' translate ({-dx:.4f}mm {-dy:.4f}mm)')
                continue
            for a, d in (('x', dx), ('y', dy), ('x1', dx), ('x2', dx), ('y1', dy), ('y2', dy)):
                v = el.get(q(f'svg:{a}'))
                if v is not None and qname(el.tag) != 'svg:linearGradient':
                    el.set(q(f'svg:{a}'), f'{mm(v) - d:.4f}mm')

    def build(self, job: RenderJob, path: Path) -> tuple[int, int]:
        keep_bg = job.background_of is not None
        content, styles, fill_images = self.skeleton(keep_bg)
        box = job.box
        if keep_bg:
            box = Box(0, 0, *job.page_size)
            job.box = box
        # Seitengröße auf 1 mm runden, damit gleiche Größen gemeinsam gerendert werden.
        w, h = math.ceil(box.w), math.ceil(box.h)
        ppm = self.ppm * job.scale
        ppm = min(ppm, 4000 / max(w, h))
        px, py = max(1, round(w * ppm)), max(1, round(h * ppm))
        job.box = Box(box.x, box.y, w, h)
        nodes = []
        for node in job.nodes:
            n = copy.deepcopy(node)
            if not keep_bg:
                self.shift(n, box.x, box.y)
            nodes.append(n)
        fills, files = self.styles_used(nodes, job.scope)
        if keep_bg:
            props = self.c.styles.props('content', 'drawing-page', job.background_of.get(q('draw:style-name')))
            if props.get('draw:fill-image-name'):
                fills.add(props['draw:fill-image-name'])
            master = self.c.styles.masters.get(job.master)
            if master is not None:
                mprops = self.c.styles.props('styles', 'drawing-page', master.get(q('draw:style-name')))
                if mprops.get('draw:fill-image-name'):
                    fills.add(mprops['draw:fill-image-name'])
        for i, (name, xml) in fill_images.items():
            if name in fills:
                href = self.c.styles.fill_images.get(name)
                if href in self.c.names:
                    files.add(href)
        page_xml = ''.join(ET.tostring(n, 'unicode') for n in nodes)
        page_attrs = f'draw:name="r" draw:master-page-name="{job.master}"'
        if keep_bg and job.background_of.get(q('draw:style-name')):
            page_attrs += f' draw:style-name="{job.background_of.get(q("draw:style-name"))}"'
        content_page = f'<draw:page {page_attrs}>{page_xml if job.scope == "content" else ""}</draw:page>'
        content = re.sub(r'<draw:page draw:name="__PAGE__"\s*/>', lambda _: content_page, content)
        styles = re.sub(r'<draw:fill-image draw:name="__FILL__(\d+)"\s*/>',
                        lambda m: fill_images[int(m.group(1))][1] if fill_images[int(m.group(1))][0] in fills else '',
                        styles)
        styles = re.sub(r'<draw:frame draw:name="__MASTER__([^"]*)"\s*/>',
                        lambda m: page_xml if job.scope == 'styles' and m.group(1) == job.master else '', styles)
        styles = styles.replace('__PW__', f'{w}mm').replace('__PH__', f'{h}mm')
        with zipfile.ZipFile(path, 'w') as z:
            z.writestr(zipfile.ZipInfo('mimetype'), 'application/vnd.oasis.opendocument.graphics')
            z.writestr('content.xml', content, zipfile.ZIP_DEFLATED)
            z.writestr('styles.xml', styles, zipfile.ZIP_DEFLATED)
            # LibreOffice lehnt Dateien ab, deren Manifest eine andere ODF-Version nennt.
            version = self.c.content.get(q('office:version')) or '1.2'
            entries = ''.join(f'<manifest:file-entry manifest:full-path="{f}" manifest:media-type=""/>'
                              for f in sorted(files))
            z.writestr('META-INF/manifest.xml',
                       '<?xml version="1.0" encoding="UTF-8"?><manifest:manifest xmlns:manifest='
                       f'"urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="{version}">'
                       f'<manifest:file-entry manifest:full-path="/" manifest:version="{version}" '
                       'manifest:media-type="application/vnd.oasis.opendocument.graphics"/><manifest:file-entry '
                       'manifest:full-path="content.xml" manifest:media-type="text/xml"/><manifest:file-entry '
                       f'manifest:full-path="styles.xml" manifest:media-type="text/xml"/>{entries}'
                       '</manifest:manifest>', zipfile.ZIP_DEFLATED)
            for f in sorted(files):
                z.writestr(f, self.c.zip.read(f))
        job.key = hashlib.sha256(path.read_bytes()).hexdigest()
        return px, py

    def run(self, jobs: list[RenderJob], progress):
        if not jobs:
            return
        batches: dict[tuple[int, int], list] = {}
        unique: dict[str, Path] = {}
        same: dict[int, str] = {}
        for i, job in enumerate(jobs):
            path = self.workdir / f'r{i:05d}.odg'
            size = self.build(job, path)
            if job.key in unique:
                same[i] = job.key
                path.unlink()
                continue
            unique[job.key] = path
            batches.setdefault(size, []).append((i, path))
        done, total = 0, len(unique)
        results: dict[str, bytes] = {}
        for (px, py), entries in batches.items():
            for start in range(0, len(entries), 40):
                chunk = entries[start:start + 40]
                options = json.dumps({'PixelWidth': {'type': 'long', 'value': str(px)},
                                      'PixelHeight': {'type': 'long', 'value': str(py)},
                                      'Translucent': {'type': 'long', 'value': '1'}})
                outdir = self.workdir / f'png-{px}x{py}'
                run_soffice(self.soffice, self.profile,
                            ['--convert-to', f'png:draw_png_Export:{options}', '--outdir', str(outdir)] +
                            [str(p) for _, p in chunk])
                for i, path in chunk:
                    png = outdir / (path.stem + '.png')
                    if png.exists():
                        results[jobs[i].key] = png.read_bytes()
                done += len(chunk)
                progress(f'  Gerendert: {done} von {total}')
        for job in jobs:
            job.png = results.get(job.key)


# ---------------------------------------------------------------- LibreOffice

def find_soffice(explicit: str | None) -> str:
    candidates = [explicit] if explicit else []
    candidates += [shutil.which('soffice'), shutil.which('libreoffice')]
    if sys.platform == 'win32':
        for base in (os.environ.get('ProgramFiles', r'C:\Program Files'),
                     os.environ.get('ProgramFiles(x86)', r'C:\Program Files (x86)')):
            candidates += [str(Path(base) / 'LibreOffice' / 'program' / 'soffice.com'),
                           str(Path(base) / 'LibreOffice' / 'program' / 'soffice.exe')]
    elif sys.platform == 'darwin':
        candidates.append('/Applications/LibreOffice.app/Contents/MacOS/soffice')
    for c in candidates:
        if c and Path(c).exists():
            return c
    raise SystemExit('LibreOffice wurde nicht gefunden. Bitte LibreOffice installieren '
                     '(https://de.libreoffice.org) oder den Pfad mit --soffice angeben.')


def run_soffice(soffice: str, profile: Path, args: list[str]):
    command = [soffice, '--headless', '--norestore', '--nologo', '--nolockcheck',
               f'-env:UserInstallation={profile.as_uri()}'] + args
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=1800)
    if result.returncode != 0:
        raise RuntimeError('LibreOffice meldet einen Fehler: ' +
                           (result.stderr or result.stdout).decode(errors='replace').strip()[-500:])


# ---------------------------------------------------------------- Ablauf

def write_book(path: Path, title: str, pages: list, media: dict[str, bytes]):
    now = '1970-01-01T00:00:00.000Z'
    used = set()
    for page in pages:
        for el in page['elements']:
            if el.get('src'):
                used.add(el['src'])
    book = {
        'format': 'grundschulbuch', 'version': 1,
        'book': {'id': new_id(), 'ownerId': '', 'ownerRole': 'lehrkraft', 'title': title[:120] or 'Publisher',
                 'color': BOOK_COLOR, 'createdAt': now, 'updatedAt': now, 'revision': 0,
                 'pageIds': [p['id'] for p in pages], 'classId': None, 'sourceId': None,
                 'allowChildPages': False},
        'pages': pages, 'media': {},
    }
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('heft.json', json.dumps(book, ensure_ascii=False, separators=(',', ':')))
        for name in sorted(used):
            z.writestr(name, media[name], zipfile.ZIP_STORED)


def split_by_size(pages, media):
    """Teilt sehr große Hefte, damit jede Datei unter der Importgrenze bleibt."""
    parts, current, size, seen = [], [], 0, set()
    for page in pages:
        add = {el['src'] for el in page['elements'] if el.get('src')} - seen
        extra = sum(len(media[s]) for s in add)
        if current and (size + extra > MAX_ARCHIVE_BYTES or len(current) >= MAX_PAGES):
            parts.append(current)
            current, size, seen = [], 0, set()
            add = {el['src'] for el in page['elements'] if el.get('src')}
            extra = sum(len(media[s]) for s in add)
        current.append(page)
        size += extra
        seen |= add
    if current:
        parts.append(current)
    return parts


def convert(source: Path, args, soffice: str, workroot: Path) -> list[Path]:
    report = Report()
    work = Path(tempfile.mkdtemp(prefix='pub2grundschulbuch-', dir=None if args.behalten else workroot))
    profile = workroot / 'profil'
    if source.suffix.lower() == '.odg':
        odg = source
    else:
        print(f'  LibreOffice liest {source.name} …')
        safe = work / ('quelle' + source.suffix.lower())
        shutil.copyfile(source, safe)
        run_soffice(soffice, profile, ['--convert-to', 'odg', '--outdir', str(work), str(safe)])
        odg = work / 'quelle.odg'
        if not odg.exists():
            raise RuntimeError('LibreOffice konnte die Datei nicht öffnen.')
    converter = Converter(odg, args, report)
    pages = converter.pages()
    if not pages:
        raise RuntimeError('Die Datei enthält keine Seiten.')
    renderer = Renderer(converter, soffice, profile, work, args.aufloesung)
    if converter.jobs:
        print(f'  {len(converter.jobs)} Zeichnungsteil(e) werden als Bild gerendert …')
    renderer.run(converter.jobs, lambda m: print(m))
    pages = converter.finish(pages)
    outdir = Path(args.ausgabe) if args.ausgabe else source.parent
    outdir.mkdir(parents=True, exist_ok=True)
    parts = split_by_size(pages, converter.media)
    written = []
    for n, part in enumerate(parts, 1):
        suffix = f' (Teil {n})' if len(parts) > 1 else ''
        target = outdir / f'{source.stem}{suffix}.grundschulbuch'
        write_book(target, source.stem + suffix, part, converter.media)
        written.append(target)
    print(f'  {report.pages} Seite(n): {report.texts} Textfelder, {report.images} Bilder, '
          f'{report.shapes} Formen, {report.rendered} gerenderte Zeichnungsteile')
    if report.fonts:
        print('  Schriften: ' + '; '.join(f'{k} → {v}' for k, v in sorted(report.fonts.items())))
    for line in report.lines():
        print(f'  Hinweis: {line}')
    if not args.behalten:
        shutil.rmtree(work, ignore_errors=True)
    else:
        print(f'  Zwischendateien: {work}')
    return written


def parse_font_override(value: str) -> tuple[str, str]:
    if '=' not in value:
        raise argparse.ArgumentTypeError('Format: "Publisher-Schrift=Schrift im Grundschulbuch"')
    source, target = (v.strip() for v in value.split('=', 1))
    target = FONT_ALIASES.get(target.lower(), target)
    match = next((f for f in APP_FONTS if f.lower() == target.lower()), None)
    if not match:
        raise argparse.ArgumentTypeError(f'Unbekannte Schrift „{target}“. Möglich: {", ".join(APP_FONTS)}')
    return source, match


def main(argv=None):
    parser = argparse.ArgumentParser(
        prog='pub2grundschulbuch',
        description='Wandelt Microsoft-Publisher-Dateien (.pub) in Heftdateien (.grundschulbuch) um, '
                    'die im Grundschulbuch unter „Importieren“ geladen werden.')
    parser.add_argument('dateien', nargs='+', help='.pub-Dateien oder Ordner mit .pub-Dateien')
    parser.add_argument('-o', '--ausgabe', help='Zielordner (Standard: neben der Publisher-Datei)')
    parser.add_argument('--groesse', choices=['anpassen', 'original'], default='anpassen',
                        help='anpassen: Seite füllt A4 (Standard); original: Originalgröße, nur zu große '
                             'Seiten werden verkleinert')
    parser.add_argument('--schrift', action='append', type=parse_font_override, default=[], metavar='ALT=NEU',
                        help='Schriftzuordnung festlegen, z. B. --schrift "Comic Sans MS=Andika" '
                             f'(Schriften: {", ".join(APP_FONTS)})')
    parser.add_argument('--als-bild', action='append', default=[], metavar='SCHRIFT',
                        help='Texte in dieser Schrift als Bild übernehmen (z. B. Symbolschriften)')
    parser.add_argument('--nur-bilder', action='store_true',
                        help='jede Seite als ein einziges Bild übernehmen (wie der PDF-Import)')
    parser.add_argument('--aufloesung', type=float, default=8.0, metavar='PX_JE_MM',
                        help='Auflösung gerenderter Teile in Pixel je mm auf der A4-Seite (Standard 8 ≈ 200 dpi)')
    parser.add_argument('--soffice', help='Pfad zu LibreOffice (soffice)')
    parser.add_argument('--behalten', action='store_true', help='Zwischendateien zur Fehlersuche behalten')
    args = parser.parse_args(argv)
    args.font_overrides = dict(args.schrift)
    args.image_fonts = args.als_bild
    args.aufloesung = min(max(args.aufloesung, 2.0), 20.0)
    sources: list[Path] = []
    for item in args.dateien:
        path = Path(item)
        if path.is_dir():
            sources += sorted(p for p in path.iterdir() if p.suffix.lower() == '.pub')
        elif path.exists():
            sources.append(path)
        else:
            print(f'Nicht gefunden: {path}', file=sys.stderr)
    if not sources:
        parser.error('keine Publisher-Dateien gefunden')
    soffice = find_soffice(args.soffice)
    failures = 0
    with tempfile.TemporaryDirectory(prefix='pub2grundschulbuch-') as tmp:
        for source in sources:
            print(f'{source.name}')
            try:
                for target in convert(source, args, soffice, Path(tmp)):
                    print(f'  → {target}')
            except Exception as error:  # eine kaputte Datei soll die übrigen nicht aufhalten
                failures += 1
                print(f'  Fehler: {error}', file=sys.stderr)
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
