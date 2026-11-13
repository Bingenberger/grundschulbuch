import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { findKaraokeImage } from '../src/lib/image-sources.mjs';
const bundle = await build({ entryPoints: ['src/lib/learning/karaoke-pictures.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
const mod = { exports: {} }; new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { karaokePictureList, completeKaraokePictures } = mod.exports;
const options = JSON.parse(await (await import('node:fs/promises')).readFile('src/lib/learning/music-options-data.json', 'utf8'));
const picture = '/api/medien/' + 'a'.repeat(64) + '.png';
const own = (text, extra = {}) => ({ text, pics: {}, picsOn: true, ...extra });
const answer = value => new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
test('Die Liedhinweise bestimmen Wortauswahl und Suchbegriffe wie in der Referenz', () => {
  const song = options.songs.find(s => s.id === 'alle-voegel');
  const words = karaokePictureList(own(song.text, { song: song.id }));
  assert.equal(words.find(p => p.key === 'vögel').term, 'Vogel');
  assert.equal(words.find(p => p.key === 'vögelein').term, 'Vogel');
  assert.ok(words.some(p => p.key === 'singen'));
  assert.ok(!words.some(p => p.key === 'welch'));
  const remaining = karaokePictureList(own(song.text, { song: song.id, pics: { vögel: { img: picture, instead: true } }, nopic: ['amsel'] }));
  assert.ok(!remaining.some(p => ['vögel', 'amsel'].includes(p.key)));
});
test('Die Automatik lädt bis zu 60 Wortbilder mit höchstens drei gleichzeitigen Suchen', async () => {
  const words = Array.from({ length: 70 }, (_, i) => `Nomen${String.fromCharCode(97 + Math.floor(i / 26))}${String.fromCharCode(97 + i % 26)}`);
  const initial = own(words.map(w => `[${w}]`).join(' '));
  let active = 0, peak = 0; const queries = [];
  const result = await completeKaraokePictures(initial, { signal: new AbortController().signal, fetch: async (url, init) => {
    if (init.method === 'POST') return answer({ src: picture });
    queries.push(new URL(url, 'http://local').searchParams.get('q')); peak = Math.max(peak, ++active);
    await new Promise(resolve => setTimeout(resolve, 2)); active--;
    return answer({ items: [{ full: 'https://static.arasaac.org/pictograms/1/1_300.png' }] });
  } });
  assert.equal(queries.length, 60); assert.equal(result.added, 60); assert.ok(peak <= 3 && peak > 1); assert.equal(Object.keys(result.karaoke.pics).length, 60); assert.deepEqual(initial.pics, {});
});
test('Deaktivierung, eigene Bilder und entfernte Bilder werden respektiert; Ausfälle behalten den Liedtext', async () => {
  let requests = 0;
  const initial = own('[Hut] [Baum] [Haus]', { pics: { hut: { img: picture, instead: true } }, nopic: ['baum'] });
  const result = await completeKaraokePictures(initial, { signal: new AbortController().signal, fetch: async () => { requests++; throw Error('Offline'); } });
  assert.equal(requests, 1); assert.equal(result.errors, 1); assert.deepEqual(result.karaoke.pics.hut, initial.pics.hut); assert.equal(result.karaoke.text, initial.text);
  await completeKaraokePictures({ ...initial, picsOn: false }, { signal: new AbortController().signal, fetch: async () => { throw Error('Keine Suche erlaubt'); } });
  const controller = new AbortController(); controller.abort(); await assert.rejects(completeKaraokePictures(initial, { signal: controller.signal }), { name: 'AbortError' });
});
test('Mehrere Lieder können bereits gespeicherte Wortbilder innerhalb eines Vorgangs wiederverwenden', async () => {
  let searches = 0, copies = 0; const cache = new Map();
  const fetch = async (url, init) => { if (init.method === 'POST') { copies++; return answer({ src: picture }); } searches++; return answer({ items: [{ full: 'https://static.arasaac.org/pictograms/1/1_300.png' }] }); };
  await completeKaraokePictures(own('[Hut]'), { cache, fetch, signal: new AbortController().signal });
  const second = await completeKaraokePictures(own('[Hut]'), { cache, fetch, signal: new AbortController().signal });
  assert.equal(searches, 1); assert.equal(copies, 1); assert.equal(second.karaoke.pics.hut.img, picture);
});
test('Die serverseitige Suche nutzt Grundformen und kuratierte Hinweise und verwirft unpassende Treffer', async () => {
  const previous = globalThis.fetch, calls = [];
  globalThis.fetch = async url => {
    const address = String(url); calls.push(address);
    if (address.endsWith('/keywords/de')) return answer({ words: ['baum', 'gehen'] });
    const term = decodeURIComponent(address.split('/').pop());
    if (term === 'baum') return answer([{ _id: 1, keywords: [{ keyword: 'Baumhaus', type: 2 }] }, { _id: 2, keywords: [{ keyword: 'Baum', type: 2 }] }]);
    if (term === 'gehen') return answer([{ _id: 3, keywords: [{ keyword: 'gehen', type: 3 }] }]);
    if (term === 'vogel') return answer([{ _id: 4, violence: true, keywords: [{ keyword: 'Vogel', type: 2 }] }, { _id: 5, keywords: [{ keyword: 'Vogel', type: 2 }] }]);
    return answer([]);
  };
  try {
    assert.equal((await findKaraokeImage('Bäume')).id, '2');
    assert.equal((await findKaraokeImage('geht')).id, '3');
    assert.equal((await findKaraokeImage('Vögelein', 'Vogel')).id, '5');
    assert.equal(await findKaraokeImage('und'), null);
    assert.ok(!calls.some(url => url.endsWith('/search/und')));
  } finally { globalThis.fetch = previous; }
});
