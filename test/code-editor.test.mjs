import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const bundle = async (entry) => {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent', alias: { '@': './src' } });
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
  return mod.exports;
};
const ed = await bundle('src/lib/learning/code-editor.ts');
const { codeConfig } = await bundle('src/lib/reference/tools-runtime.ts');
const { codeCarpet } = await bundle('src/lib/sheets/sheets-1473.ts');

const task = (extra = {}) => ({ n: 5, start: [0, 4, 0], goal: [4, 0], walls: [], stars: [], stops: [], extra: [], ...extra });

test('Werkzeuge je Lektion wie in der Vorlage 1.49.0', () => {
  assert.deepEqual(ed.codeTools({ lesson: 'goal' }), ['start', 'goal', 'wall']);
  assert.deepEqual(ed.codeTools({ lesson: 'collect' }), ['start', 'goal', 'star', 'wall']);
  assert.deepEqual(ed.codeTools({ lesson: 'math', numMat: true }), ['start', 'wall']);
  assert.deepEqual(ed.codeTools({ lesson: 'word' }), ['move', 'start', 'wall']);
  assert.deepEqual(ed.codeTools({ lesson: 'read' }), []);
});

test('Tipp in die Vorschau trifft das Feld', () => {
  // The picture spans the carpet plus 10 units on each side.
  assert.deepEqual(ed.cellAt(5, 0.02, 0.02), [0, 0]);
  assert.deepEqual(ed.cellAt(5, 0.98, 0.5), [4, 2]);
  assert.equal(ed.cellAt(5, 0.001, 0.5), null);
  const box = ed.cellBox(5, 1, 2);
  assert.ok(Math.abs(box.left - (10 + 162) / 830) < 1e-9 && Math.abs(box.w - 162 / 830) < 1e-9);
});

test('Selbst bauen: Figur, Ziel, Hindernis, Stern, Verschieben', () => {
  let t = task();
  let r = ed.applyTool(t, 'wall', 2, 2, null);
  assert.deepEqual(r.t.walls, [[2, 2]]);
  assert.equal(r.t.own, true, 'built tasks are own');
  assert.equal(r.t.best, 9, 'shortest program is kept (4 forward, turn, 4 forward)');
  r = ed.applyTool(r.t, 'wall', 2, 2, null);
  assert.deepEqual(r.t.walls, [], 'tap again removes it');
  r = ed.applyTool(t, 'start', 0, 4, null);
  assert.deepEqual(r.t.start, [0, 4, 1], 'tapping the figure turns it');
  r = ed.applyTool(t, 'goal', 0, 4, null);
  assert.equal(r.t, t, 'no goal under the figure');
  r = ed.applyTool(t, 'goal', 3, 3, null);
  assert.deepEqual(r.t.goal, [3, 3]);
  t = task({ stops: [{ x: 1, y: 1, t: 'A' }] });
  r = ed.applyTool(t, 'move', 1, 1, null);
  assert.deepEqual(r.pick, [1, 1]);
  r = ed.applyTool(t, 'move', 3, 2, r.pick);
  assert.deepEqual(r.t.stops, [{ x: 3, y: 2, t: 'A' }]);
});

test('Lösbar oder nicht – mit dem Text der Vorlage', () => {
  assert.deepEqual(ed.checkTask({ lesson: 'goal' }, task()), { ok: true, text: 'Lösbar – das kürzeste Programm hat 9 Bausteine.' });
  const closed = task({ walls: [[3, 0], [4, 1]] });
  assert.deepEqual(ed.checkTask({ lesson: 'goal' }, closed), { ok: false, text: 'So geht es nicht: Das Ziel ist nicht zu erreichen.' });
  assert.equal(ed.checkTask({ lesson: 'goal' }, task({ goal: [0, 4] })).text, 'Die Figur steht schon auf dem Ziel.');
  assert.equal(ed.checkTask({ lesson: 'collect' }, task({ stars: [[0, 0]], walls: [[0, 1], [1, 0]] })).text, 'So geht es nicht: Ein Stern ist nicht zu erreichen.');
  assert.equal(ed.unsolvable({ lesson: 'goal', tasks: [task(), closed] }), 1);
});

test('Einstellungen ändern: neue Aufgaben, eigene bleiben – außer bei Lektion und Teppich', () => {
  const pg = codeConfig({ lesson: 'goal', size: 5, count: 3 });
  assert.equal(pg.tasks.length, 3);
  const own = { ...ed.applyTool(pg.tasks[1], 'wall', 0, 0, null).t };
  const mine = codeConfig({ ...pg, tasks: [pg.tasks[0], own, pg.tasks[2]] });
  assert.equal(mine.tasks[1].own, true, 'the port keeps own tasks');
  const harder = ed.changeSettings(mine, { ...mine, level: 'hard' }, codeConfig);
  assert.deepEqual(harder.tasks[1], mine.tasks[1], 'own task stays');
  assert.notDeepEqual(harder.tasks[0], mine.tasks[0], 'others are thrown again');
  const voice = ed.changeSettings(mine, { ...mine, voice: false }, codeConfig);
  assert.deepEqual(voice.tasks, mine.tasks, 'other settings keep all tasks');
  const bigger = ed.changeSettings(mine, { ...mine, size: 6 }, codeConfig);
  assert.ok(bigger.tasks.every((t) => t.n === 6 && !t.own));
  const renewed = ed.renewKeepingOwn(mine, codeConfig);
  assert.deepEqual(renewed[1], mine.tasks[1]);
  // The carpet picture for building is square and shows the carpet.
  assert.match(codeCarpet(mine, mine.tasks[0]), /^<svg [^>]*viewBox="34 130 830 830"/);
});
