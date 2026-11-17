// The Erklärbär of Textsachen (Lernsachen.blog, CC BY-NC-SA 4.0): sentences
// and scenes of a text, computed exactly like the player does it
// (reference/textsachen-player.ts), so that the own recordings fit the
// sentences of the film and the editor can show the scenes.
import { lower, type TsConfig } from './textsachen';

type Token = { kind: 'word' | 'space' | 'punct' | 'break'; text: string; si: number; wi: number };
export type ExplainSentence = { text: string; key: string; words: string[] };
export type ExplainScene = { sentences: ExplainSentence[]; pictures: { word: string; image: string }[] };

const WORD = /[\p{L}\p{N}]+(?:['’\-‐][\p{L}\p{N}]+)*/uy;
const END = /[.!?…]/;
const CLOSE = /["“”»«'’)\]]/;

/** The tokenizer of the player: words, spaces, punctuation and line breaks with their sentence. */
function tokenize(text: string) {
  const t = text.replace(/\r\n?/g, '\n').replace(/[ \t\f\v ]+/g, ' ').trim();
  const tokens: Token[] = [], words: Token[] = [];
  let si = 0, inSentence = false, ended = false, pos = 0;
  const add = (kind: Token['kind'], text: string, wi = -1) => { const token = { kind, text, si, wi }; tokens.push(token); return token; };
  while (pos < t.length) {
    const ch = t[pos];
    if (ch === '\n') {
      let end = pos;
      while (end < t.length && (t[end] === '\n' || t[end] === ' ')) end++;
      const lines = t.slice(pos, end).split('\n').length - 1;
      if (inSentence) { si++; inSentence = false; }
      ended = false;
      add('break', lines > 1 ? '\n\n' : '\n');
      pos = end;
      continue;
    }
    if (ch === ' ') {
      if (ended && inSentence) { si++; inSentence = false; }
      ended = false;
      add('space', ' ');
      pos++;
      continue;
    }
    WORD.lastIndex = pos;
    const m = WORD.exec(t);
    if (m) {
      if (ended && inSentence) { si++; inSentence = false; }
      ended = false;
      words.push(add('word', m[0], words.length));
      inSentence = true;
      pos += m[0].length;
      continue;
    }
    const next = ch === '.' && t.startsWith('...', pos) ? pos + 3 : pos + 1;
    add('punct', t.slice(pos, next));
    if (END.test(ch)) ended = true;
    else if (!CLOSE.test(ch)) ended = false;
    pos = next;
  }
  const sentences: { tokens: Token[] }[] = [];
  for (const token of tokens) {
    if (token.kind === 'break') continue;
    (sentences[token.si] ??= { tokens: [] }).tokens.push(token);
  }
  return { tokens, sentences: sentences.filter(Boolean), words };
}

/** The key of a sentence under which the player looks for its recording. */
export const sentenceKey = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/** The sentences of the film, in order, each with its key. */
export function explainSentences(text: string): ExplainSentence[] {
  return tokenize(text).sentences.map((s) => ({
    text: s.tokens.map((t) => (t.kind === 'break' ? ' ' : t.text)).join('').replace(/\s+/g, ' ').trim(),
    words: s.tokens.filter((t) => t.kind === 'word').map((t) => t.text),
  })).filter((s) => s.text).map((s) => ({ ...s, key: sentenceKey(s.text) }));
}

/** The scenes of the film: a blank line starts one; at most 6 pictures per sheet; with
 *  „automatisch“ also after 3 pictures (or 3 sentences, if the text has no pictures). */
export function explainScenes(c: TsConfig): ExplainScene[] {
  const { tokens, sentences } = tokenize(c.text);
  const pictureOf = (word: string) => c.pictures.find((p) => p.word === lower(word))?.image;
  const anyPicture = tokens.some((t) => t.kind === 'word' && pictureOf(t.text));
  const blank = new Set(tokens.filter((t) => t.kind === 'break' && t.text === '\n\n').map((t) => t.si));
  const scenes: ExplainScene[] = [];
  let scene: ExplainScene = { sentences: [], pictures: [] };
  const flush = () => { if (scene.sentences.length) { scenes.push(scene); scene = { sentences: [], pictures: [] }; } };
  for (const s of sentences) {
    const text = s.tokens.map((t) => (t.kind === 'break' ? ' ' : t.text)).join('').replace(/\s+/g, ' ').trimEnd();
    if (!text.trim()) continue;
    if (blank.has(s.tokens[0]?.si ?? -1)) flush();
    const words = s.tokens.filter((t) => t.kind === 'word').map((t) => t.text);
    // Like the player: one picture per picture word (its own asset), whatever file it shows.
    const has = (word: string) => scene.pictures.some((p) => lower(p.word) === lower(word));
    const fresh = new Set(words.filter((w) => pictureOf(w) && !has(w)).map(lower));
    if (scene.pictures.length && scene.pictures.length + fresh.size > 6) flush();
    scene.sentences.push({ text: text.trim(), key: sentenceKey(text), words });
    for (const word of words) {
      const image = pictureOf(word);
      if (image && scene.pictures.length < 8 && !has(word)) scene.pictures.push({ word, image });
    }
    if (scene.pictures.length >= 6 || (c.settings.explain.autoScenes && (anyPicture ? scene.pictures.length >= 3 : scene.sentences.length >= 3))) flush();
  }
  flush();
  return scenes;
}
