// All generated assets come from our sources and explicitly installed dependencies.
import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';
import { zipSync, strToU8 } from 'fflate';
await fs.mkdir('public/runtime', { recursive: true });
await build({
  entryPoints: ['src/export/viewer.tsx'],
  bundle: true,
  minify: true,
  platform: 'browser',
  target: 'es2020',
  format: 'iife',
  outfile: 'public/runtime/viewer.js',
  jsx: 'automatic',
  legalComments: 'inline',
  define: { 'process.env.NODE_ENV': '"production"' },
});
await fs.copyFile('src/app/globals.css', 'public/runtime/viewer.css');
await fs.copyFile(
  'node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  'public/runtime/pdf.worker.min.mjs',
);
await fs.mkdir('public/runtime/pdf-fonts', { recursive: true });
await fs.cp(
  'node_modules/pdfjs-dist/standard_fonts',
  'public/runtime/pdf-fonts',
  { recursive: true },
);
// Flat Color Icons (icons8, MIT) for the toolbars; only the SVG files are served.
await fs.rm('public/runtime/icons', { recursive: true, force: true });
await fs.cp('node_modules/flat-color-icons/svg', 'public/runtime/icons', {
  recursive: true,
});
const licenses = {};
const manifest = JSON.parse(await fs.readFile('package.json', 'utf8'));
for (const name of Object.keys(manifest.dependencies)) {
  for (const file of [
    'LICENSE',
    'LICENSE.md',
    'LICENSE.txt',
    'LICENSE-MIT',
    'LICENSE-MIT.txt',
  ]) {
    try {
      licenses[name] = await fs.readFile(
        path.join('node_modules', name, file),
        'utf8',
      );
      break;
    } catch {}
  }
}
licenses.Grundschulbuch = await fs.readFile('LICENSE', 'utf8');
licenses['Herkunft und Fremdbestandteile'] = await fs.readFile('NOTICE.md', 'utf8');
for (const folder of await fs.readdir('public/fonts', {
  withFileTypes: true,
})) {
  if (!folder.isDirectory()) continue;
  try {
    licenses['Schrift ' + folder.name] = await fs.readFile(
      path.join('public/fonts', folder.name, 'OFL.txt'),
      'utf8',
    );
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

await fs.writeFile('public/runtime/licenses.json', JSON.stringify(licenses));
const entries = {};
async function collect(root) {
  const files = await fs.readdir(root, { withFileTypes: true });
  for (const file of files) {
    const name = path.join(root, file.name);
    if (
      name === 'public/runtime' ||
      name.startsWith('test-results') ||
      file.name.startsWith('.') ||
      file.isSymbolicLink()
    )
      continue;
    if (file.isDirectory()) await collect(name);
    else entries[name] = new Uint8Array(await fs.readFile(name));
  }
}
for (const dir of ['src', 'scripts', 'test', 'docs', 'public'])
  await collect(dir).catch((e) => {
    if (e.code !== 'ENOENT') throw e;
  });
for (const name of [
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tsconfig.json',
  'eslint.config.mjs',
  'playwright.config.ts',
  '.dockerignore',
  '.gitignore',
  'Dockerfile',
  'docker-compose.yml',
  'README.md',
  'PLATFORM.md',
  'LICENSE',
  'NOTICE.md',
]) {
  try {
    entries[name] = new Uint8Array(await fs.readFile(name));
  } catch {}
}
entries['DEPENDENCY-LICENSES.json'] = strToU8(
  JSON.stringify(licenses, null, 2),
);
await fs.writeFile(
  'public/runtime/quellcode.zip',
  zipSync(entries, { level: 6 }),
);
