import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { newPage, uuid } from '../../src/lib/notebook-model';
import { defaultSettings } from '../../src/lib/learning/catalog';
test('Animation exportiert mehrere Objekte mit Ton; Sequencer exportiert spielbares WAV', async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
  const origin = { Origin: 'http://localhost:3100' },
    rate = 22050,
    wav = Buffer.alloc(44 + rate * 2);
  wav.write('RIFF');
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(rate, 24);
  wav.writeUInt32LE(rate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(rate * 2, 40);
  for (let i = 0; i < rate; i++)
    wav.writeInt16LE(
      Math.round(Math.sin((i / rate) * 440 * Math.PI * 2) * 5000),
      44 + i * 2,
    );
  const audio = await page.request.post('/api/ton', {
    headers: origin,
    data: wav,
  });
  expect(audio.ok()).toBeTruthy();
  const { src } = await audio.json();
  const make = (widgetKind: 'animation' | 'sequencer') => ({
    ...newPage(),
    elements: [
      {
        id: uuid(),
        type: 'widget',
        widgetKind,
        x: 15,
        y: 35,
        width: 180,
        height: 180,
        rotation: 0,
        locked: false,
        color: '#253c42',
        settings: {
          ...defaultSettings(widgetKind),
          seconds: 1,
          ...(widgetKind === 'animation'
            ? {
                tracks: [{ title: 'Testton', src, offset: 0, volume: 0.5 }],
                actors: [
                  {
                    symbol: '★',
                    color: '#b68e38',
                    frames: [
                      { text: '', x: 85, y: 25 },
                      { text: '', x: 15, y: 75 },
                    ],
                  },
                ],
              }
            : {}),
        },
      },
    ],
  });
  const created = await page.request.post('/api/werkstatt', {
    headers: origin,
    data: {
      action: 'create',
      title: 'Musik und Animation',
      pages: [make('animation'), make('sequencer')],
    },
  });
  expect(created.ok()).toBeTruthy();
  const data = await created.json();
  await page.goto(`/heft/${data.book.id}`);
  const pending = page.waitForEvent('download');
  await page
    .locator('.interaction-surface')
    .getByRole('button', { name: 'Video speichern', exact: true })
    .click();
  const video = await pending,
    path = test.info().outputPath(video.suggestedFilename());
  await video.saveAs(path);
  const bytes = await readFile(path);
  expect(bytes.length).toBeGreaterThan(1000);
  expect(
    bytes.includes(Buffer.from('A_OPUS')) ||
      bytes.includes(Buffer.from('mp4a')),
  ).toBe(true);
  const dimensions = await page.evaluate(
    async ({ base64, mime }) => {
      const raw = atob(base64),
        blob = new Blob([Uint8Array.from(raw, (c) => c.charCodeAt(0))], {
          type: mime,
        }),
        url = URL.createObjectURL(blob),
        video = document.createElement('video');
      video.src = url;
      try {
        return await new Promise<{ width: number; height: number }>(
          (resolve, reject) => {
            video.onloadedmetadata = () =>
              resolve({ width: video.videoWidth, height: video.videoHeight });
            video.onerror = () =>
              reject(new Error('Video konnte nicht geöffnet werden'));
          },
        );
      } finally {
        URL.revokeObjectURL(url);
      }
    },
    {
      base64: bytes.toString('base64'),
      mime: path.endsWith('.mp4') ? 'video/mp4' : 'video/webm',
    },
  );
  expect(dimensions).toEqual({ width: 800, height: 440 });
  await page.getByLabel('Seite 2 öffnen', { exact: true }).click();
  await page
    .locator('.interaction-surface')
    .getByLabel('Rhythmusvorlage')
    .selectOption('rock');
  const soundPending = page.waitForEvent('download');
  await page
    .locator('.interaction-surface')
    .getByRole('button', { name: 'WAV speichern', exact: true })
    .click();
  const sound = await soundPending,
    soundPath = test.info().outputPath('rhythmus.wav');
  await sound.saveAs(soundPath);
  const pcm = await readFile(soundPath);
  expect(pcm.subarray(0, 4).toString()).toBe('RIFF');
  expect(pcm.length).toBeGreaterThan(10000);
});
