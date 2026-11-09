import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
const directory = await fs.mkdtemp(
  path.join(os.tmpdir(), 'grundschulbuch-ki-'),
);
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.AI_API_KEY_FILE = path.join(directory, 'test-key');
await fs.writeFile(process.env.AI_API_KEY_FILE, 'test-key-no-real-credential');
let requested,
  answer = { words: ['Son-ne', 'Re-gen'] };
const server = http.createServer(async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  requested = {
    path: req.url,
    authorization: req.headers.authorization,
    body: JSON.parse(body),
  };
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify(
      req.url.endsWith('/responses')
        ? {
            output: [
              {
                type: 'message',
                content: [
                  { type: 'output_text', text: JSON.stringify(answer) },
                ],
              },
            ],
          }
        : { choices: [{ message: { content: JSON.stringify(answer) } }] },
    ),
  );
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
process.env.AI_BASE_URL = `http://127.0.0.1:${server.address().port}/v1`;
process.env.AI_MODEL = 'fixture-model';
const { generateLearning, aiStatus } = await import('../src/lib/ai.mjs');
after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await fs.rm(directory, { recursive: true, force: true });
});
test('KI-Adapter verwendet Responses ohne Speicherung und gibt keine Zugangsdaten an den Browser', async () => {
  process.env.AI_PROVIDER = 'openai';
  assert.deepEqual(await aiStatus(), {
    configured: true,
    provider: 'openai',
    model: 'fixture-model',
  });
  assert.deepEqual(
    await generateLearning(crypto.randomUUID(), {
      topic: 'Wörter zum Wetter',
      format: 'words',
    }),
    answer,
  );
  assert.equal(requested.path, '/v1/responses');
  assert.equal(requested.body.store, false);
  assert.equal(requested.body.input, 'Wörter zum Wetter');
  assert.equal(requested.authorization, 'Bearer test-key-no-real-credential');
});
test('Lokaler kompatibler Adapter prüft die Struktur von Quizantworten und begrenzt Anfragen', async () => {
  process.env.AI_PROVIDER = 'local';
  const owner = crypto.randomUUID();
  answer = {
    questions: [{ text: 'Frage', answers: ['eins', 'zwei'], correct: 9 }],
  };
  await assert.rejects(
    generateLearning(owner, { topic: 'Rechnen', format: 'quiz' }),
    (e) => e.status === 502,
  );
  answer = { words: ['Re-gen'] };
  for (let i = 1; i < 20; i++)
    await generateLearning(owner, { topic: 'Wetter', format: 'words' });
  await assert.rejects(
    generateLearning(owner, { topic: 'Wetter', format: 'words' }),
    (e) => e.status === 429,
  );
  assert.equal(requested.path, '/v1/chat/completions');
  assert.equal(requested.body.messages[1].content, 'Wetter');
});
