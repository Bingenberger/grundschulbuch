import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { build } from 'esbuild';
const dir = await fs.mkdtemp(
  path.join(os.tmpdir(), 'grundschulbuch-learning-'),
);
process.env.GRUNDSCHULBUCH_DATA_DIR = dir;
process.env.SESSION_SECRET = 'learning-test-only'.padEnd(48, 'x');
after(() => fs.rm(dir, { recursive: true, force: true }));
async function module(file) {
  const result = await build({
    entryPoints: [file],
    bundle: true,
    write: false,
    platform: 'node',
    format: 'esm',
    logLevel: 'silent',
  });
  return import(
    'data:text/javascript;base64,' +
      Buffer.from(result.outputFiles[0].contents).toString('base64')
  );
}
const algorithms = await module('src/lib/learning/algorithms.ts'),
  catalog = await module('src/lib/learning/catalog.ts'),
  templates = await module('src/lib/learning/templates.ts'),
  worksheets = await module('src/lib/learning/worksheets.ts');
const books = await import('../src/lib/notebooks.mjs');
const classes = await import('../src/lib/classes.mjs');
const store = await import('../src/lib/store.mjs');
const owner = crypto.randomUUID(),
  child = crypto.randomUUID();
const element = (type, kind) => ({
  id: crypto.randomUUID(),
  type,
  x: 15,
  y: 30,
  width: 170,
  height: 150,
  rotation: 0,
  locked: true,
  color: '#253c42',
  ...(type === 'widget' ? { widgetKind: kind } : { activityKind: kind }),
  settings: catalog.defaultSettings(kind),
});
const page = (elements) => ({
  id: crypto.randomUUID(),
  revision: 0,
  orientation: 'portrait',
  ruling: 'blanko',
  elements,
});
const status = (n) => (e) => e instanceof books.BookError && e.status === n;

test('Jedes angebotene Lernwerkzeug und jede Übung hat gültige speicherbare Einstellungen', () => {
  for (const kind of Object.keys(catalog.widgetCatalog))
    assert.equal(
      books.validatePage(page([element('widget', kind)])).elements[0]
        .widgetKind,
      kind,
    );
  for (const kind of Object.keys(catalog.activityCatalog))
    assert.equal(
      books.validatePage(page([element('activity', kind)])).elements[0]
        .activityKind,
      kind,
    );
});
test('Der Vorlagenkatalog erzeugt eigenständige gültige Seiten für alle Kategorien', () => {
  assert.ok(templates.blueprints.length >= 100);
  const ids = new Set();
  for (const meta of templates.blueprints) {
    assert.equal(ids.has(meta.id), false);
    ids.add(meta.id);
    const pages = templates.blueprintPages(meta);
    assert.ok(pages.length);
    for (const page of pages) {
      assert.ok(books.validatePage(page));
      assert.ok(page.elements.length);
    }
  }
});
test('Alle Arbeitsblatt-Formate erzeugen Aufgaben und separate Lösungsseiten', () => {
  for (const kind of Object.keys(worksheets.extraGenerators)) {
    const pages = worksheets.generatePages({
      kind,
      title: 'Test',
      maximum: 100,
      words: 'Sonne,Schule',
      seed: 42,
    });
    assert.equal(pages.length, 2, kind);
    for (const p of pages) {
      assert.ok(p.elements.length > 2, kind);
      assert.ok(books.validatePage(p), kind);
    }
  }
});
test('Geschützte interaktive Aufgaben erlauben Antworten, aber keine Änderungen am Entwurf', async () => {
  const created = await books.createBook(child, 'kind', {
    title: 'Meine Übungen',
    pages: [page([element('activity', 'quiz')])],
  });
  const p = created.pages[0];
  const answer = {
    ...p,
    elements: [
      {
        ...p.elements[0],
        response: { values: ['1'], checked: true, score: 100 },
      },
    ],
  };
  const saved = await books.savePage(child, created.book.id, answer, true);
  assert.deepEqual(saved.elements[0].response.values, ['1']);
  await assert.rejects(
    books.savePage(
      child,
      created.book.id,
      {
        ...saved,
        elements: [
          {
            ...saved.elements[0],
            settings: { ...saved.elements[0].settings, title: 'Verändert' },
          },
        ],
      },
      true,
    ),
    status(403),
  );
  await assert.rejects(
    books.savePage(
      child,
      created.book.id,
      { ...saved, paperColor: '#ff0000' },
      true,
    ),
    status(403),
  );
  await assert.rejects(
    books.savePage(
      child,
      created.book.id,
      { ...saved, elements: [...saved.elements, element('widget', 'timer')] },
      true,
    ),
    status(403),
  );
});
test('Geschützte Zeichnungen und Bilder bleiben auch mit Antwortfeldern unveränderlich', async () => {
  const el = {
    id: crypto.randomUUID(),
    type: 'text',
    x: 10,
    y: 10,
    width: 100,
    height: 20,
    rotation: 0,
    locked: true,
    color: '#253c42',
    text: 'Fest',
    font: 'Andika',
    fontSize: 18,
  };
  const created = await books.createBook(child, 'kind', {
    title: 'Fest',
    pages: [page([el])],
  });
  await assert.rejects(
    books.savePage(
      child,
      created.book.id,
      {
        ...created.pages[0],
        elements: [{ ...el, text: 'Geändert', response: { score: 100 } }],
      },
      true,
    ),
    status(403),
  );
});
test('Medien in verschachtelten Lernwerkzeugen werden geprüft und beim Austeilen freigegeben', async () => {
  const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=',
      'base64',
    ),
    image = await books.storeImage(owner, png);
  const el = element('widget', 'communication');
  el.settings.cells = [{ label: 'Sonne', image: image.src }];
  await assert.rejects(
    books.createBook(child, 'kind', { title: 'Fremd', pages: [page([el])] }),
    status(403),
  );
  let klass = await classes.createClass(owner, '1a');
  klass = await classes.changeClass(owner, klass.id, { addChild: 'Ada' });
  const source = await books.createBook(owner, 'lehrkraft', {
    title: 'Kommunikation',
    pages: [page([el])],
  });
  const [copy] = await classes.distribute(owner, klass.id, source.book.id);
  const result = await books.getBook(klass.children[0].id, copy.id);
  assert.equal(result.pages[0].elements[0].settings.cells[0].image, image.src);
  assert.ok(
    await books.readImage(klass.children[0].id, image.src.split('/').pop()),
  );
});
test('Einstellungen enthalten keine externen Medien, Data-URLs oder Prototyp-Schlüssel', () => {
  for (const settings of [
    { cells: [{ image: 'https://fremd.invalid/bild.png' }] },
    { text: 'data:image/png;base64,ABC' },
    JSON.parse('{"__proto__":{"x":1}}'),
  ])
    assert.throws(() =>
      books.validatePage(
        page([{ ...element('widget', 'communication'), settings }]),
      ),
    );
});
test('Rechner verwendet einen begrenzten Parser statt ausführbarem Code', () => {
  assert.equal(algorithms.calculate('2 + 3 × (4 − 1)'), 11);
  assert.equal(algorithms.calculate('2,40 + 0,60'), 3);
  assert.equal(algorithms.calculate('-5 + 7'), 2);
  for (const text of [
    '1/0',
    'alert(1)',
    '2 +',
    'globalThis.x=1',
    'Math.random()',
  ])
    assert.throws(() => algorithms.calculate(text));
});
test('Worträtsel zählt doppelte Buchstaben korrekt', () => {
  assert.deepEqual(algorithms.wordleFeedback('APPLE', 'ALLEE'), [
    'correct',
    'present',
    'absent',
    'absent',
    'correct',
  ]);
});
test('Animationsbilder verwenden dieselbe begrenzte Interpolation in Vorschau und Export', () => {
  const frames = [
    { x: 0, y: 10, scale: 1 },
    { x: 100, y: 30, scale: 2 },
  ];
  assert.equal(algorithms.animationPose(frames, 0.5).x, 50);
  assert.equal(algorithms.animationPose(frames, 0.5, 'in').x, 25);
  assert.equal(algorithms.animationPose(frames, 0.5).scale, 1.5);
  assert.equal(algorithms.animationPose(frames, 9).x, 100);
  assert.equal(algorithms.animationPose([], 0).x, 50);
});
test('Koordinatenspiel verteilt vollständige Schiffe innerhalb des Rasters', () => {
  for (let seed = 1; seed <= 30; seed++) {
    const fleet = algorithms.battleFleet(seed);
    assert.equal(fleet.length, 8);
    assert.equal(new Set(fleet).size, 8);
    assert.ok(fleet.every((i) => i >= 0 && i < 100));
  }
  assert.notDeepEqual(algorithms.battleFleet(1), algorithms.battleFleet(2));
});
test('Erzeugte Sudokus haben gültige Zeilen und genau eine Lösung', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const { puzzle, solution } = algorithms.sudoku4(seed);
    assert.equal(algorithms.sudokuSolutions(puzzle), 1);
    assert.ok(puzzle.some((n) => n === 0));
    for (let row = 0; row < 4; row++)
      assert.equal(new Set(solution.slice(row * 4, row * 4 + 4)).size, 4);
    for (let col = 0; col < 4; col++)
      assert.equal(
        new Set([0, 1, 2, 3].map((row) => solution[row * 4 + col])).size,
        4,
      );
  }
});
test('Fehlerhafte importierte Einstellungen und Kinderantworten werden vor dem Rendern abgelehnt', () => {
  for (const settings of [
    { words: [null] },
    { background: '#fff url(https://fremd.invalid/bild)' },
    { tracks: [null] },
    { questions: [{ text: 'Frage', answers: ['A', 'B'], correct: 5 }] },
    { frames: [{ x: 'links', y: 50 }] },
  ])
    assert.throws(() =>
      books.validatePage(page([{ ...element('widget', 'piano'), settings }])),
    );
  for (const response of [
    { index: -1 },
    { date: 'kein Datum' },
    { path: [null] },
    { beats: [null] },
    { recordings: [null] },
  ])
    assert.throws(() =>
      books.validatePage(
        page([{ ...element('widget', 'calendar'), response }]),
      ),
    );
});
test('HTML-Apps sind eigene berechtigte Medien und werden nicht als Internetadressen gespeichert', async () => {
  const app = await books.storeWebApp(
    owner,
    Buffer.from('<!doctype html><button>Zählen</button>'),
  );
  assert.ok(await books.readImage(owner, app.src.split('/').pop()));
  await assert.rejects(
    books.readImage(child, app.src.split('/').pop()),
    status(403),
  );
  const el = {
    id: crypto.randomUUID(),
    type: 'embed',
    x: 10,
    y: 10,
    width: 100,
    height: 80,
    rotation: 0,
    locked: false,
    color: '#253c42',
    embedKind: 'app',
    src: app.src,
  };
  assert.ok(books.validatePage(page([el])));
  assert.throws(() =>
    books.validatePage(
      page([{ ...el, src: 'https://example.invalid/app.html' }]),
    ),
  );
});
test('Labyrinthe sind zusammenhängend und haben übereinstimmende Wände', () => {
  for (const seed of [1, 42, 123]) {
    const { walls, size } = algorithms.mazeGrid(8, seed),
      visited = new Set([0]),
      queue = [0];
    while (queue.length) {
      const at = queue.shift();
      walls[at].forEach((wall, d) => {
        if (wall) return;
        const to = at + [-size, 1, size, -1][d];
        assert.equal(walls[to][(d + 2) % 4], false);
        if (!visited.has(to)) {
          visited.add(to);
          queue.push(to);
        }
      });
    }
    assert.equal(visited.size, 64);
  }
});
test('Vier gewinnt erkennt Zeilen, Spalten und Diagonalen', () => {
  for (const cells of [
    [35, 36, 37, 38],
    [0, 7, 14, 21],
    [0, 8, 16, 24],
  ]) {
    const board = Array(42).fill(0);
    cells.forEach((i) => (board[i] = 1));
    assert.equal(algorithms.connectWinner(board), 1);
  }
  assert.equal(algorithms.connectWinner(Array(42).fill(0)), 0);
});
test('Ordner löschen behält Hefte; Eigentum und veraltete Änderungen bleiben geschützt', async () => {
  const folder = await books.saveFolder(owner, { title: 'Deutsch' });
  const { book } = await books.createBook(owner, 'lehrkraft', {
    title: 'Heft',
  });
  const moved = await books.updateBook(owner, book.id, {
    revision: book.revision,
    folderId: folder.id,
  });
  assert.equal(moved.folderId, folder.id);
  await assert.rejects(
    books.updateBook(child, book.id, {
      revision: moved.revision,
      folderId: null,
    }),
    status(404),
  );
  await books.removeFolder(owner, folder.id);
  assert.equal((await books.getBook(owner, book.id)).book.folderId, null);
  assert.deepEqual(await books.listFolders(owner), []);
  assert.ok(await fs.stat(store.dataPath('hefte', book.id, 'heft.json')));
});
test('Gleichzeitiges Verschieben und Ordnerlöschen hinterlässt keine verwaisten Zuordnungen', async () => {
  const folder = await books.saveFolder(owner, { title: 'Kurzlebig' }),
    created = await books.createBook(owner, 'lehrkraft', {
      title: 'Bleibt erhalten',
    });
  const outcomes = await Promise.allSettled([
    books.updateBook(owner, created.book.id, {
      revision: created.book.revision,
      folderId: folder.id,
    }),
    books.removeFolder(owner, folder.id),
  ]);
  assert.equal(outcomes[1].status, 'fulfilled');
  assert.equal(
    (await books.getBook(owner, created.book.id)).book.folderId ?? null,
    null,
  );
  assert.equal(
    (await books.listFolders(owner)).some((f) => f.id === folder.id),
    false,
  );
});
