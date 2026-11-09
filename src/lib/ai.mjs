import fs from 'node:fs/promises';
import { dataPath, readJson, withLock, writeJson } from './store.mjs';
import { BookError, id } from './notebooks.mjs';
import { learningSettings } from './learning/validation.mjs';
export async function aiConfiguration() {
  const provider = process.env.AI_PROVIDER || 'compatible',
    model = process.env.AI_MODEL || '',
    base = process.env.AI_BASE_URL || '';
  let key = '';
  if (process.env.AI_API_KEY_FILE)
    key = (await fs.readFile(process.env.AI_API_KEY_FILE, 'utf8')).trim();
  const configured = !!model && !!base && (provider === 'local' || !!key);
  return { provider, model, base, key, configured };
}
export async function aiStatus() {
  const c = await aiConfiguration();
  return { configured: c.configured, provider: c.provider, model: c.model };
}
export async function generateLearning(owner, input) {
  const c = await aiConfiguration();
  if (!c.configured)
    throw new BookError(
      'Die Schulverwaltung hat noch keinen KI-Dienst freigegeben.',
      503,
    );
  if (
    typeof input.topic !== 'string' ||
    !input.topic.trim() ||
    input.topic.length > 2000
  )
    throw new BookError('Bitte ein Thema mit höchstens 2000 Zeichen eingeben.');
  const formats = {
    words: '{"words":["Wör-ter","mit","Sil-ben"]}',
    quiz: '{"questions":[{"text":"Frage","answers":["Antwort 1","Antwort 2"],"correct":0,"explanation":"Kurze Erklärung"}]}',
    text: '{"text":"Ein kurzer, altersgerechter Text."}',
    slides:
      '{"slides":[{"title":"Folientitel","text":"Kurzer Inhalt","seconds":5}]}',
  };
  if (!formats[input.format])
    throw new BookError('Unbekanntes Aufgabenformat.');
  await withLock(`ki-${id(owner)}`, async () => {
    const file = dataPath('ki-zaehler', `${owner}.json`),
      now = Date.now(),
      record = await readJson(file, { start: now, count: 0 });
    if (now - record.start > 3600000) {
      record.start = now;
      record.count = 0;
    }
    if (record.count >= 20)
      throw new BookError(
        'Für diese Stunde wurden bereits 20 Entwürfe erstellt. Bitte später erneut versuchen.',
        429,
      );
    record.count++;
    await writeJson(file, record);
  });
  const instructions = `Du entwirfst Materialien für eine deutsche Grundschule. Gib ausschließlich JSON nach diesem Muster zurück: ${formats[input.format]}. Verwende höchstens 20 Einträge. Wörter mit korrekter deutscher Silbentrennung. Fragen müssen sachlich richtig sein; correct ist der nullbasierte Index der richtigen Antwort. Kein HTML, keine Links, keine personenbezogenen Daten.`,
    url = new URL(c.base);
  if (!['https:', 'http:'].includes(url.protocol))
    throw new BookError('Der KI-Dienst ist falsch eingerichtet.', 503);
  const openai = c.provider === 'openai',
    endpoint =
      c.base.replace(/\/$/, '') + (openai ? '/responses' : '/chat/completions');
  const body = openai
    ? {
        model: c.model,
        instructions,
        input: input.topic,
        store: false,
        max_output_tokens: 4000,
      }
    : {
        model: c.model,
        messages: [
          { role: 'system', content: instructions },
          { role: 'user', content: input.topic },
        ],
        max_tokens: 4000,
      };
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(c.key ? { Authorization: `Bearer ${c.key}` } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(45000),
    });
  } catch {
    throw new BookError(
      'Der KI-Dienst ist nicht erreichbar. Bitte später erneut versuchen.',
      502,
    );
  }
  if (!response.ok)
    throw new BookError(
      'Der KI-Dienst hat die Anfrage abgelehnt. Bitte die Konfiguration prüfen lassen.',
      502,
    );
  const content = await response.text();
  if (content.length > 200000)
    throw new BookError('Die Antwort des KI-Dienstes ist zu lang.', 502);
  let text;
  try {
    const result = JSON.parse(content);
    text = openai
      ? (result.output || [])
          .filter((item) => item.type === 'message')
          .flatMap((item) => item.content || [])
          .filter((item) => item.type === 'output_text')
          .map((item) => item.text)
          .join('\n')
      : result.choices?.[0]?.message?.content;
    const cleaned = String(text || '')
      .replace(/^```(?:json)?\s*/, '')
      .replace(/\s*```$/, '');
    const data = learningSettings(JSON.parse(cleaned));
    if (
      input.format === 'words' &&
      (!Array.isArray(data.words) ||
        data.words.some((w) => typeof w !== 'string'))
    )
      throw new Error();
    if (
      input.format === 'quiz' &&
      (!Array.isArray(data.questions) ||
        data.questions.some(
          (q) =>
            typeof q.text !== 'string' ||
            !Array.isArray(q.answers) ||
            q.answers.length < 2 ||
            !Number.isInteger(q.correct) ||
            q.correct < 0 ||
            q.correct >= q.answers.length,
        ))
    )
      throw new Error();
    if (input.format === 'text' && typeof data.text !== 'string')
      throw new Error();
    if (
      input.format === 'slides' &&
      (!Array.isArray(data.slides) ||
        data.slides.some(
          (s) => typeof s.title !== 'string' || typeof s.text !== 'string',
        ))
    )
      throw new Error();
    return data;
  } catch {
    throw new BookError(
      'Der KI-Dienst lieferte keinen verwendbaren Entwurf. Bitte Thema präzisieren und erneut versuchen.',
      502,
    );
  }
}
