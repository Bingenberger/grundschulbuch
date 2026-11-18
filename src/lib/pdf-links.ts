// Anklickbare Flächen im PDF: Links von Elementen (Internetseite oder Heftseite)
// und eingebettete Internetinhalte. Koordinaten in Millimetern auf dem Blatt,
// für gedrehte Elemente das umschließende Rechteck.
import type { PDFDocument, PDFPage, PDFName as Name, PDFString as Str } from 'pdf-lib';
import type { Page } from './notebook-model';

export type PdfLink = {
  x: number;
  y: number;
  width: number;
  height: number;
} & ({ uri: string } | { pageId: string });

const WEB = /^(https?:\/\/|mailto:)/i;

export function pdfLinks(page: Page): PdfLink[] {
  const sheetW = page.orientation === 'landscape' ? 297 : 210,
    sheetH = page.orientation === 'landscape' ? 210 : 297;
  const out: PdfLink[] = [];
  for (const el of page.elements) {
    let target: { uri: string } | { pageId: string } | null = null;
    if (el.link?.kind === 'url' && WEB.test(el.link.url.trim())) target = { uri: el.link.url.trim() };
    else if (el.link?.kind === 'page' && el.link.pageId) target = { pageId: el.link.pageId };
    else if (el.type === 'embed' && el.url && WEB.test(el.url.trim())) target = { uri: el.url.trim() };
    if (!target || !(el.width > 0) || !(el.height > 0)) continue;
    const a = ((el.rotation || 0) * Math.PI) / 180,
      cos = Math.abs(Math.cos(a)),
      sin = Math.abs(Math.sin(a)),
      halfW = (el.width * cos + el.height * sin) / 2,
      halfH = (el.width * sin + el.height * cos) / 2,
      cx = el.x + el.width / 2,
      cy = el.y + el.height / 2;
    const x0 = Math.max(0, cx - halfW),
      y0 = Math.max(0, cy - halfH),
      x1 = Math.min(sheetW, cx + halfW),
      y1 = Math.min(sheetH, cy + halfH);
    if (x1 - x0 < 0.5 || y1 - y0 < 0.5) continue;
    out.push({ x: x0, y: y0, width: x1 - x0, height: y1 - y0, ...target });
  }
  return out;
}

/** Legt die Links als Link-Anmerkungen auf die fertigen PDF-Seiten
 *  (`added[i]` gehört zu `pages[i]`); Seitenlinks nur zu Seiten im PDF. */
export function addPdfLinks(
  pdf: PDFDocument,
  pages: Page[],
  added: PDFPage[],
  lib: { PDFName: typeof Name; PDFString: typeof Str },
) {
  const k = 72 / 25.4,
    index = new Map(pages.map((p, i) => [p.id, i]));
  pages.forEach((page, i) => {
    const target = added[i],
      height = target.getHeight(),
      annots = [];
    for (const link of pdfLinks(page)) {
      const rect = [link.x * k, height - (link.y + link.height) * k, (link.x + link.width) * k, height - link.y * k];
      let action;
      if ('uri' in link) action = { A: { Type: 'Action', S: 'URI', URI: lib.PDFString.of(link.uri) } };
      else {
        const to = index.get(link.pageId);
        if (to === undefined) continue;
        action = { Dest: [added[to].ref, 'Fit'] };
      }
      annots.push(
        pdf.context.register(
          pdf.context.obj({ Type: 'Annot', Subtype: 'Link', Rect: rect, Border: [0, 0, 0], ...action }),
        ),
      );
    }
    if (annots.length) target.node.set(lib.PDFName.of('Annots'), pdf.context.obj(annots));
  });
}
