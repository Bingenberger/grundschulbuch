import { test, expect } from '@playwright/test';
import { musicPresets, musicSettings, musicPage } from '../../src/lib/learning/music';
  test.use({ permissions: ['microphone'], launchOptions: {
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
  } });
async function login(page: import('@playwright/test').Page) {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}
test('Musikvorlagen zeichnen und bedienen: Instrumente, Spiele, Baukästen, Studio und Karaoke', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await login(page);
  const presets = musicPresets.filter(p => !p.generator || p.id === 'karaoke');
  const pages = presets.map(p => musicPage(musicSettings(p))[0]);
  const created = await page.request.post('/api/werkstatt', { headers: { Origin: 'http://localhost:3100' }, data: { action: 'create', title: 'Musik-Referenzprüfung', pages } });
  expect(created.ok()).toBeTruthy();
  const { book } = await created.json();
  await page.goto(`/heft/${book.id}`);
  for (let index = 0; index < presets.length; index++) {
    const preset = presets[index];
    const stage = page.locator('.interaction-surface .music-template').first();
    await expect(stage).toHaveAttribute('aria-label', preset.title);
    await expect(stage.locator('.music-backdrop')).toBeVisible();
    if (['inst-piano', 'inst-xylophone', 'inst-glockenspiel', 'inst-tubes', 'inst-synth', 'drum-drumset', 'drum-cajon', 'drum-hand', 'drum-orff'].includes(preset.id)) {
      await stage.locator('.music-control .lh-key').first().click();
      await expect(stage.getByRole('button', { name: 'Aufnehmen', exact: true })).toBeVisible();
    }
    if (preset.id === 'inst-piano') {
      await stage.getByRole('button', { name: 'Aufnehmen', exact: true }).click();
      await expect(stage.getByRole('button', { name: 'Fertig', exact: true })).toBeVisible();
      await stage.locator('.lh-wg-piano .lh-key').first().click();
      await page.waitForTimeout(700);
      await stage.getByRole('button', { name: 'Fertig', exact: true }).click();
      const saved = stage.getByRole('link', { name: 'Speichern', exact: true });
      await expect(saved).toBeVisible();
      const src = (await saved.getAttribute('href'))!;
      const energy = await page.evaluate(async url => { const context = new AudioContext(); const sound = await context.decodeAudioData(await (await fetch(url)).arrayBuffer()); const samples = sound.getChannelData(0); const peak = samples.reduce((m, n) => Math.max(m, Math.abs(n)), 0); await context.close(); return peak; }, src);
      expect(energy).toBeGreaterThan(0.01);
    }
    if (preset.id === 'drum-pads') {
      await stage.locator('[data-p="0"]').click();
      await expect(stage.getByRole('dialog', { name: 'Klang bearbeiten' })).toBeVisible();
      await stage.getByRole('button', { name: 'Schließen', exact: true }).click();
    }
    if (preset.id.startsWith('seq-')) {
      const step = stage.locator('[data-c="0,1"]'); await step.click();
      await expect.poll(async () => {
        const response = await page.request.post('/api/werkstatt', { headers: { Origin: 'http://localhost:3100' }, data: { action: 'open', id: book.id } });
        const data = await response.json();
        return data.pages?.[index]?.elements[0]?.response?.musicConfig?.seq?.tracks[0]?.steps[1];
      }).toBe(true);
      await stage.locator('[data-a="play"]').click();
      await expect(stage.locator('.lh-wg-sequencer')).toHaveClass(/is-running/);
      await stage.locator('[data-a="play"]').click();
    }
    if (preset.id.startsWith('echo-')) {
      await stage.locator('[data-a="start"]').click();
      await expect(stage.locator('.lh-echo-msg')).not.toHaveText('Tippe auf ▶');
    }
    if (preset.id.startsWith('fall-')) {
      await stage.locator('[data-a="start"]').click(); await expect(stage.locator('.lh-wg-fall')).toHaveClass(/is-running/);
      await stage.locator('[data-a="start"]').click();
    }
    if (preset.id.startsWith('nq-')) {
      await stage.locator('[data-a="start"]').click();
      await expect.poll(() => stage.locator('.lh-nq-note > *').count()).toBeGreaterThan(0);
    }
    if (preset.id === 'hoerspiel') {
      await stage.locator('[data-a="add-fx"]').click();
      await stage.getByRole('button', { name: 'Regen', exact: true }).click();
      await expect(stage.locator('[data-clip]')).toHaveCount(1);
      await stage.locator('[data-clip]').click();
      await expect(stage.getByRole('dialog', { name: 'Klang bearbeiten' })).toBeVisible();
      await stage.getByRole('button', { name: 'Schließen', exact: true }).click();
    }
    if (preset.id === 'metronome') {
      await stage.locator('[data-a="toggle"]').first().click(); await expect(stage.locator('.lh-wg-metronome')).toHaveClass(/is-running/);
      await stage.locator('[data-a="toggle"]').first().click();
    }
    if (preset.id === 'karaoke') {
      await stage.locator('[data-a="play"]').click();
      await expect(stage.locator('[data-a="play"]')).toHaveAttribute('aria-label', 'Pause', { timeout: 10000 });
      await stage.locator('[data-a="play"]').click();
    }
    if (['inst-piano', 'inst-xylophone', 'seq-melody', 'nq-names', 'hoerspiel', 'karaoke'].includes(preset.id)) await page.screenshot({ path: test.info().outputPath(`${preset.id}.png`) });
    expect(errors, preset.id).toEqual([]);
    if (index < presets.length - 1) await page.getByRole('button', { name: `Seite ${index + 2} öffnen`, exact: true }).click();
  }
});

test('Musikauswahl fügt vollständige Seiten ein und öffnet die Einstellvarianten', async ({ page }) => {
  await login(page);
  const created = await page.request.post('/api/werkstatt', { headers: { Origin: 'http://localhost:3100' }, data: { action: 'create', title: 'Musik einfügen' } });
  const { book } = await created.json(); await page.goto(`/heft/${book.id}`);
  const open = async () => {
    await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
    await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Musik · / }).click(); return dialog;
  };
  let dialog = await open();
  await expect(dialog.locator('.learning-block-preview img')).toHaveCount(36);
  const pianoPreview = dialog.getByRole('button', { name: 'Klavier', exact: true }).getByRole('img', { name: 'Vorschau: Klavier', exact: true });
  await expect.poll(() => pianoPreview.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth === 480)).toBe(true);
  await page.screenshot({ path: test.info().outputPath('musik-vorschaubilder.png') });
  await expect(dialog.getByRole('button', { name: 'Klanggeschichte', exact: true })).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: 'Notenlinien', exact: true })).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Klavier', exact: true }).click();
  await expect(dialog).toHaveCount(0); await expect(page.locator('.interaction-surface .music-template')).toHaveAttribute('aria-label', 'Klavier');
  dialog = await open(); await dialog.getByRole('button', { name: 'Instrument einstellen', exact: true }).click();
  await dialog.getByLabel('Instrument', { exact: true }).selectOption('xylophone');
  await dialog.getByLabel('Klangfarbe', { exact: true }).selectOption('marimba');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click(); await expect(dialog).toHaveCount(0);
  await expect(page.locator('.interaction-surface .lh-wg-piano [data-n]').first()).toBeVisible();
  dialog = await open(); await dialog.getByRole('button', { name: 'Noten lernen', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Noten lernen' })).toBeVisible();
});

test.describe('Mikrofon zusätzlich zur Instrumentaufnahme', () => {
  test('mischt Mikrofon und Instrumente und beendet den Mikrofonzugriff nach dem Speichern', async ({ page }) => {
    await page.addInitScript(() => {
      const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      const streams: MediaStream[] = [];
      (window as unknown as { musicMicStreams: MediaStream[] }).musicMicStreams = streams;
      navigator.mediaDevices.getUserMedia = async constraints => { const stream = await original(constraints); streams.push(stream); return stream; };
    });
    await login(page);
    const preset = musicPresets.find(p => p.id === 'inst-piano')!;
    const response = await page.request.post('/api/werkstatt', { headers: { Origin: 'http://localhost:3100' }, data: { action: 'create', title: 'Mikrofon und Klavier', pages: musicPage(musicSettings(preset)) } });
    const { book } = await response.json(); await page.goto(`/heft/${book.id}`);
    const stage = page.locator('.interaction-surface .music-template');
    const microphone = stage.getByRole('checkbox', { name: 'Mikrofon dazu' });
    await expect(microphone).not.toBeChecked(); await microphone.check();
    await stage.getByRole('button', { name: 'Aufnehmen', exact: true }).click();
    await expect(stage.getByRole('button', { name: 'Fertig', exact: true })).toBeVisible();
    await expect(microphone).toBeDisabled();
    // The first part contains only the simulated microphone, followed by a piano key.
    await page.waitForTimeout(2200);
    await stage.locator('.lh-wg-piano .lh-key').first().click(); await page.waitForTimeout(400);
    await stage.getByRole('button', { name: 'Fertig', exact: true }).click();
    const saved = stage.getByRole('link', { name: 'Speichern', exact: true }); await expect(saved).toBeVisible();
    const src = (await saved.getAttribute('href'))!;
    const measured = await page.evaluate(async url => {
      const streams = (window as unknown as { musicMicStreams: MediaStream[] }).musicMicStreams;
      const context = new AudioContext(), buffer = await context.decodeAudioData(await (await fetch(url)).arrayBuffer());
      const samples = buffer.getChannelData(0), peak = samples.slice(0, Math.floor(buffer.sampleRate * 2)).reduce((m, n) => Math.max(m, Math.abs(n)), 0);
      await context.close();
      return { requests: streams.length, stopped: streams.every(s => s.getTracks().every(t => t.readyState === 'ended')), peak };
    }, src);
    expect(measured.requests).toBe(1); expect(measured.stopped).toBe(true); expect(measured.peak).toBeGreaterThan(0.001);
  });
});
