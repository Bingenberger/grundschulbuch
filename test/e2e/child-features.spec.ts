import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
test('Die Lehrkraft schaltet Funktionen für die Klasse und für einzelne Kinder', async ({ page, browser }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Funktionsprobe' } })).json();
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Funktionsklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Ida' });
  klass = await request('change', { id: klass.id, addChild: 'Max' });
  const [ida, max] = klass.children;
  const idaCard = '1'.repeat(64), maxCard = '2'.repeat(64);
  await request('change', { id: klass.id, childId: ida.id, digest: idaCard });
  await request('change', { id: klass.id, childId: max.id, digest: maxCard });
  const copies = await request('distribute', { id: klass.id, bookId: created.book.id });

  await page.goto('/klassen');
  await page.getByRole('navigation', { name: 'Klassen' }).getByRole('button', { name: 'Funktionsklasse' }).click();
  const classSwitches = page.getByRole('group', { name: 'Funktionen für die Klasse' });
  await classSwitches.getByRole('button', { name: 'Text schreiben', exact: true }).click();
  await expect(classSwitches.getByRole('button', { name: 'Text schreiben', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await classSwitches.getByRole('button', { name: 'Seitenübersicht', exact: true }).click();
  await expect(classSwitches.getByRole('button', { name: 'Seitenübersicht', exact: true })).toHaveAttribute('aria-pressed', 'false');
  // Max gets an own selection that still allows text.
  const maxRow = page.locator('.child-row').filter({ hasText: 'Max' });
  await maxRow.getByRole('button', { name: 'Funktionen', exact: true }).click();
  await maxRow.getByRole('button', { name: 'Eigene Auswahl', exact: true }).click();
  const maxSwitches = maxRow.getByRole('group', { name: 'Funktionen für Max' });
  await maxSwitches.getByRole('button', { name: 'Text schreiben', exact: true }).click();
  await expect(maxSwitches.getByRole('button', { name: 'Text schreiben', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(maxRow).toContainText('eigene Funktionen');

  const open = async (card: string, book: string) => {
    const context = await browser.newContext();
    const child = await context.newPage();
    await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest: card } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${book}`);
    return { child, context };
  };
  const bookOf = (childId: string) => copies.find((b: { ownerId: string; id: string }) => b.ownerId === childId).id;
  const idaView = await open(idaCard, bookOf(ida.id));
  const idaRail = idaView.child.getByRole('navigation', { name: 'Werkzeuge' });
  await expect(idaRail.getByRole('button', { name: 'Stift', exact: true })).toBeVisible();
  await expect(idaRail.getByRole('button', { name: 'Text', exact: true })).toHaveCount(0);
  await expect(idaView.child.getByRole('button', { name: 'Seiten einklappen' })).toHaveCount(0);
  await expect(idaView.child.getByRole('button', { name: 'Nächste Seite' })).toBeVisible();
  await idaView.context.close();
  const maxView = await open(maxCard, bookOf(max.id));
  await expect(maxView.child.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Text', exact: true })).toBeVisible();
  await expect(maxView.child.getByRole('button', { name: 'Seiten einklappen' })).toHaveCount(0);
  await maxView.context.close();
});
