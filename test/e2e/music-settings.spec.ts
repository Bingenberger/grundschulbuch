import { test, expect, type Page } from '@playwright/test';
import { musicPage, musicPreset, musicSettings } from '../../src/lib/learning/music';
test.use({ actionTimeout: 10000 });
const headers = { Origin: 'http://localhost:3100' };
// Settings tests remain independent of the public ARASAAC service.
test.beforeEach(async ({ page }) => {
  await page.route('**/api/bilder?**', async route => {
    const url = new URL(route.request().url());
    if (url.searchParams.get('karaoke') === '1') await route.fulfill({ json: { items: [], more: false, page: 1 } });
    else await route.continue();
  });
});
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function openBook(page: Page, presets: string[]) {
  const pages = presets.map(id => musicPage(musicSettings(musicPreset(id)!))[0]);
  const response = await page.request.post('/api/werkstatt', { headers, data: { action: 'create', title: 'Musikeinstellungen', pages } }); expect(response.ok()).toBeTruthy();
  const { book } = await response.json(); await page.goto(`/heft/${book.id}`); return book.id as string;
}
async function configure(page: Page) {
  await page.locator('.interaction-surface .music-settings-launch').click();
  return page.getByRole('dialog', { name: 'Lernwerkzeug gestalten', exact: true });
}
async function readConfig(page: Page, id: string, index = 0) {
  const response = await page.request.post('/api/werkstatt', { headers, data: { action: 'open', id } }); const data = await response.json(); return data.pages[index].elements[0].settings.musicConfig;
}
async function save(page: Page, dialog: ReturnType<Page['getByRole']>) {
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click(); await expect(dialog).toHaveCount(0);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
}
function midiFile() {
  const events = [0, 0xff, 0x51, 3, 7, 0xa1, 0x20];
  for (const note of [60, 62, 64, 67]) events.push(0, 0x90, note, 80, 96, 0x80, note, 0);
  events.push(0, 0xff, 0x2f, 0);
  const bytes = Buffer.alloc(22 + events.length); bytes.write('MThd'); bytes.writeUInt32BE(6, 4); bytes.writeUInt16BE(0, 8); bytes.writeUInt16BE(1, 10); bytes.writeUInt16BE(96, 12); bytes.write('MTrk', 14); bytes.writeUInt32BE(events.length, 18); Buffer.from(events).copy(bytes, 22); return bytes;
}

test('Alle Musik-Einstellungsseiten speichern die zusätzlichen Referenzoptionen', async ({ page }) => {
  test.setTimeout(150000); await login(page);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const ids = ['inst-piano', 'drum-pads', 'seq-melody', 'echo-piano', 'fall-tubes', 'nq-names', 'metronome', 'tuner', 'hoerspiel'];
  const book = await openBook(page, ids);
  for (const [index, id] of ids.entries()) {
    if (index) await page.getByRole('button', { name: `Seite ${index + 1} öffnen`, exact: true }).click();
    const dialog = await configure(page);
    await expect(dialog.getByLabel('Spielbare Vorschau', { exact: true })).toBeVisible();
    if (id === 'inst-piano') {
      await dialog.getByLabel('Instrument', { exact: true }).selectOption('xylophone'); await dialog.getByLabel('Klangfarbe', { exact: true }).selectOption('marimba');
      await dialog.getByLabel('Oktaven', { exact: true }).selectOption('3'); await dialog.getByLabel('Oktave', { exact: true }).fill('4');
      await dialog.getByText('Begleit-Metronom einstellen', { exact: true }).click(); await dialog.getByLabel('Taktart', { exact: true }).selectOption('5/4');
    }
    if (id === 'drum-pads') {
      await dialog.getByLabel('Namen zeigen', { exact: true }).uncheck(); await dialog.getByLabel('Name von Pad 1', { exact: true }).fill('Mein Bass');
      await dialog.getByLabel('Klang von Pad 1', { exact: true }).selectOption('kick'); await dialog.getByRole('button', { name: 'Pad dazu', exact: true }).click();
    }
    if (id === 'seq-melody') {
      await dialog.getByLabel('Schritte', { exact: true }).selectOption('8'); await dialog.getByLabel('Tonleiter', { exact: true }).selectOption('major'); await dialog.getByLabel('Grundton', { exact: true }).selectOption('2');
      await dialog.getByLabel('Name von Spur 1', { exact: true }).fill('Mein Ton'); await dialog.getByLabel('Klang von Spur 1', { exact: true }).selectOption('n:72'); await dialog.getByLabel('Instrument von Spur 1', { exact: true }).selectOption('flute');
      await dialog.getByRole('button', { name: 'Spur 8 entfernen', exact: true }).click(); await dialog.getByRole('button', { name: 'Spur dazu', exact: true }).click();
    }
    if (id === 'echo-piano') { await dialog.getByLabel('Tonfolgen', { exact: true }).selectOption('jakob'); await dialog.getByLabel('Töne zu Beginn', { exact: true }).selectOption('3'); await dialog.getByLabel('Mit Sprachbegleitung', { exact: true }).uncheck(); }
    if (id === 'fall-tubes') {
      await dialog.getByLabel('Spielweise', { exact: true }).selectOption('rhythm'); await dialog.getByLabel('Melodie mitspielen', { exact: true }).check();
      await dialog.getByLabel('MIDI-Datei laden', { exact: true }).setInputFiles({ name: 'Eigene Melodie.mid', mimeType: 'audio/midi', buffer: midiFile() });
      await expect(dialog.getByLabel('Lied', { exact: true })).toHaveValue('custom');
    }
    if (id === 'nq-names') { await dialog.getByLabel('Notenschlüssel', { exact: true }).selectOption('bass'); await dialog.getByLabel('Tonraum', { exact: true }).selectOption('ledger'); await dialog.getByLabel('Fragen', { exact: true }).selectOption('20'); }
    if (id === 'metronome') { await dialog.getByLabel('Taktart', { exact: true }).selectOption('5/4'); await dialog.getByLabel('Klang', { exact: true }).selectOption('beep'); await dialog.getByRole('button', { name: 'Sehr schnell (168)', exact: true }).click(); }
    if (id === 'tuner') { await dialog.getByLabel('Instrument stimmen', { exact: true }).selectOption('cello'); await dialog.getByLabel('Empfindlichkeit', { exact: true }).selectOption('5'); await dialog.getByLabel('Kammerton A (Hz)', { exact: true }).fill('442'); }
    if (id === 'hoerspiel') { await dialog.getByLabel('Stimme deutlich machen', { exact: true }).uncheck(); await dialog.getByLabel('Musik beim Sprechen (%)', { exact: true }).fill('20'); await dialog.getByLabel('Länge des Hörspiels', { exact: true }).selectOption('30'); }
    await save(page, dialog); const config = await readConfig(page, book, index);
    if (id === 'inst-piano') { expect(config.inst.skin).toBe('xylophone'); expect(config.inst.voice).toBe('marimba'); expect(config.inst.octaves).toBe(3); expect(config.musicMetronome.meter).toBe('5/4'); }
    if (id === 'drum-pads') { expect(config.kit.pads).toHaveLength(9); expect(config.kit.labels).toBe(false); expect(config.kit.pads[0].voice).toBe('kick'); }
    if (id === 'seq-melody') { expect(config.seq.steps).toBe(8); expect(config.seq.tracks).toHaveLength(8); expect(config.seq.tracks[0].voice).toBe('flute'); expect(config.seq.tracks.every((t: { steps: boolean[] }) => t.steps.length === 8)).toBe(true); }
    if (id === 'echo-piano') { expect(config.echo.song).toBe('jakob'); expect(config.echo.start).toBe(3); expect(config.echo.voice).toBe(false); }
    if (id === 'fall-tubes') { expect(config.fall.mode).toBe('rhythm'); expect(config.fall.guide).toBe(true); expect(config.fall.custom.notes).toHaveLength(4); }
    if (id === 'nq-names') { expect(config.nq.ledger).toBe(true); expect(config.nq.rounds).toBe(20); }
    if (id === 'metronome') { expect(config.meter).toBe('5/4'); expect(config.click).toBe('beep'); expect(config.bpm).toBe(168); }
    if (id === 'tuner') { expect(config.tuner.inst).toBe('cello'); expect(config.tuner.sens).toBe(5); }
    if (id === 'hoerspiel') { expect(config.hs.boost).toBe(false); expect(config.hs.duckLevel).toBe(0.2); expect(config.hs.len).toBe(30); }
    expect(errors, id).toEqual([]);
  }
});

test('Karaoke: vier Bereiche, Gestaltung, Wortbilder, Zeitplan und erneutes Bearbeiten', async ({ page }) => {
  test.setTimeout(90000); await login(page); const book = await openBook(page, ['karaoke']);
  let dialog = await configure(page); await expect(dialog.getByRole('tab')).toHaveCount(4); await expect(dialog.locator('.karaoke-song-library button')).toHaveCount(31);
  await dialog.getByRole('button', { name: /^Bruder Jakob/ }).click(); await dialog.getByLabel('Liedtitel', { exact: true }).fill('Unser Vogellied'); await dialog.getByLabel('Text und Melodie von', { exact: true }).fill('Unsere Klasse');
  await dialog.getByLabel('Liedtext', { exact: true }).fill('Vögel im Garten\nWir singen mit\n\nVögel sind wieder da\nAlle singen mit');
  await dialog.getByRole('button', { name: /Strophe 2$/ }).click();
  await dialog.getByRole('tab', { name: 'Aussehen', exact: true }).click(); await dialog.getByRole('radio', { name: 'Meer', exact: true }).click();
  await dialog.getByLabel('Schrift', { exact: true }).selectOption('andika'); await dialog.getByLabel('Schriftgröße (höchstens)', { exact: true }).fill('100'); await dialog.getByLabel('Silben rot und blau', { exact: true }).check(); await dialog.getByLabel('Wörter beim Singen nacheinander färben', { exact: true }).check();
  await dialog.getByRole('button', { name: 'Liedblatt (Druck)', exact: true }).click(); await expect(dialog.getByLabel('Liedblatt-Vorschau', { exact: true }).locator('.lh-ka')).toBeVisible();
  await dialog.getByRole('tab', { name: 'Bilder', exact: true }).click(); await dialog.getByLabel('Wort suchen', { exact: true }).fill('Vögel'); await dialog.getByRole('button', { name: 'Bild für Vögel', exact: true }).click();
  const images = page.getByRole('dialog', { name: 'Bild für „Vögel“', exact: true });
  await images.getByLabel('Bilddatei auswählen', { exact: true }).setInputFiles({ name: 'vogel.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jhN8AAAAASUVORK5CYII=', 'base64') });
  await expect(images).toHaveCount(0); await dialog.getByLabel('statt Wort: Vögel', { exact: true }).check();
  await dialog.getByRole('tab', { name: 'Ablauf & Musik', exact: true }).click(); await dialog.getByLabel('Zeilenwechsel', { exact: true }).selectOption('hand'); await dialog.getByLabel('Sekunden pro Zeile', { exact: true }).fill('2.5'); await dialog.getByLabel('Vorspiel', { exact: true }).fill('0'); await dialog.getByLabel('Wie oft singen?', { exact: true }).selectOption('3'); await dialog.getByLabel('Aufnahmequelle', { exact: true }).selectOption('mix');
  await page.screenshot({ path: test.info().outputPath('karaoke-ablauf-einstellungen.png') }); await save(page, dialog);
  const c = await readConfig(page, book); expect(c.karaoke.credit).toBe('Unsere Klasse'); expect(c.karaoke.design).toBe('sea'); expect(c.karaoke.font).toBe('andika'); expect(c.karaoke.follow).toBe(true); expect(c.karaoke.skip).toEqual([2]); expect(c.karaoke.intro).toBe(0); expect(c.karaoke.repeat).toBe(3); expect(c.karaoke.rec).toBe('mix'); expect(c.musicPictures[0].word).toBe('vögel'); expect(c.musicPictures[0].instead).toBe(true);
  await page.reload(); dialog = await configure(page); await dialog.getByRole('tab', { name: 'Bilder', exact: true }).click(); await dialog.getByLabel('Wort suchen', { exact: true }).fill('Vögel'); await expect(dialog.getByLabel('statt Wort: Vögel', { exact: true })).toBeChecked();
  await dialog.getByRole('tab', { name: 'Ablauf & Musik', exact: true }).click();
  await dialog.getByLabel('LRC-Datei laden', { exact: true }).setInputFiles({ name: 'lied.lrc', mimeType: 'text/plain', buffer: Buffer.from('[00:01.50]Vögel singen\n[00:04.00]Alle singen mit\n[00:08.00]') });
  await dialog.getByRole('button', { name: 'Liedtext und Zeitplan übernehmen', exact: true }).click(); const pending = page.waitForEvent('download'); await dialog.getByRole('button', { name: 'Als LRC speichern', exact: true }).click(); const download = await pending; expect(download.suggestedFilename()).toMatch(/\.lrc$/);
  await save(page, dialog); const saved = await readConfig(page, book); expect(saved.karaoke.timing.marks).toEqual([[1500, 0], [4000, 1]]); expect(saved.karaoke.mode).toBe('auto');
});

test('Neue Karaoke-Werkzeuge können mehrere Bibliothekslieder auf einzelnen Seiten einfügen', async ({ page }) => {
  await login(page); const response = await page.request.post('/api/werkstatt', { headers, data: { action: 'create', title: 'Unser Liederheft' } }); const { book } = await response.json(); await page.goto(`/heft/${book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' }); await dialog.getByRole('button', { name: 'Karaoke-Liedblatt', exact: true }).click();
  await dialog.getByRole('button', { name: /^Bruder Jakob/ }).click(); await dialog.getByRole('button', { name: /^Alle Vögel sind schon da/ }).click();
  await expect(dialog.getByRole('heading', { name: /2 Lieder/ })).toBeVisible(); await dialog.getByRole('tab', { name: 'Aussehen', exact: true }).click(); await dialog.getByRole('radio', { name: 'Lagerfeuer', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click(); await expect(dialog).toHaveCount(0);
  await expect.poll(async () => { const response = await page.request.post('/api/werkstatt', { headers, data: { action: 'open', id: book.id } }); const d = await response.json(); return d.pages.length; }).toBe(2);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const first = await readConfig(page, book.id, 0), second = await readConfig(page, book.id, 1); expect(first.karaoke.title).toBe('Bruder Jakob'); expect(second.karaoke.title).toBe('Alle Vögel sind schon da'); expect(first.karaoke.design).toBe('campfire'); expect(second.karaoke.design).toBe('campfire');
});
