import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { widgetSettings, learningResponse } from '../src/lib/learning/validation.mjs';
async function bundle(file) {
  const compiled = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', logLevel: 'silent' });
  const mod = { exports: {} }; new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports); return mod.exports;
}
const { musicPresets, musicSettings, musicPage } = await bundle('src/lib/learning/music.ts');
const { learningBlocks } = await bundle('src/lib/learning/blocks.ts');
const { validatePage } = await import('../src/lib/notebooks.mjs');
test('Alle Musikvorlagen einschließlich einstellbarer Varianten sind als Lernwerkzeug erreichbar', () => {
  const blocks = learningBlocks.filter(b => b.subject === 'Musik');
  assert.equal(blocks.length, 36);
  for (const preset of musicPresets) assert.ok(blocks.some(b => b.id === `music-${preset.id}`), preset.id);
  assert.ok(blocks.some(b => b.generator === 'notes'));
  assert.ok(!blocks.some(b => /Notenlinien|Klanggeschichte/.test(b.title)));
  assert.equal(new Set(blocks.map(b => b.title)).size, blocks.length);
});
test('Musikseiten und Konfigurationen bestehen die serverseitige Validierung', () => {
  for (const preset of musicPresets) {
    const settings = widgetSettings(musicSettings(preset));
    const [page] = musicPage(settings);
    assert.equal(page.orientation, 'landscape');
    assert.equal(page.elements[0].width, 297);
    const stored = validatePage(page);
    assert.equal(stored.elements[0].settings.musicTemplate, preset.id);
    assert.deepEqual(stored.elements[0].settings.musicConfig, settings.musicConfig);
  }
});
test('Baukasten-Antworten und Aufnahmen bleiben getrennt von den Lehrkraft-Einstellungen speicherbar', () => {
  const preset = musicPresets.find(p => p.id === 'seq-beat');
  const settings = musicSettings(preset), changed = structuredClone(settings.musicConfig);
  changed.seq.tracks[0].steps[1] = true;
  const response = learningResponse({ musicConfig: changed, recordingSrc: '/api/medien/' + 'a'.repeat(64) + '.webm' });
  const [page] = musicPage(settings); page.elements[0].response = response;
  const stored = validatePage(page).elements[0];
  assert.equal(stored.response.musicConfig.seq.tracks[0].steps[1], true);
  assert.equal(stored.settings.musicConfig.seq.tracks[0].steps[1], false);
});

test('Neue Musikmedien werden geprüft und nur eingefügte Audiowerkzeuge laden Kinderaufnahmen ein', async () => {
  const { musicInvitesAudio } = await import('../src/lib/learning/music-validation.mjs');
  assert.equal(musicInvitesAudio({ musicTemplate: 'inst-piano' }), true);
  assert.equal(musicInvitesAudio({ musicTemplate: 'seq-sounds' }), true);
  assert.equal(musicInvitesAudio({ musicTemplate: 'nq-names' }), false);
  assert.equal(musicInvitesAudio({ musicTemplate: 'unknown' }), false);
  assert.throws(() => widgetSettings({ musicTemplate: 'unknown', musicConfig: {} }));
  assert.throws(() => learningResponse({ musicConfig: { kit: { pads: [{ sound: 'https://example.org/audio.mp3' }] } } }));
  assert.throws(() => widgetSettings({ ...musicSettings(musicPresets[0]), musicConfig: { karaoke: { audio: 'https://example.org/audio.mp3' } } }));
});

const musicSettingsTools = await bundle('src/lib/learning/music-settings.ts');
const musicReferenceTools = await bundle('src/lib/reference/music-runtime.ts');
test('Wortbilder mit Umlauten und langen Wörtern überstehen Speichern und Kinderantworten', () => {
  const { encodeMusicConfig, decodeMusicConfig } = musicSettingsTools;
  const image = '/api/medien/' + 'b'.repeat(64) + '.png';
  const pics = Object.fromEntries(Array.from({ length: 400 }, (_, i) => [`Vögel${i}${'ü'.repeat(25)}`, { img: image, instead: i % 2 === 0 }]));
  const config = { kind: 'karaoke', karaoke: { text: 'Vögel singen', pics, picsOn: true } };
  const encoded = encodeMusicConfig(config);
  assert.equal(Object.keys(encoded.karaoke.pics).length, 0);
  assert.equal(encoded.musicPictures.length, 400);
  assert.ok(JSON.stringify(encoded).length > 50000);
  const response = learningResponse({ musicConfig: encoded });
  assert.deepEqual(decodeMusicConfig(response.musicConfig).karaoke.pics, pics);
  assert.ok(!Object.hasOwn(encoded, 'Vögel'));
});
test('Mehrfachauswahl legt getrennte Liedseiten mit gemeinsamen Einstellungen an', () => {
  const { karaokeSongs, decodeMusicConfig, encodeMusicConfig } = musicSettingsTools;
  const settings = musicSettings(musicPresets.find(p => p.id === 'karaoke'));
  const config = decodeMusicConfig(settings.musicConfig); config.karaoke.design = 'sea'; config.karaoke.follow = true;
  const songs = karaokeSongs.slice(0, 3);
  const pages = musicPage({ ...settings, musicConfig: encodeMusicConfig(config), musicSongs: songs.map(s => s.id) });
  assert.equal(pages.length, 3);
  for (const [i, page] of pages.entries()) {
    const saved = validatePage(page).elements[0].settings;
    assert.equal(saved.musicConfig.karaoke.title, songs[i].title);
    assert.equal(saved.musicConfig.karaoke.text, songs[i].text);
    assert.equal(saved.musicConfig.karaoke.design, 'sea'); assert.equal(saved.musicConfig.karaoke.follow, true);
    assert.equal(saved.musicSongs, undefined);
  }
  assert.equal(new Set(pages.map(p => p.id)).size, 3);
});
test('Schrittwechsel, Transposition und Hörspiellänge erhalten die relevanten Inhalte', () => {
  const { sequenceSteps, resizeStudio } = musicSettingsTools;
  const seq = { steps: 16, bpm: 100, tracks: [{ label: 'Melodie', note: 60, color: '#e03131', voice: 'xylophone', steps: Array.from({ length: 16 }, (_, i) => i % 4 === 0) }] };
  const eight = sequenceSteps(seq, 8), sixteen = sequenceSteps(eight, 16);
  assert.deepEqual(sixteen, seq);
  const transposed = musicReferenceTools.sequenceKey(seq, { scale: 'major', root: 2 });
  assert.deepEqual(transposed.tracks[0].steps, seq.tracks[0].steps); assert.notEqual(transposed.tracks[0].note, 60);
  const studio = { len: 60, boost: false, duck: true, duckLevel: 0.2, clips: [{ start: 55, dur: 5, track: 2, fx: 'bell', label: 'Glocke', vol: 1 }] };
  const shorter = resizeStudio(studio, 30); assert.equal(shorter.clips[0].start, 25); assert.equal(shorter.duckLevel, 0.2); assert.equal(studio.clips[0].start, 55);
});
test('Karaoke-LRC und Referenzbibliotheken enthalten alle Einstellungen der Quelle', () => {
  const { musicOptions } = musicSettingsTools;
  assert.equal(musicOptions.songs.length, 31); assert.equal(musicOptions.designs.length, 8); assert.equal(musicOptions.fonts.length, 7);
  assert.ok(musicOptions.meters.includes('5/4')); assert.ok(musicOptions.clicks.some(c => c.id === 'beep')); assert.ok(musicOptions.tuners.some(t => t.id === 'cello'));
  const parsed = musicReferenceTools.parseMusicLrc('[00:01.50]Vögel singen\n[00:04.00]Alle singen mit\n[00:08.00]');
  assert.equal(parsed.text, 'Vögel singen\nAlle singen mit'); assert.deepEqual(parsed.timing.marks, [[1500, 0], [4000, 1]]); assert.equal(parsed.timing.end, 8000);
  const exported = musicReferenceTools.exportMusicLrc({ text: parsed.text, timing: parsed.timing, repeat: 1, secs: 4, intro: 0 });
  assert.match(exported, /\[00:01[.,]50/); assert.match(exported, /Vögel singen/);
});
