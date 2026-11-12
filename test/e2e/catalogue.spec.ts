import { test, expect } from '@playwright/test';
import {
  activityCatalog,
  widgetCatalog,
  defaultSettings,
} from '../../src/lib/learning/catalog';
import { newPage, uuid, type PageElement } from '../../src/lib/notebook-model';

test('Alle Lernwerkzeuge und Übungen lassen sich im Heft öffnen', async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
  const catalogue = [
    ...Object.entries(widgetCatalog).map(([kind, [label]]) => ({
      type: 'widget',
      kind,
      label,
    })),
    ...Object.entries(activityCatalog).map(([kind, label]) => ({
      type: 'activity',
      kind,
      label,
    })),
  ];
  const pages = catalogue.map(({ type, kind }) => ({
    ...newPage(),
    elements: [
      {
        id: uuid(),
        type,
        x: 15,
        y: 35,
        width: 180,
        height: 180,
        rotation: 0,
        locked: false,
        color: '#253c42',
        ...(type === 'widget' ? { widgetKind: kind } : { activityKind: kind }),
        settings: defaultSettings(
          kind as keyof typeof widgetCatalog | keyof typeof activityCatalog,
        ),
      } as PageElement,
    ],
  }));
  const created = await page.request.post('/api/werkstatt', {
    headers: { Origin: 'http://localhost:3100' },
    data: { action: 'create', title: 'Werkzeug-Katalog', pages },
  });
  expect(created.ok()).toBeTruthy();
  const data = await created.json();
  await page.goto(`/heft/${data.book.id}`);
  for (let i = 0; i < catalogue.length; i++) {
    await page.getByLabel(`Seite ${i + 1} öffnen`, { exact: true }).click();
    // Drawn like the reference: no header, just the picture.
    if (['mathtool', 'receipt', 'geodraw', 'checkout', 'monsternames', 'syllablejoin', 'anlaut', 'clapsyllables'].includes(catalogue[i].kind)) {
      await expect(page.locator('.interaction-surface .page-element svg').first()).toBeVisible();
      continue;
    }
    await expect(
      page.locator('.interaction-surface .learning-widget > header strong'),
    ).toHaveText(catalogue[i].label);
    await expect(
      page.locator('.interaction-surface .learning-content'),
    ).not.toBeEmpty();
  }
  expect(errors).toEqual([]);
  await page.screenshot({
    path: test.info().outputPath('lernwerkzeuge.png'),
    fullPage: true,
  });
});
