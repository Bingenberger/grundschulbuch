import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { unzipSync, strFromU8 } from 'fflate';
import { PDFDocument } from 'pdf-lib';
async function login(page: Page) {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}
async function notebook(page: Page, title: string) {
  await login(page);
  await page.getByRole('button', { name: '＋ Neues Heft' }).click();
  await page.getByLabel('Name des Hefts').fill(title);
  await page.getByRole('button', { name: 'Heft anlegen', exact: true }).click();
  await expect(page).toHaveURL(/\/heft\//);
  return page.url().split('/').pop()!;
}
const origin = { Origin: 'http://localhost:3100' };
test('Interaktive Aufgaben sind im Kinderheft bedienbar und bleiben im Entwurf geschützt', async ({
  page,
  browser,
}) => {
  const id = await notebook(page, 'Interaktive Übung');
  await page
    .getByRole('button', { name: '◈ Lernwerkzeuge', exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('button', { name: 'Quiz', exact: true }).click();
  await dialog
    .getByRole('button', { name: 'Auf die Seite übernehmen' })
    .click();
  await page
    .locator('.interaction-surface .learning-widget')
    .getByRole('button', { name: 'B · Vier', exact: true })
    .click();
  await page
    .locator('.interaction-surface .learning-widget')
    .getByRole('button', { name: 'Prüfen', exact: true })
    .click();
  await expect(page.getByText('Richtig!', { exact: true })).toBeVisible();
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  const req = async (action: string, values: object = {}) => {
    const r = await page.request.post('/api/klassen', {
      headers: origin,
      data: { action, ...values },
    });
    expect(r.ok()).toBeTruthy();
    return r.json();
  };
  let klass = await req('create', { title: 'Lernspiel-Test' });
  klass = await req('change', { id: klass.id, addChild: 'Nora' });
  const digest = 'a'.repeat(64);
  await req('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await req('distribute', { id: klass.id, bookId: id });
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    hasTouch: true,
  });
  const child = await context.newPage();
  await child.goto('/kinder');
  await child.request.post('/api/kinder', {
    headers: origin,
    data: { action: 'login', digest },
  });
  await child.goto(`/kinder/heft/${copies[0].id}`);
  await expect(
    child.locator('.answer-options button[aria-pressed="true"]'),
  ).toHaveCount(0);
  await child.getByRole('button', { name: 'B · Vier', exact: true }).click();
  await child.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(child.getByText('Richtig!', { exact: true })).toBeVisible();
  await child.getByRole('button', { name: '‹ Meine Hefte' }).click();
  await child.getByRole('link', { name: 'Interaktive Übung' }).click();
  await expect(
    child.locator('.answer-options button[aria-pressed="true"]'),
  ).toHaveText('B · Vier');
  const opened = await child.request.post('/api/kinder', {
    headers: origin,
    data: { action: 'open', id: copies[0].id },
  });
  const data = await opened.json();
  data.pages[0].elements[0].settings.questions[0].correct = 0;
  const rejected = await child.request.post('/api/kinder', {
    headers: origin,
    data: { action: 'page', id: copies[0].id, page: data.pages[0] },
  });
  expect(rejected.status()).toBe(403);
  await context.close();
});
test('Heftdatei, HTML, PDF, ePub und SCORM lassen sich exportieren und die Heftdatei wieder öffnen', async ({
  page,
  browser,
}) => {
  test.setTimeout(150000);
  await notebook(page, 'Dateiformate-Test');
  await page.getByRole('button', { name: 'T Text', exact: true }).click();
  await page
    .getByLabel('Text', { exact: true })
    .fill('Ein eigenständiges Heft mit Äpfeln & Birnen.');
  await page.getByRole('button', { name: '⇅ Dateien', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Heftdateien' });
  const download = async (name: RegExp) => {
    const pending = page.waitForEvent('download');
    await dialog.getByRole('button', { name }).click();
    const file = await pending;
    const path = test.info().outputPath(file.suggestedFilename());
    await file.saveAs(path);
    return {
      bytes: new Uint8Array(await readFile(path)),
      path,
      name: file.suggestedFilename(),
    };
  };
  const archive = await download(/Bearbeitbare Heftdatei/);
  const files = unzipSync(archive.bytes);
  expect(
    JSON.parse(strFromU8(files['heft.json'])).pages[0].elements[0].text,
  ).toContain('Äpfeln & Birnen');
  const html = await download(/HTML mit Lernwerkzeugen/);
  const viewer = await browser.newPage();
  await viewer.goto('file://' + html.path);
  await expect(
    viewer
      .locator('.standalone-page .paper')
      .getByText('Ein eigenständiges Heft mit Äpfeln & Birnen.', {
        exact: true,
      }),
  ).toBeVisible();
  await viewer.close();
  const pdf = await download(/PDF herunterladen/);
  const document = await PDFDocument.load(pdf.bytes);
  expect(document.getPageCount()).toBe(1);
  expect(document.getPage(0).getWidth()).toBeCloseTo(595.276, 2);
  const epub = await download(/^ePub/);
  const efiles = unzipSync(epub.bytes);
  expect(strFromU8(efiles.mimetype)).toBe('application/epub+zip');
  expect(strFromU8(efiles['OEBPS/page-1.xhtml'])).toContain(
    'Äpfeln &amp; Birnen',
  );
  const scorm = await download(/SCORM/);
  expect(unzipSync(scorm.bytes)['imsmanifest.xml']).toBeTruthy();
  await dialog.locator('input[type=file]').setInputFiles({
    name: 'kopie.grundschulbuch',
    mimeType: 'application/zip',
    buffer: Buffer.from(archive.bytes),
  });
  await expect(page).toHaveURL(/\/heft\//);
  await expect(
    page
      .locator('.interaction-surface')
      .getByText('Ein eigenständiges Heft mit Äpfeln & Birnen.', {
        exact: true,
      }),
  ).toBeVisible();
});
test('Formen, Bildgestaltung, Vorlagenkategorien, Zoom und Tastatur sind verfügbar', async ({
  page,
}) => {
  await notebook(page, 'Gestalten-Test');
  await page.getByRole('button', { name: '◇ Formen', exact: true }).click();
  await page.getByRole('button', { name: 'Form speech', exact: true }).click();
  await expect(page.locator('.interaction-surface .page-element')).toHaveCount(
    1,
  );
  await page.keyboard.press('ArrowRight');
  await page
    .getByRole('button', { name: 'Ansicht vergrößern', exact: true })
    .click();
  await expect(page.locator('.zoom-controls .zoom-value')).toHaveText('110 %');
  await page.getByRole('button', { name: 'Ganze Seite', exact: true }).click();
  await page.getByRole('button', { name: '▤ Vorlagen', exact: true }).click();
  const templates = page.getByRole('dialog', { name: 'Eine neue Seite' });
  await templates
    .getByRole('button', { name: 'Kommunikation', exact: true })
    .click();
  await templates
    .getByRole('button', { name: /Kommunikation · 6 Felder/ })
    .click();
  await expect(
    page.locator('.interaction-surface .communication-grid button'),
  ).toHaveCount(6);
});
