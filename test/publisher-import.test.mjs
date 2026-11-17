// Publisher-Import (scripts/publisher/pub2grundschulbuch.py): eine kleine ODF-Zeichnung,
// wie LibreOffice sie aus einer .pub-Datei macht, wird in eine Heftdatei umgewandelt.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { strToU8, strFromU8, zipSync, unzipSync } from 'fflate';
import sharp from 'sharp';

const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-publisher-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'test-secret-for-publisher'.padEnd(48, 'x');
const books = await import('../src/lib/notebooks.mjs');
after(() => fs.rm(directory, { recursive: true, force: true }));

const has = (command, args) => spawnSync(command, args, { stdio: 'ignore' }).status === 0;
const ready = has('python3', ['--version']) && has('soffice', ['--version']);

const NS = `xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" office:version="1.3"`;
const graphic = (name, props, text = '') =>
  `<style:style style:name="${name}" style:family="graphic"><style:graphic-properties ${props}/>${text}</style:style>`;
const textStyle = (name, props) =>
  `<style:style style:name="${name}" style:family="text"><style:text-properties ${props}/></style:style>`;

async function drawing() {
  const png = await sharp({ create: { width: 40, height: 20, channels: 3, background: '#e53935' } }).png().toBuffer();
  const content = `<?xml version="1.0" encoding="UTF-8"?><office:document-content ${NS}>
<office:font-face-decls><style:font-face style:name="Grundschrift" svg:font-family="Grundschrift"/><style:font-face style:name="Wingdings" svg:font-family="Wingdings"/></office:font-face-decls>
<office:automatic-styles>
${graphic('gr1', 'draw:stroke="none" draw:fill="none" fo:padding-top="1mm" fo:padding-bottom="1mm" fo:padding-left="2mm" fo:padding-right="1mm"')}
${graphic('gr2', 'draw:stroke="none" draw:fill="solid" draw:fill-color="#ffcc00"')}
${graphic('gr3', 'draw:stroke="solid" svg:stroke-width="1mm" svg:stroke-color="#0000ff" draw:fill="none"')}
${graphic('gr4', 'draw:stroke="none" draw:fill="bitmap" draw:fill-image-name="Bild" style:repeat="stretch"')}
${graphic('gr5', 'draw:stroke="solid" svg:stroke-width="0.5mm" svg:stroke-color="#000000" draw:fill="solid" draw:fill-color="#00aa00"')}
${graphic('gr6', 'draw:stroke="solid" svg:stroke-width="0.4mm" svg:stroke-color="#ff0000" draw:fill="solid" draw:fill-color="#eeeeee"')}
<style:style style:name="P1" style:family="paragraph"><style:paragraph-properties fo:text-align="center" fo:margin-left="5mm"/></style:style>
${textStyle('T1', 'style:font-name="Grundschrift" fo:font-size="40pt" fo:font-weight="bold" fo:color="#112233"')}
${textStyle('T2', 'style:font-name="Grundschrift" fo:font-size="20pt" fo:color="#112233"')}
${textStyle('T3', 'style:font-name="Grundschrift" fo:font-size="20pt" fo:font-style="italic" fo:color="#cc0000"')}
${textStyle('T4', 'style:font-name="Wingdings" fo:font-size="20pt"')}
<style:style style:name="co1" style:family="table-column"><style:table-column-properties style:column-width="4cm"/></style:style>
<style:style style:name="ro1" style:family="table-row"><style:table-row-properties style:row-height="1cm"/></style:style>
</office:automatic-styles>
<office:body><office:drawing><draw:page draw:name="page1" draw:master-page-name="M">
<draw:frame draw:style-name="gr1" svg:x="1cm" svg:y="1cm" svg:width="12cm" svg:height="6cm"><draw:text-box>
<text:p text:style-name="P1"><text:span text:style-name="T1">Überschrift </text:span></text:p>
<text:p text:style-name="P1"><text:span text:style-name="T2">Erster Satz</text:span><text:s/><text:span text:style-name="T3">rot</text:span></text:p>
<text:p text:style-name="P1"><text:span text:style-name="T2">Zweiter Satz</text:span></text:p>
</draw:text-box></draw:frame>
<draw:polygon draw:style-name="gr2" svg:x="1cm" svg:y="8cm" svg:width="4cm" svg:height="2cm" svg:viewBox="0 0 4000 2000" draw:points="0,0 4000,0 4000,2000 0,2000"><text:p/></draw:polygon>
<draw:line draw:style-name="gr3" svg:x1="1cm" svg:y1="11cm" svg:x2="11cm" svg:y2="11cm"><text:p/></draw:line>
<draw:polygon draw:style-name="gr4" svg:x="6cm" svg:y="8cm" svg:width="4cm" svg:height="2cm" svg:viewBox="0 0 4000 2000" draw:points="0,0 4000,0 4000,2000 0,2000"><svg:title>Rote Fläche</svg:title><text:p/></draw:polygon>
<draw:path draw:style-name="gr5" svg:x="12cm" svg:y="8cm" svg:width="4cm" svg:height="4cm" svg:viewBox="0 0 4000 4000" svg:d="M0 4000 L2000 0 L4000 4000 Z"><text:p/></draw:path>
<draw:frame draw:style-name="gr1" svg:width="6cm" svg:height="1cm" draw:transform="rotate (0.5235987755983) translate (3cm 15cm)"><draw:text-box><text:p><text:span text:style-name="T2">gedreht</text:span></text:p></draw:text-box></draw:frame>
<draw:frame draw:style-name="gr1" svg:x="1cm" svg:y="18cm" svg:width="5cm" svg:height="1cm"><draw:text-box><text:p><text:span text:style-name="T4">J</text:span></text:p></draw:text-box></draw:frame>
<draw:rect draw:style-name="gr6" svg:x="1cm" svg:y="20cm" svg:width="8cm" svg:height="2cm"><text:p><text:span text:style-name="T2">im Kasten</text:span></text:p></draw:rect>
<draw:frame draw:style-name="gr1" svg:x="10cm" svg:y="20cm" svg:width="8cm" svg:height="2cm"><table:table><table:table-column table:style-name="co1" table:number-columns-repeated="2"/>
<table:table-row table:style-name="ro1"><table:table-cell><text:p><text:span text:style-name="T2">A1</text:span></text:p></table:table-cell><table:table-cell><text:p><text:span text:style-name="T2">B1</text:span></text:p></table:table-cell></table:table-row>
<table:table-row table:style-name="ro1"><table:table-cell table:number-columns-spanned="2"><text:p><text:span text:style-name="T2">unten</text:span></text:p></table:table-cell><table:covered-table-cell/></table:table-row>
</table:table></draw:frame>
</draw:page></office:drawing></office:body></office:document-content>`;
  const styles = `<?xml version="1.0" encoding="UTF-8"?><office:document-styles ${NS}>
<office:styles><draw:fill-image draw:name="Bild" xlink:href="Pictures/bild.png" xlink:type="simple" xlink:show="embed" xlink:actuate="onLoad"/>
<style:default-style style:family="graphic"><style:text-properties fo:font-size="18pt"/></style:default-style></office:styles>
<office:automatic-styles><style:page-layout style:name="PL"><style:page-layout-properties fo:page-width="21cm" fo:page-height="29.7cm" fo:margin-top="0cm" fo:margin-bottom="0cm" fo:margin-left="0cm" fo:margin-right="0cm"/></style:page-layout></office:automatic-styles>
<office:master-styles><style:master-page style:name="M" style:page-layout-name="PL"/></office:master-styles></office:document-styles>`;
  const manifest = `<?xml version="1.0" encoding="UTF-8"?><manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3"><manifest:file-entry manifest:full-path="/" manifest:version="1.3" manifest:media-type="application/vnd.oasis.opendocument.graphics"/><manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/><manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/><manifest:file-entry manifest:full-path="Pictures/bild.png" manifest:media-type="image/png"/></manifest:manifest>`;
  return zipSync({
    mimetype: [strToU8('application/vnd.oasis.opendocument.graphics'), { level: 0 }],
    'content.xml': strToU8(content),
    'styles.xml': strToU8(styles),
    'META-INF/manifest.xml': strToU8(manifest),
    'Pictures/bild.png': new Uint8Array(png),
  });
}

test('Publisher-Zeichnung wird zu einer gültigen, bearbeitbaren Heftdatei', { skip: !ready && 'python3 oder LibreOffice fehlt', timeout: 180000 }, async () => {
  const source = path.join(directory, 'Arbeitsblatt.odg');
  await fs.writeFile(source, await drawing());
  const log = execFileSync('python3', ['scripts/publisher/pub2grundschulbuch.py', '-o', directory, source], { encoding: 'utf8' });
  assert.match(log, /Grundschrift → Playwrite DE Grund/);
  const files = unzipSync(new Uint8Array(await fs.readFile(path.join(directory, 'Arbeitsblatt.grundschulbuch'))));
  const data = JSON.parse(strFromU8(files['heft.json']));
  assert.equal(data.format, 'grundschulbuch');
  assert.equal(data.version, 1);
  assert.equal(data.book.title, 'Arbeitsblatt');
  assert.equal(data.pages.length, 1);
  // Der Import ersetzt media/… durch Adressen im Medienspeicher (importPortable).
  const stored = JSON.parse(JSON.stringify(data.pages[0]).replace(/"media\/[a-f0-9]{40}\.\w+"/g, `"/api/medien/${'a'.repeat(64)}.webp"`));
  const page = books.validatePage(stored);
  assert.equal(page.orientation, 'portrait');
  const els = data.pages[0].elements;
  const texts = els.filter((e) => e.type === 'text');
  const byText = (t) => texts.find((e) => e.text.includes(t));

  // Absätze mit anderer Größe werden eigene, gemeinsam gruppierte Textfelder.
  const title = byText('Überschrift'), body = byText('Erster Satz');
  assert.equal(title.fontSize, 40);
  assert.equal(title.bold, true);
  assert.equal(title.font, 'Playwrite DE Grund');
  assert.equal(title.align, 'center');
  assert.equal(body.fontSize, 20);
  assert.equal(body.text, 'Erster Satz rot\nZweiter Satz');
  assert.ok(title.groupId && title.groupId === body.groupId);
  assert.ok(body.y > title.y);
  assert.deepEqual(body.runs.find((r) => r.text === 'rot'), { text: 'rot', bold: false, italic: true, underline: false, color: '#cc0000' });
  // Innenabstand und Absatzeinzug: 1 cm + 2 mm + 5 mm
  assert.equal(title.x, 17);

  // Gedreht um 30° gegen den Uhrzeigersinn, Mittelpunkt bleibt erhalten.
  const turned = byText('gedreht');
  assert.equal(turned.rotation, -30);
  const cx = 30 + Math.cos(Math.PI / 6) * 30 + Math.sin(Math.PI / 6) * 5;
  assert.ok(Math.abs(turned.x + turned.width / 2 - (cx - 0.5)) < 1.5, `Mitte x ${turned.x + turned.width / 2}`);

  // Rechteck mit Rahmen und Text -> ein Textfeld mit Hintergrund und Rahmen
  const box = byText('im Kasten');
  assert.equal(box.background, '#eeeeee');
  assert.equal(box.borderColor, '#ff0000');
  assert.equal(box.borderWidth, 0.4);

  // Tabelle: jede Zelle ein Textfeld, verbundene Zellen über die volle Breite
  assert.ok(byText('A1') && byText('B1'));
  assert.ok(byText('B1').x > byText('A1').x + 30);
  assert.ok(byText('unten').width > 70);

  // Symbolschrift wird nicht als falscher Text übernommen.
  assert.ok(!texts.some((e) => e.text === 'J'));

  // Fläche und Linie als native Formen
  const shapes = els.filter((e) => e.type === 'shape');
  const fill = shapes.find((e) => e.fill === '#ffcc00');
  assert.equal(fill.shape, 'rect');
  assert.equal(fill.color, 'none');
  assert.ok(Math.abs(fill.width * 0.96 - 40) < 0.1 && Math.abs(fill.height * 0.96 - 20) < 0.1);
  const line = shapes.find((e) => e.fill === '#0000ff');
  assert.equal(line.rotation, 0);
  assert.ok(Math.abs(line.width * 0.96 - 100) < 0.1 && Math.abs(line.height * 0.96 - 1) < 0.05);

  // Bildfüllung wird ein Bild, das Dreieck ein gerendertes PNG; alle Medien liegen im Archiv.
  const images = els.filter((e) => e.type === 'image');
  const photo = images.find((e) => e.alt === 'Rote Fläche');
  assert.deepEqual(photo.crop, { x: 0, y: 0, width: 1, height: 1 });
  assert.ok(images.length >= 3, 'Bild, Dreieck und Symbolschrift');
  for (const image of images) {
    assert.match(image.src, /^media\/[a-f0-9]{40}\.(png|jpg|gif|webp)$/);
    assert.ok(files[image.src], image.src);
  }
  const triangle = images.find((e) => e.x > 115 && e.y > 75 && e.y < 85);
  assert.ok(triangle, 'Dreieck als Bild');
  assert.deepEqual([...files[triangle.src].subarray(1, 4)], [80, 78, 71]);
});
