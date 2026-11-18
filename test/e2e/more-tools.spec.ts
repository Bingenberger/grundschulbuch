import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}
async function book(page: Page, title: string) {
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title, pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  return created.book.id as string;
}
async function open(page: Page, id: string) {
  const r = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id } });
  return (await r.json()) as { pages: { elements: { widgetKind?: string; settings?: Record<string, unknown> }[] }[] };
}
async function block(page: Page, subject: string, title: string) {
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: new RegExp(`^${subject} · `) }).click();
  await dialog.getByRole('button', { name: title, exact: true }).click();
  return dialog;
}

test('Weitere Übung: aus einem Lückentext weitere Übungen mit demselben Text und seinen Lernwörtern', async ({ page }) => {
  await login(page);
  const id = await book(page, 'Weitere Übung');
  const dialog = await block(page, 'Deutsch', 'Lesen & Schreiben');
  await dialog.getByRole('switch', { name: /Bilder automatisch suchen/ }).uncheck();
  await dialog.getByRole('radiogroup', { name: 'Inhalt' }).getByRole('radio', { name: 'Text', exact: true }).click();
  await dialog.getByRole('radio', { name: /^Lückentext/ }).click();
  await dialog.getByLabel('Text der Übung').fill('Die Sonne scheint. Der Hund bellt laut.');
  const learn = dialog.getByRole('group', { name: 'Lernwörter wählen' });
  await learn.getByRole('button', { name: 'Sonne', exact: true }).click();
  await learn.getByRole('button', { name: 'Hund', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);

  // Die Übung auswählen (Tab), dann „Weitere Übung“ in der Leiste.
  await page.locator('.canvas-area').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('Tab');
  await page.getByRole('button', { name: 'Weitere Übung', exact: true }).click();
  const more = page.getByRole('dialog', { name: 'Weitere Übung' });
  await expect(more.getByRole('button', { name: /^Lückentext/ })).toHaveCount(0);
  await expect(more.getByRole('button', { name: /^Blitzlesen/ })).toBeDisabled();
  await expect(more.getByText(/2 Wörter – die Lernwörter des Textes: Sonne, Hund\./)).toBeVisible();
  await more.getByRole('button', { name: /^Lesen/ }).click();
  await more.getByRole('button', { name: /^Hördiktat/ }).click();
  await more.getByRole('button', { name: '2 Übungen einfügen', exact: true }).click();
  await expect(more).toHaveCount(0);
  await expect.poll(async () => (await open(page, id)).pages.map((p) => {
    const ts = p.elements[0]?.settings?.ts as { mode: string; kind: string; words: { text: string }[] } | undefined;
    return ts ? `${ts.kind}:${ts.mode}${ts.kind === 'words' ? `(${ts.words.map((w) => w.text).join('+')})` : ''}` : '-';
  }).join(' '), { timeout: 15000 }).toBe('text:gaps text:read words:listen(Sonne+Hund)');
});

test('Wortlisten: Grundwortschatz Bayern in der Anlaut-Tastatur unter „Üben“', async ({ page }) => {
  await login(page);
  await book(page, 'Wortlisten');
  const dialog = await block(page, 'Deutsch', 'Anlaut-Tastatur');
  await dialog.getByRole('tab', { name: /^Üben/ }).click();
  await dialog.getByText('Wörter üben', { exact: true }).click();
  await expect(dialog.getByRole('switch', { name: 'Wörter üben' })).toBeChecked();
  // Zum Einschalten die ersten kurzen Wörter.
  await expect(dialog.getByLabel('Eigene Wörter')).toHaveValue(/^Mama\nPapa\nOma/);
  await dialog.getByText('Wörter aus einer Liste wählen').click();
  await dialog.getByRole('group', { name: 'Wortliste' }).getByRole('button', { name: 'Grundwortschatz Bayern 1/2' }).click();
  await dialog.getByRole('group', { name: 'Abschnitt von Grundwortschatz Bayern 1/2' }).getByRole('button', { name: 'Wörter mit Ei/ei' }).click();
  await dialog.getByRole('button', { name: 'Wörter übernehmen' }).click();
  await expect(dialog.getByLabel('Eigene Wörter')).toHaveValue(/^Ameise\nEi\nEis\n.*Seife/s);
  await expect(dialog.getByRole('tab', { name: 'Üben (10)' })).toBeVisible();
});

test('Sprechendes Foto: Foto, Mundlinie, Stil und Text', async ({ page }) => {
  const { default: sharp } = await import('sharp');
  const photo = await sharp({ create: { width: 300, height: 400, channels: 3, background: '#f2c9a0' } }).png().toBuffer();
  await login(page);
  const id = await book(page, 'Sprechendes Foto');
  const dialog = await block(page, 'Für alle Fächer', 'Sprechendes Foto');
  await dialog.getByLabel('Foto wählen').setInputFiles({ name: 'gesicht.png', mimeType: 'image/png', buffer: photo });
  const stage = dialog.getByLabel('Mundlinie ziehen');
  await expect(stage).toBeVisible();
  const box = (await stage.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.7);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.72, { steps: 5 });
  await page.mouse.up();
  await dialog.getByRole('group', { name: 'Stil' }).getByRole('button', { name: 'Comic' }).click();
  await dialog.getByLabel('Das sagt das Foto beim Antippen').fill('Hallo, ich bin Bello!');
  await expect(dialog.locator('.photo-talk-preview .lh-pt')).toBeVisible();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.interaction-surface .lh-wg-phototalk .lh-pt')).toBeVisible();
  await expect.poll(async () => (await open(page, id)).pages[0].elements.some((e) => e.widgetKind === 'sprechfoto'), { timeout: 10000 }).toBe(true);
  const el = (await open(page, id)).pages[0].elements.find((e) => e.widgetKind === 'sprechfoto')!;
  const p = el.settings!.photo as { width: number; height: number; x1: number; x2: number; y1: number; style: string; src: string };
  expect([p.width, p.height, p.style]).toEqual([300, 400, 'comic']);
  // Von links nach rechts gespeichert, als Anteile des Fotos.
  expect(p.x1).toBeCloseTo(0.35, 1);
  expect(p.x2).toBeCloseTo(0.65, 1);
  expect(p.src).toMatch(/^\/api\/medien\//);
  expect((el.settings!.say as { text: string }).text).toBe('Hallo, ich bin Bello!');
});

test('KI-Partner bauen: Einstellungen, Schritte und gespeicherte Teile', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => [], speak() {}, cancel() {} } });
  });
  await login(page);
  const id = await book(page, 'KI-Partner');
  const dialog = await block(page, 'Medien & Präsentation', 'KI-Partner bauen');
  await dialog.getByRole('radiogroup', { name: 'Thema' }).getByRole('radio', { name: 'Mathe', exact: true }).click();
  await dialog.getByRole('radiogroup', { name: 'Welche KI' }).getByRole('radio', { name: 'AIS-Chat' }).click();
  await expect(dialog.getByLabel('Zugangscode')).toBeVisible();
  await dialog.getByRole('radiogroup', { name: 'Welche KI' }).getByRole('radio', { name: 'Duck.ai' }).click();
  await expect(dialog.getByLabel('Zugangscode')).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const tool = page.locator('.interaction-surface .lh-ct-kipartner');
  await expect(tool).toContainText('Mein KI-Partner');
  // Thema fest: es beginnt mit „Person“.
  await expect(tool).toContainText('Wer soll die KI sein?');
  await expect.poll(async () => {
    const kp = (await open(page, id)).pages[0].elements[0]?.settings?.werkzeug as { topic: string; site: string; parts: object } | undefined;
    return kp && JSON.stringify([kp.topic, kp.site, kp.parts]);
  }, { timeout: 10000 }).toBe(JSON.stringify(['math', 'duck', {}]));
});
