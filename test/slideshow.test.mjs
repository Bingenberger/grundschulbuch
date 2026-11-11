import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
async function bundle(file) {
  const code = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', code.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports);
  return compiled.exports;
}
const g = await bundle('src/lib/learning/slideshow-playback.ts');
const { defaultSettings } = await bundle('src/lib/learning/catalog.ts');
const { default: Widget } = await bundle('src/components/learning/Widget.tsx');
const { wavBlob } = await bundle('src/lib/learning/audio.ts');
const portable = await bundle('src/lib/portable.ts');
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-slideshow-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'slideshow-test-only'.padEnd(48, 'x');
after(() => fs.rm(directory, { recursive: true, force: true }));
const books = await import('../src/lib/notebooks.mjs');
const classes = await import('../src/lib/classes.mjs');
const validation = await import('../src/lib/learning/validation.mjs');
const config = patch => ({ ...defaultSettings('slideshow'), ...patch });
const element = (c, state) => ({ id: crypto.randomUUID(), type: 'widget', widgetKind: 'slideshow', x: 15, y: 35, width: 180, height: 180, rotation: 0, locked: false, color: '#253c42', settings: c, ...(state ? { response: state } : {}) });
const page = elements => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements });

function playback(patch = {}) {
  let now = 0, sequence = 0; const jobs = new Map(), sounds = [], indices = [], finished = [], snapshots = [];
  const player = g.createSlideshowPlayback({
    slides: [{ title: 'Eins', text: '', seconds: 2 }, { title: 'Zwei', text: '', seconds: 3 }],
    now: () => now, schedule: (callback, ms) => { const id = ++sequence; jobs.set(id, { at: now + ms, callback }); return id; }, cancel: id => jobs.delete(id),
    audio: src => { const sound = { src, volume: 1, onended: null, onerror: null, ontimeupdate: null, plays: 0, pauses: 0, play() { this.plays++; return Promise.resolve(); }, pause() { this.pauses++; } }; sounds.push(sound); return sound; },
    onIndex: index => indices.push(index), onFinish: index => finished.push(index), onChange: value => snapshots.push(value), ...patch,
  });
  function tick(ms) { const until = now + ms; let guard = 0;
    while (true) { const next = [...jobs].filter(([, job]) => job.at <= until).sort((a, b) => a[1].at - b[1].at)[0]; if (!next) break; if (++guard > 10000) throw new Error('Timer loop'); now = next[1].at; jobs.delete(next[0]); next[1].callback(); }
    now = until;
  }
  return { player, tick, sounds, indices, finished, jobs, snapshots };
}
const voiced = [{ title: 'Eins', text: '', seconds: 2, audio: 'eigener-ton' }, { title: 'Zwei', text: '', seconds: 3, audio: 'zweiter-ton' }];

test('Anzeigen oder Drucken startet weder Audio noch Timer', () => {
  const x = playback({ slides: voiced }); assert.equal(x.sounds.length, 0); assert.equal(x.jobs.size, 0);
  const html = renderToStaticMarkup(React.createElement(Widget, { element: element(config({})) }));
  assert.match(html, /Diaschau/); assert.match(html, /Vorherige Folie/); assert.match(html, /disabled=""/); assert.doesNotMatch(html, /autoplay/i);
});
test('Folienton startet mit dem Ablauf und ein langer Ton verlängert die Mindestdauer', () => {
  const x = playback({ slides: voiced }); x.player.play(); assert.equal(x.sounds[0].plays, 1);
  x.tick(2500); assert.equal(x.player.snapshot().index, 0);
  x.sounds[0].onended(); assert.equal(x.player.snapshot().index, 1); assert.equal(x.sounds[1].plays, 1); assert.deepEqual(x.indices, [1]);
});
test('Ein kurzer Ton verkürzt die Mindestdauer nicht; verspätete Zeitereignisse erzeugen keinen Fehler', () => {
  const x = playback({ slides: [{ ...voiced[0], seconds: 60 }, voiced[1]] }); x.player.play(); x.tick(1000);
  x.sounds[0].onended(); x.sounds[0].ontimeupdate(); x.tick(58000); assert.equal(x.player.snapshot().index, 0); assert.equal(x.player.snapshot().error, '');
  x.tick(1000); assert.equal(x.player.snapshot().index, 1);
});
test('Pause hält Bilddauer und Ton an; Fortsetzen startet dieselbe Aufnahme an ihrer Position weiter', () => {
  const x = playback({ slides: voiced }); x.player.play(); x.tick(750); x.player.pause();
  assert.equal(x.sounds[0].pauses, 1); assert.equal(x.jobs.size, 0); x.tick(10000); assert.equal(x.player.snapshot().index, 0);
  x.player.play(); assert.equal(x.sounds.length, 1); assert.equal(x.sounds[0].plays, 2);
  x.sounds[0].onended(); x.tick(1249); assert.equal(x.player.snapshot().index, 0); x.tick(1); assert.equal(x.player.snapshot().index, 1);
});
test('Ohne Warten auf das Tonende wird die alte Aufnahme zum Wechsel beendet', () => {
  const x = playback({ slides: voiced, waitAudio: false }); x.player.play(); x.tick(2000);
  assert.equal(x.player.snapshot().index, 1); assert.equal(x.sounds[0].pauses, 1);
  assert.equal(x.sounds[0].onended, null); assert.equal(x.sounds[1].plays, 1);
});
test('Blättern während der Wiedergabe beendet alte Ressourcen und ignoriert verspätete Ereignisse', () => {
  const x = playback({ slides: voiced }); x.player.play(); const oldEnd = x.sounds[0].onended, oldError = x.sounds[0].onerror;
  x.player.jump(1); assert.equal(x.sounds[0].pauses, 1); assert.equal(x.sounds[1].plays, 1); assert.equal(x.player.snapshot().index, 1);
  oldEnd(); oldError(); x.tick(1000); assert.equal(x.player.snapshot().index, 1); assert.equal(x.player.snapshot().error, ''); assert.deepEqual(x.finished, []);
});
test('Blättern im Pausenzustand spielt keinen Ton; Stoppen löscht sämtliche Timer und Audiobindungen', () => {
  const x = playback({ slides: voiced }); x.player.jump(1); assert.equal(x.sounds.length, 0);
  x.player.play(); x.player.stop(); assert.equal(x.jobs.size, 0); assert.equal(x.sounds[0].onended, null); assert.equal(x.sounds[0].pauses, 1);
  x.tick(100000); assert.deepEqual(x.finished, []);
});
test('Eine endliche Diaschau endet einmalig und erneutes Abspielen beginnt mit der ersten Folie', () => {
  const x = playback(); x.player.play(); x.tick(5000);
  assert.equal(x.player.snapshot().status, 'ended'); assert.deepEqual(x.finished, [1]); x.tick(6000); assert.deepEqual(x.finished, [1]);
  x.player.play(); assert.equal(x.player.snapshot().index, 0); assert.equal(x.player.snapshot().status, 'playing');
});
test('Wiederholung funktioniert auch bei einer einzigen vertonten Folie', () => {
  const x = playback({ slides: [voiced[0]], repeat: true }); x.player.play(); x.sounds[0].onended(); x.tick(2000);
  assert.equal(x.sounds.length, 2); assert.equal(x.sounds[1].plays, 1); assert.equal(x.player.snapshot().status, 'playing'); assert.deepEqual(x.finished, []);
});
test('Deaktivierter Folienton benötigt keine Audioressourcen und behindert den Ablauf nicht', () => {
  const x = playback({ slides: voiced, sound: false }); x.player.play(); x.tick(5000);
  assert.equal(x.sounds.length, 0); assert.equal(x.player.snapshot().status, 'ended');
});
test('Blockierte Wiedergabe pausiert mit Hinweis; ohne Ton lässt sich bewusst fortsetzen', async () => {
  const x = playback({ slides: voiced, audio: () => ({ volume: 1, onended: null, onerror: null, ontimeupdate: null, pause() {}, play() { return Promise.reject(new Error('NotAllowed')); } }) });
  x.player.play(); await Promise.resolve(); assert.equal(x.player.snapshot().status, 'paused'); assert.match(x.player.snapshot().error, /Browser/); assert.equal(x.jobs.size, 0);
  x.player.withoutAudio(); x.tick(2000); assert.equal(x.player.snapshot().index, 1);
  // Dispose before the rejected next slide can do anything else.
  x.player.stop(); await Promise.resolve(); assert.equal(x.player.snapshot().error, '');
});
test('Ausbleibende Audioereignisse halten eine Folie nicht unbegrenzt fest', () => {
  const x = playback({ slides: voiced }); x.player.play(); x.tick(30000);
  assert.equal(x.player.snapshot().status, 'paused'); assert.match(x.player.snapshot().error, /reagiert nicht/); assert.equal(x.jobs.size, 0);
  x.player.withoutAudio(); x.tick(0); assert.equal(x.player.snapshot().index, 1);
});
test('Wiederherstellung und Rückgängig ändern die Folie ohne unerwartete Wiedergabe', () => {
  const x = playback({ index: 1, completed: true }); assert.equal(x.player.snapshot().status, 'ended');
  x.player.restore(1, false); assert.equal(x.player.snapshot().status, 'idle'); assert.equal(x.jobs.size, 0);
  x.player.play(); x.player.restore(0, false); assert.equal(x.player.snapshot().index, 0); assert.equal(x.player.snapshot().status, 'idle'); assert.deepEqual(x.indices, []);
  assert.equal(g.slideshowIndex(999, 3), 2); assert.equal(g.slideshowIndex(-1, 3), 0);
});
test('Aktualisierte Speicherhandler ändern keinen laufenden Timer und erhalten den aktuellen Antwortstand', () => {
  const x = playback(), current = [], ends = []; x.player.play(); x.tick(1000);
  x.player.setResponseHandlers(index => current.push(index), index => ends.push(index)); x.tick(1000);
  assert.deepEqual(current, [1]); assert.deepEqual(x.indices, []); x.tick(3000); assert.deepEqual(ends, [1]);
});
test('Eine verspätete Wiedergabeablehnung kann eine neue Folie nicht pausieren', async () => {
  let rejectFirst;
  const x = playback({ slides: voiced, audio: () => ({ volume: 1, onended: null, onerror: null, ontimeupdate: null, pause() {}, play() { return rejectFirst ? Promise.resolve() : new Promise((_, reject) => { rejectFirst = reject; }); } }) });
  x.player.play(); x.player.jump(1); rejectFirst(new Error('old request')); await Promise.resolve();
  assert.equal(x.player.snapshot().index, 1); assert.equal(x.player.snapshot().status, 'playing'); assert.equal(x.player.snapshot().error, ''); x.player.stop();
});
test('Ungültige Wiedergabeoptionen und fremde Medien werden beim Speichern abgelehnt', () => {
  assert.throws(() => validation.widgetSettings(config({ slideshowSound: 'ja' })));
  assert.throws(() => validation.widgetSettings(config({ slideshowWaitAudio: 1 })));
  assert.throws(() => validation.widgetSettings(config({ slides: [{ title: 'X', text: '', audio: 'https://extern.invalid/ton.mp3' }] })));
});
test('Folienbilder, Ton und Position werden an Kinder freigegeben und mit Heftdateien weitergegeben', async () => {
  const owner = crypto.randomUUID(), wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) }).arrayBuffer()), sound = await books.storeAudio(owner, wav);
  const image = await books.storeImage(owner, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=', 'base64'));
  const c = config({ slideshowSound: true, slideshowWaitAudio: true, slides: [{ title: 'Eins', text: 'Text', seconds: 2, image: image.src, audio: sound.src }, { title: 'Zwei', text: 'Ende', seconds: 3 }] }), state = { index: 1, completed: true };
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Liedprobe', pages: [page([element(c, state)])] });
  let klass = await classes.createClass(owner, 'Liedklasse'); klass = await classes.changeClass(owner, klass.id, { addChild: 'Ada' });
  const [copy] = await classes.distribute(owner, klass.id, created.book.id), child = klass.children[0].id, own = await books.getBook(child, copy.id);
  assert.equal(own.pages[0].elements[0].locked, true); assert.equal(own.pages[0].elements[0].response, undefined);
  assert.ok(await books.readImage(child, sound.src.split('/').pop())); assert.ok(await books.readImage(child, image.src.split('/').pop()));
  assert.ok(await books.savePage(child, copy.id, { ...own.pages[0], elements: own.pages[0].elements.map(el => ({ ...el, response: state })) }, true));
  const previous = globalThis.fetch;
  globalThis.fetch = async (url, request) => {
    if (url === sound.src || url === image.src) return new Response(await books.readImage(owner, url.split('/').pop()), { headers: { 'content-type': url.endsWith('.wav') ? 'audio/wav' : 'image/png' } });
    if (url === '/api/medien' || url === '/api/ton') { const bytes = Buffer.from(await new Response(request.body).arrayBuffer()); return Response.json(await (url === '/api/ton' ? books.storeAudio(owner, bytes) : books.storeImage(owner, bytes))); }
    assert.equal(url, '/api/werkstatt'); return Response.json(await books.createBook(owner, 'lehrkraft', JSON.parse(request.body)));
  };
  try { const archive = await portable.exportArchive(created), imported = await portable.importPortable(new File([archive], 'lied.grundschulbuch')); assert.deepEqual(imported.pages[0].elements[0].settings, c); assert.deepEqual(imported.pages[0].elements[0].response, state); }
  finally { globalThis.fetch = previous; }
});
