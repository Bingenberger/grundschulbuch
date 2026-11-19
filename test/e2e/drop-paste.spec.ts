import { test, expect, type Page } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}
const text = (t: string) => ({
  id: uuid(), type: 'text', x: 20, y: 20, width: 100, height: 20, rotation: 0,
  locked: false, color: '#253c42', text: t, font: 'Andika', fontSize: 18,
});
async function book(page: Page, title: string, pages: object[]) {
  const r = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title, pages } });
  return (await r.json()).book.id as string;
}
async function open(page: Page, id: string) {
  const r = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id } });
  return (await r.json()) as { pages: { elements: { type: string; text?: string; url?: string; embedKind?: string }[] }[] };
}
// kleines PNG (sharp liegt dem Server ohnehin bei), kurze WAV-Datei (Stille)
let png: Buffer;
test.beforeAll(async () => {
  const { default: sharp } = await import('sharp');
  png = await sharp({ create: { width: 16, height: 16, channels: 3, background: '#f4b400' } }).png().toBuffer();
});
function wav() {
  const samples = 800, b = Buffer.alloc(44 + samples * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + samples * 2, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(8000, 24);
  b.writeUInt32LE(16000, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(samples * 2, 40);
  return b;
}
async function pdf() {
  const doc = await PDFDocument.create();
  doc.addPage([595.28, 841.89]);
  doc.addPage([841.89, 595.28]);
  return Buffer.from(await doc.save());
}
/** Zieht Dateien auf die Seite (dragenter, dragover, drop mit echtem DataTransfer). */
async function drop(page: Page, files: { name: string; type: string; data: Buffer }[], release = true) {
  const dt = await page.evaluateHandle((list) => {
    const t = new DataTransfer();
    for (const f of list) t.items.add(new File([Uint8Array.from(atob(f.b64), (c) => c.charCodeAt(0))], f.name, { type: f.type }));
    return t;
  }, files.map((f) => ({ name: f.name, type: f.type, b64: f.data.toString('base64') })));
  const area = page.locator('.canvas-area');
  await area.dispatchEvent('dragenter', { dataTransfer: dt });
  await area.dispatchEvent('dragover', { dataTransfer: dt });
  if (release) await area.dispatchEvent('drop', { dataTransfer: dt });
}
async function paste(page: Page, data: { text?: string; file?: { name: string; type: string; data: Buffer } }) {
  await page.evaluate(({ text, file }) => {
    const t = new DataTransfer();
    if (text) t.setData('text/plain', text);
    if (file) t.items.add(new File([Uint8Array.from(atob(file.b64), (c) => c.charCodeAt(0))], file.name, { type: file.type }));
    document.body.dispatchEvent(new ClipboardEvent('paste', { clipboardData: t, bubbles: true, cancelable: true }));
  }, { text: data.text, file: data.file && { name: data.file.name, type: data.file.type, b64: data.file.data.toString('base64') } });
}

test('Hineinziehen, Einfügen aus anderen Apps, Seiten zwischen Heften kopieren, Tafel durch Halten beenden', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const a = await book(page, 'Ziehprobe', [{ ...newPage(), elements: [text('Quelle')] }]);
  const b = await book(page, 'Zielheft', [{ ...newPage(), elements: [] }]);
  await page.goto(`/heft/${a}`);
  const saved = page.locator('.save-status');
  await expect(saved).toHaveText('✓ Gespeichert');
  // Gleich zu Beginn ein Element kopieren (⌘C) – eingefügt wird es später in einem anderen Heft.
  await page.locator('.interaction-surface').getByText('Quelle', { exact: true }).click();
  await page.keyboard.press('ControlOrMeta+c');
  await page.keyboard.press('Escape');

  // Bild und Ton hineinziehen; beim Ziehen steht „Loslassen zum Einfügen“.
  await drop(page, [{ name: 'Sonne.png', type: 'image/png', data: png }], false);
  await expect(page.getByText('Loslassen zum Einfügen')).toBeVisible();
  await page.locator('.canvas-area').dispatchEvent('dragleave', { dataTransfer: await page.evaluateHandle(() => { const t = new DataTransfer(); t.items.add(new File(['x'], 'x.png', { type: 'image/png' })); return t; }) });
  await expect(page.getByText('Loslassen zum Einfügen')).toHaveCount(0);
  await drop(page, [{ name: 'Sonne.png', type: 'image/png', data: png }, { name: 'Gong.wav', type: 'audio/wav', data: wav() }]);
  await expect.poll(async () => (await open(page, a)).pages[0].elements.map((e) => e.type).sort().join(), { timeout: 20000 }).toBe('audio,image,text');

  // PDF hineinziehen: zwei Seiten hinter der aktuellen.
  await drop(page, [{ name: 'Blatt.pdf', type: 'application/pdf', data: await pdf() }]);
  await expect.poll(async () => (await open(page, a)).pages.length, { timeout: 30000 }).toBe(3);
  await expect(page.getByText('2 PDF-Seiten sind eingefügt.')).toBeVisible();

  // Aus anderen Apps einfügen: Adresse, Text, Bild.
  await page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Seite 1 öffnen' }).click();
  await paste(page, { text: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' });
  await paste(page, { text: 'Aus einer anderen App' });
  await paste(page, { file: { name: 'Bild.png', type: 'image/png', data: png } });
  await expect.poll(async () => {
    const els = (await open(page, a)).pages[0].elements;
    return [els.find((e) => e.type === 'embed')?.embedKind, els.some((e) => e.text === 'Aus einer anderen App'), els.filter((e) => e.type === 'image').length].join();
  }, { timeout: 20000 }).toBe('video,true,2');

  // Seite kopieren, im anderen Heft das Element (⌘V) und die Seite einfügen.
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Seite', exact: true }).click();
  await page.getByRole('group', { name: 'Seite einstellen: Bereiche' }).getByRole('button', { name: /Seiten/ }).click();
  await page.getByRole('button', { name: 'Seite kopieren', exact: true }).click();
  await expect(page.getByText(/Seite kopiert/)).toBeVisible();
  await expect(saved).toHaveText('✓ Gespeichert');

  await page.goto(`/heft/${b}`);
  await expect(saved).toHaveText('✓ Gespeichert');
  await page.locator('.canvas-area').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('ControlOrMeta+v');
  await expect.poll(async () => (await open(page, b)).pages[0].elements.map((e) => e.text).join(), { timeout: 15000 }).toBe('Quelle');
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Seite', exact: true }).click();
  await page.getByRole('group', { name: 'Seite einstellen: Bereiche' }).getByRole('button', { name: /Seiten/ }).click();
  await page.getByRole('button', { name: 'Seite einfügen', exact: true }).click();
  await expect.poll(async () => {
    const pages = (await open(page, b)).pages;
    return [pages.length, pages[1]?.elements.length].join();
  }, { timeout: 20000 }).toBe('2,6');

  // Tafel: kurzes Drücken beendet nicht, 2 Sekunden Halten schon.
  await page.getByRole('button', { name: 'Tafelmodus', exact: true }).click();
  const end = page.getByRole('button', { name: 'Tafelmodus beenden' });
  const box = (await end.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(600);
  await page.mouse.up();
  await expect(end).toBeVisible();
  await page.mouse.down();
  await page.waitForTimeout(2300);
  await page.mouse.up();
  await expect(end).toHaveCount(0);
  expect(errors).toEqual([]);
});
