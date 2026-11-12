import { test, expect, type Page } from '@playwright/test';
import { randomBytes } from 'node:crypto';
import { defaultSettings } from '../../src/lib/learning/catalog';
import { wavBlob } from '../../src/lib/learning/audio';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const base = { rotation: 0, locked: false, color: '#253c42' };

async function create(page: Page) {
  const wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) } as unknown as AudioBuffer).arrayBuffer());
  const audio = await page.request.post('/api/ton', { headers: { ...origin, 'Content-Type': 'audio/wav' }, data: wav });
  expect(audio.ok()).toBeTruthy();
  const pages = [
    { ...newPage('blanko', 'landscape'), elements: [{ ...base, id: uuid(), type: 'text', text: 'Erste Seite', font: 'Andika', x: 20, y: 20, width: 120, height: 20, fontSize: 24 }] },
    {
      ...newPage('blanko', 'landscape'),
      elements: [{
        ...base, id: uuid(), type: 'activity', activityKind: 'quiz', x: 20, y: 10, width: 200, height: 180,
        settings: { ...defaultSettings('quiz'), questions: [{ text: 'Wie viele Beine hat ein Hund?', answers: ['Vier', 'Zwei'], correct: 0 }] },
      }],
    },
    { ...newPage('blanko', 'landscape'), elements: [{ ...base, id: uuid(), type: 'audio', src: (await audio.json()).src, alt: 'Hundegebell', x: 40, y: 40, width: 28, height: 28 }] },
  ];
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Lesebuch', pages } });
  expect(response.ok(), await response.text()).toBeTruthy();
  return response.json();
}

test('Lesemodus: blättern mit Pfeilen, Tasten und Wischen, Übungen lösen, Töne abspielen, Seitenleiste', async ({ page }) => {
  await login(page);
  const data = await create(page);
  await page.goto(`/heft/${data.book.id}`);
  await page.getByRole('button', { name: 'Lesemodus', exact: true }).click();
  const reader = page.getByRole('dialog', { name: 'Lesemodus' });
  const count = reader.locator('.reader-count');
  await expect(count).toHaveText('Seite 1 von 3');
  await expect(reader.getByText('Erste Seite')).toBeVisible();
  // Nothing can be selected or edited here.
  await expect(reader.locator('.selection-handles, .interaction-surface')).toHaveCount(0);
  await expect(reader.getByRole('button', { name: 'Vorherige Seite' })).toBeDisabled();

  // The page fills the screen.
  const paper = (await reader.locator('.paper').boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(paper.width / viewport.width > 0.6 || paper.height / viewport.height > 0.75).toBeTruthy();

  await reader.getByRole('button', { name: 'Nächste Seite' }).click();
  await expect(count).toHaveText('Seite 2 von 3');
  const quiz = reader.locator('.media-activity');
  await quiz.getByRole('button', { name: 'Antwort A: Vier', exact: true }).click();
  await quiz.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(quiz.getByText('✓ Richtig!', { exact: true })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('lesemodus.png') });

  await page.keyboard.press('ArrowRight');
  await expect(count).toHaveText('Seite 3 von 3');
  await expect(reader.getByRole('button', { name: 'Hundegebell abspielen' })).toBeVisible();
  await expect(reader.getByRole('button', { name: 'Nächste Seite' })).toBeDisabled();

  // Swipe to the right: back one page.
  const box = (await reader.locator('.reader-stage').boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.85);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.85, { steps: 6 });
  await page.mouse.up();
  await expect(count).toHaveText('Seite 2 von 3');

  await reader.getByRole('button', { name: 'Alle Seiten' }).click();
  await reader.getByRole('navigation', { name: 'Alle Seiten' }).getByRole('button', { name: 'Seite 1' }).click();
  await expect(count).toHaveText('Seite 1 von 3');
  await page.keyboard.press('End');
  await expect(count).toHaveText('Seite 3 von 3');

  // Back in the editor on the page last read; the answer was saved.
  await page.keyboard.press('Escape');
  await expect(reader).toHaveCount(0);
  await expect(page.getByLabel('Seite 3 öffnen', { exact: true })).toHaveAttribute('aria-current', /page|true/);
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  await page.reload();
  await page.getByLabel('Seite 2 öffnen', { exact: true }).click();
  await expect(page.locator('.interaction-surface .media-activity').getByText('✓ Richtig!', { exact: true })).toBeVisible();
});

test('Kinder haben den Lesemodus ebenfalls', async ({ page, browser }) => {
  await login(page);
  const data = await create(page);
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy();
    return response.json();
  };
  let klass = await request('create', { title: 'Leseklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Ben' });
  const digest = randomBytes(32).toString('hex');
  await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: data.book.id });
  const context = await browser.newContext();
  try {
    const child = await context.newPage();
    await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    await child.getByRole('button', { name: 'Lesemodus', exact: true }).click();
    const reader = child.getByRole('dialog', { name: 'Lesemodus' });
    await expect(reader.locator('.reader-count')).toHaveText('Seite 1 von 3');
    await expect(reader.getByRole('button', { name: 'Vorlesen' })).toBeVisible();
    await reader.getByRole('button', { name: 'Nächste Seite' }).click();
    const quiz = reader.locator('.media-activity');
    await quiz.getByRole('button', { name: 'Antwort A: Vier', exact: true }).click();
    await quiz.getByRole('button', { name: 'Prüfen', exact: true }).click();
    await expect(quiz.getByText('✓ Richtig!', { exact: true })).toBeVisible();
    await reader.getByRole('button', { name: 'Lesemodus beenden' }).click();
    await expect(reader).toHaveCount(0);
  } finally {
    await context.close();
  }
});
