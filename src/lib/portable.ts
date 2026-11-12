import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import { uuid } from './notebook-model';
import type { BookData, Page } from './notebook-model';
import { mediaReferences } from './learning/validation.mjs';
import { downloadBlob } from './learning/audio';
import { api, uploadImage } from './client-api';
export type PortableBook = BookData & {
  format: 'grundschulbuch';
  version: 1;
  media: Record<string, { mime: string; data: string }>;
  licenses?: Record<string, string>;
  sourceArchive?: string;
};
const escape = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
export function bytesBase64(bytes: Uint8Array) {
  let result = '';
  for (let i = 0; i < bytes.length; i += 16384)
    result += String.fromCharCode(...bytes.subarray(i, i + 16384));
  return btoa(result);
}
export function base64Bytes(text: string) {
  const raw = atob(text);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}
async function bytes(url: string) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok)
    throw new Error(
      'Eine Datei konnte nicht geladen werden. Bitte erneut anmelden und exportieren.',
    );
  return new Uint8Array(await response.arrayBuffer());
}
export async function portableBook(data: BookData): Promise<PortableBook> {
  const media: PortableBook['media'] = {};
  let total = 0;
  // Pictures shipped with the app (shop goods, coins and notes) travel along.
  const shipped = new Set<string>();
  JSON.stringify(data.pages, (_, v) => {
    if (typeof v === 'string' && /^\/(kasse|bilder|anlaut)\/[a-z0-9-]+\.webp$|^\/laute\/[a-z0-9-]+\.m4a$/.test(v)) shipped.add(v);
    return v;
  });
  for (const src of [...mediaReferences(data.pages), ...shipped]) {
    const response = await fetch(src, { cache: 'no-store' });
    if (!response.ok)
      throw new Error('Ein Medium konnte nicht gelesen werden.');
    const bytes = new Uint8Array(await response.arrayBuffer());
    total += bytes.length;
    if (total > 256 * 1024 * 1024)
      throw new Error(
        'Das Heft ist für einen einzelnen Export zu groß (256 MB).',
      );
    media[src] = {
      mime: response.headers.get('content-type') || 'application/octet-stream',
      data: bytesBase64(bytes),
    };
  }
  return { ...data, format: 'grundschulbuch', version: 1, media };
}
function mapped<T>(data: T, replace: (value: string) => string): T {
  if (typeof data === 'string') return replace(data) as T;
  if (Array.isArray(data))
    return data.map((value) => mapped(value, replace)) as T;
  if (data && typeof data === 'object')
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, mapped(value, replace)]),
    ) as T;
  return data;
}
const viewerStyle = `.standalone-print{display:none}.standalone-viewer{height:100vh;display:flex;flex-direction:column}.standalone-viewer>header,.standalone-viewer>nav{display:flex;flex-wrap:wrap;align-items:center;gap:15px;padding:12px 20px;background:#f8fbf2;flex-shrink:0}.standalone-viewer>header strong{flex:1}.standalone-page{flex:1;overflow:auto;padding:15px}.standalone-page>.paper{margin:0 auto}.standalone-viewer button,.standalone-viewer select{padding:8px;border:1px solid #b8ccb0;background:white;border-radius:6px}.viewer-info{position:fixed;inset:10%;overflow:auto;background:white;padding:25px;box-shadow:0 10px 70px #0008}.viewer-info pre{white-space:pre-wrap;font-size:11px}@media print{.standalone-viewer>header,.standalone-viewer>nav,.viewer-info,.standalone-page,.modal-backdrop{display:none}.standalone-print{display:block}.standalone-print .paper{break-after:page;margin:0;box-shadow:none}.standalone-print .paper:last-child{break-after:auto}.standalone-viewer{height:auto;display:block;padding:0;overflow:visible}}`;
async function resources() {
  const [js, css, licenses] = await Promise.all([
    fetch('/runtime/viewer.js').then((r) => r.text()),
    fetch('/runtime/viewer.css').then((r) => r.text()),
    fetch('/runtime/licenses.json').then((r) => r.json()),
  ]);
  return { js, css, licenses };
}
async function embeddedFonts(css: string, data: BookData) {
  const used = new Set([
    'Andika',
    ...data.pages.flatMap((p) =>
      p.elements.flatMap(el => [el.font, el.settings?.font].filter((font): font is string => !!font)),
    ),
  ]);
  const rules = Array.from(css.matchAll(/@font-face\s*\{[^}]+\}/g));
  let result = css;
  for (const match of rules) {
    const name = match[0].match(/font-family:\s*['"]?([^;'"}]+)/)?.[1].trim();
    if (!name || !used.has(name)) {
      result = result.replace(match[0], '');
      continue;
    }
    let rule = match[0];
    for (const found of match[0].matchAll(/url\(['"]?([^)'" ]+)['"]?\)/g)) {
      const font = await bytes(found[1]);
      rule = rule.replace(
        found[0],
        `url(data:font/ttf;base64,${bytesBase64(font)})`,
      );
    }
    result = result.replace(match[0], rule);
  }
  return result;
}
export async function exportHtml(
  data: BookData,
  scorm = false,
): Promise<string> {
  const portable = await portableBook(data),
    r = await resources();
  portable.licenses = r.licenses;
  portable.sourceArchive =
    'data:application/zip;base64,' +
    bytesBase64(await bytes('/runtime/quellcode.zip'));
  const embedded = mapped(portable, (value) =>
    portable.media[value]
      ? `data:${portable.media[value].mime};base64,${portable.media[value].data}`
      : value,
  );
  embedded.media = {};
  const css = await embeddedFonts(r.css, data);
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(data.book.title)}</title><style>${css}\n${viewerStyle}</style></head><body><div id="grundschulbuch-viewer"></div><script type="application/json" id="grundschulbuch-data">${JSON.stringify(embedded).replace(/</g, '\\u003c')}</script><script>${r.js.replace(/<\/script/gi, '<\\/script')}</script>${scorm ? '<!-- SCORM 1.2: score and completion are reported by the viewer. -->' : ''}</body></html>`;
}
export async function exportArchive(data: BookData) {
  const portable = await portableBook(data);
  const files: Record<string, Uint8Array> = {};
  const json = mapped(portable, (value) =>
    portable.media[value] ? `media/${value.split('/').pop()}` : value,
  );
  json.media = {};
  for (const [src, media] of Object.entries(portable.media))
    files[`media/${src.split('/').pop()}`] = base64Bytes(media.data);
  files['heft.json'] = strToU8(JSON.stringify(json));
  return new Blob([new Uint8Array(zipSync(files))], {
    type: 'application/zip',
  });
}
export async function exportEpub(data: BookData) {
  const portable = await portableBook(data);
  const files: Record<string, Uint8Array | [Uint8Array, { level: 0 }]> = {
    mimetype: [strToU8('application/epub+zip'), { level: 0 }],
  };
  const r = await resources();
  let css = r.css;
  const manifest: string[] = [],
    spine: string[] = [];
  const usedFonts = new Set([
    'Andika',
    ...data.pages.flatMap((p) =>
      p.elements.flatMap(el => [el.font, el.settings?.font]).filter(Boolean),
    ),
  ]);
  for (const match of Array.from(css.matchAll(/@font-face\s*\{[^}]+\}/g))) {
    const name = match[0].match(/font-family:\s*['"]?([^;'"}]+)/)?.[1].trim();
    if (!name || !usedFonts.has(name)) {
      css = css.replace(match[0], '');
      continue;
    }
    let rule = match[0];
    for (const found of match[0].matchAll(/url\(['"]?([^)'" ]+)['"]?\)/g)) {
      const basename = decodeURIComponent(found[1].split('/').pop()!),
        path = `fonts/${basename}`;
      files['OEBPS/' + path] = await bytes(found[1]);
      rule = rule.replace(found[0], `url('${path}')`);
      manifest.push(
        `<item id="font-${manifest.length}" href="${escape(path)}" media-type="font/ttf"/>`,
      );
    }
    css = css.replace(match[0], rule);
  }
  for (const [src, media] of Object.entries(portable.media)) {
    const name = 'media/' + src.split('/').pop();
    files['OEBPS/' + name] = base64Bytes(media.data);
    manifest.push(
      `<item id="media-${manifest.length}" href="${name}" media-type="${escape(media.mime)}"/>`,
    );
  }
  const remapped = mapped(portable, (value) =>
    portable.media[value] ? 'media/' + value.split('/').pop() : value,
  );
  remapped.media = {};
  files['OEBPS/heft.json'] = strToU8(
    JSON.stringify({ ...portable, media: {} }),
  );
  files['OEBPS/styles.css'] = strToU8(css + viewerStyle);
  files['OEBPS/viewer.js'] = strToU8(r.js);
  files['OEBPS/quellcode.zip'] = await bytes('/runtime/quellcode.zip');
  manifest.push(
    '<item id="source" href="quellcode.zip" media-type="application/zip"/><item id="bookdata" href="heft.json" media-type="application/json"/>',
  );
  for (let i = 0; i < data.pages.length; i++) {
    const page = data.pages[i];
    const snapshot = await pageSnapshot(page);
    let markup = snapshot.markup;
    for (const src of Object.keys(portable.media))
      markup = markup.split(src).join('media/' + src.split('/').pop());
    const book = {
      ...remapped,
      pages: [remapped.pages[i]],
      licenses: r.licenses,
      sourceArchive: 'quellcode.zip',
    };
    const w = page.orientation === 'landscape' ? 1123 : 794,
      h = page.orientation === 'landscape' ? 794 : 1123;
    const name = `page-${i + 1}.xhtml`;
    files['OEBPS/' + name] = strToU8(
      `<?xml version="1.0" encoding="utf-8"?><html xmlns="http://www.w3.org/1999/xhtml" lang="de"><head><title>${escape(data.book.title)} · ${i + 1}</title><meta name="viewport" content="width=${w},height=${h}"/><link rel="stylesheet" href="styles.css"/></head><body><div id="grundschulbuch-viewer">${markup}</div><script id="grundschulbuch-data" type="application/json">${JSON.stringify(book).replace(/&/g, '&amp;').replace(/</g, '\\u003c')}</script><script src="viewer.js"></script></body></html>`,
    );
    manifest.push(
      `<item id="page-${i + 1}" href="${name}" media-type="application/xhtml+xml" properties="scripted"/>`,
    );
    spine.push(`<itemref idref="page-${i + 1}"/>`);
  }
  files['META-INF/container.xml'] = strToU8(
    '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
  );
  files['OEBPS/nav.xhtml'] = strToU8(
    `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Inhalt</title></head><body><nav epub:type="toc"><ol>${data.pages.map((_, i) => `<li><a href="page-${i + 1}.xhtml">Seite ${i + 1}</a></li>`).join('')}</ol></nav></body></html>`,
  );
  files['OEBPS/content.opf'] = strToU8(
    `<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">urn:uuid:${data.book.id}</dc:identifier><dc:title>${escape(data.book.title)}</dc:title><dc:language>de</dc:language><meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta><meta property="rendition:layout">pre-paginated</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="styles.css" media-type="text/css"/><item id="js" href="viewer.js" media-type="text/javascript"/>${manifest.join('')}</manifest><spine>${spine.join('')}</spine></package>`,
  );
  return new Blob([new Uint8Array(zipSync(files))], {
    type: 'application/epub+zip',
  });
}
export async function exportScorm(data: BookData) {
  const html = await exportHtml(data, true);
  return new Blob(
    [
      new Uint8Array(
        zipSync({
          'imsmanifest.xml': strToU8(
            `<?xml version="1.0"?><manifest identifier="gsb-${data.book.id}" version="1.2" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"><metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata><organizations default="org"><organization identifier="org"><title>${escape(data.book.title)}</title><item identifier="item" identifierref="resource"><title>${escape(data.book.title)}</title></item></organization></organizations><resources><resource identifier="resource" type="webcontent" adlcp:scormtype="sco" href="index.html"><file href="index.html"/></resource></resources></manifest>`,
          ),
          'index.html': strToU8(html),
        }),
      ),
    ],
    { type: 'application/zip' },
  );
}
function safeZip(bytes: Uint8Array) {
  let total = 0,
    rejected = false;
  const data = unzipSync(bytes, {
    filter: (entry) => {
      total += entry.originalSize;
      const safe =
        entry.originalSize <= 40 * 1024 * 1024 &&
        total <= 256 * 1024 * 1024 &&
        !entry.name.split('/').includes('..');
      if (!safe) rejected = true;
      return safe;
    },
  });
  if (rejected)
    throw new Error('Das Archiv enthält zu große oder ungültige Einträge.');
  return data;
}
export async function importPortable(file: File): Promise<BookData> {
  if (file.size > 100 * 1024 * 1024)
    throw new Error('Die Datei darf höchstens 100 MB groß sein.');
  const raw = new Uint8Array(await file.arrayBuffer());
  let data: PortableBook,
    files: Record<string, Uint8Array> = {};
  if (raw[0] === 80 && raw[1] === 75) {
    files = safeZip(raw);
    const meta = files['heft.json'] || files['OEBPS/heft.json'];
    if (!meta)
      throw new Error(
        'Dieses ePub/Archiv enthält keine bearbeitbaren Grundschulbuch-Daten.',
      );
    data = JSON.parse(strFromU8(meta));
  } else if (file.name.toLowerCase().endsWith('.html')) {
    const match = strFromU8(raw).match(
      /<script\b(?=[^>]*\bid=["']grundschulbuch-data["'])[^>]*>([\s\S]*?)<\/script\s*>/i,
    );
    if (!match)
      throw new Error('Diese HTML-Datei enthält keine Grundschulbuch-Daten.');
    data = JSON.parse(match[1]);
  } else data = JSON.parse(strFromU8(raw));
  if (
    data?.format !== 'grundschulbuch' ||
    data.version !== 1 ||
    !Array.isArray(data.pages) ||
    !data.pages.length ||
    data.pages.length > 300
  )
    throw new Error('Keine unterstützte Grundschulbuch-Datei.');
  const mapping: Record<string, string> = {};
  const references = new Set<string>();
  const collect = (value: unknown) => {
    if (
      typeof value === 'string' &&
      (value.startsWith('data:image/') ||
        value.startsWith('data:audio/') ||
        value.startsWith('data:text/plain') ||
        value.startsWith('media/') ||
        value.startsWith('/api/medien/'))
    )
      references.add(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object')
      Object.values(value).forEach(collect);
  };
  collect(data.pages);
  for (const src of references) {
    let mediaBytes: Uint8Array, mime: string;
    if (src.startsWith('data:')) {
      const match = src.match(
        /^data:([^;]+)(?:;\s*charset=[^;,]+)?;base64,(.*)$/s,
      );
      if (!match) throw new Error('Ein Medium ist ungültig.');
      mediaBytes = base64Bytes(match[2]);
      mime = match[1];
    } else if (data.media?.[src]) {
      mediaBytes = base64Bytes(data.media[src].data);
      mime = data.media[src].mime;
    } else {
      const key = files[src] ? src : 'OEBPS/' + src;
      if (!files[key]) {
        const basename = src.split('/').pop()!;
        if (files['OEBPS/media/' + basename]) {
          mediaBytes = files['OEBPS/media/' + basename];
          mime = basename.endsWith('.apphtml')
            ? 'text/plain'
            : /\.(mp3|wav|ogg|m4a|webm)$/.test(basename)
              ? 'audio/*'
              : 'image/*';
        } else throw new Error('In dieser Datei fehlt ein Medium.');
      } else {
        mediaBytes = files[key];
        mime = key.endsWith('.apphtml')
          ? 'text/plain'
          : /\.(mp3|wav|ogg|m4a|webm)$/.test(key)
            ? 'audio/*'
            : 'image/*';
      }
    }
    const blob = new File(
      [new Uint8Array(mediaBytes)],
      'import.' + (mime.startsWith('audio') ? 'wav' : 'png'),
      { type: mime },
    );
    if (mime.startsWith('image')) mapping[src] = await uploadImage(blob);
    else {
      const response = await fetch(
        mime.startsWith('text/plain') ? '/api/apps' : '/api/ton',
        { method: 'POST', body: blob },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      mapping[src] = result.src;
    }
  }
  const pages = mapped(data.pages, (value) => mapping[value] || value);
  return api<BookData>('create', {
    title: data.book?.title || file.name,
    color: data.book?.color,
    pages,
  });
}
export async function importPdf(
  file: File,
  onProgress: (message: string) => void,
): Promise<BookData> {
  if (file.size > 50 * 1024 * 1024)
    throw new Error('PDF-Dateien dürfen höchstens 50 MB groß sein.');
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = '/runtime/pdf.worker.min.mjs';
  const pdf = await pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    isEvalSupported: false,
    standardFontDataUrl: '/runtime/pdf-fonts/',
  }).promise;
  if (pdf.numPages > 100)
    throw new Error('Bitte höchstens 100 PDF-Seiten auf einmal importieren.');
  const pages: Page[] = [];
  try {
    for (let i = 1; i <= pdf.numPages; i++) {
      onProgress(`PDF-Seite ${i} von ${pdf.numPages}`);
      const source = await pdf.getPage(i),
        viewport = source.getViewport({ scale: 1.5 }),
        canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await source.render({
        canvas,
        canvasContext: canvas.getContext('2d')!,
        viewport,
      }).promise;
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (blob) =>
            blob
              ? resolve(blob)
              : reject(new Error('PDF-Seite konnte nicht gerendert werden.')),
          'image/png',
        ),
      );
      const src = await uploadImage(
        new File([blob], `seite-${i}.png`, { type: 'image/png' }),
      );
      const landscape = viewport.width > viewport.height;
      pages.push({
        id: uuid(),
        revision: 0,
        orientation: landscape ? 'landscape' : 'portrait',
        ruling: 'blanko',
        elements: [
          {
            id: uuid(),
            type: 'image',
            x: 0,
            y: 0,
            width: landscape ? 297 : 210,
            height: landscape ? 210 : 297,
            rotation: 0,
            locked: true,
            color: '#253c42',
            src,
            alt: `PDF-Seite ${i}`,
          },
        ],
      });
      source.cleanup();
    }
  } finally {
    await pdf.destroy();
  }
  return api<BookData>('create', {
    title: file.name.replace(/\.pdf$/i, ''),
    pages,
  });
}
export function saveDownload(blob: Blob, title: string, extension: string) {
  downloadBlob(blob, title.replace(/[\\/:*?"<>|]/g, '-') + '.' + extension);
}

export async function pageSnapshot(
  page: Page,
): Promise<{ png: string; markup: string }> {
  const React = await import('react'),
    { createRoot } = await import('react-dom/client'),
    { flushSync } = await import('react-dom'),
    { default: PageView } = await import('../components/PageView'),
    { toPng } = await import('html-to-image');
  const host = document.createElement('div');
  host.style.cssText =
    'position:fixed;left:-20000px;top:0;pointer-events:none;';
  document.body.append(host);
  const root = createRoot(host);
  try {
    flushSync(() => root.render(React.createElement(PageView, { page })));
    await document.fonts.ready;
    await Promise.all(
      Array.from(host.querySelectorAll('img')).map((image) =>
        image.decode().catch(() => undefined),
      ),
    );
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    const paper = host.firstElementChild as HTMLElement;
    for (const input of Array.from(paper.querySelectorAll('input')))
      input.setAttribute('value', input.value);
    const markup = new XMLSerializer().serializeToString(paper);
    const png = await toPng(paper, {
      pixelRatio: 2,
      backgroundColor: page.paperColor || '#ffffff',
      cacheBust: false,
      filter: (node) =>
        !(
          node instanceof HTMLIFrameElement ||
          node instanceof HTMLAudioElement ||
          node instanceof HTMLVideoElement
        ),
    });
    return { png, markup };
  } finally {
    root.unmount();
    host.remove();
  }
}
export async function exportPdf(
  data: BookData,
  onProgress: (message: string) => void,
): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  pdf.setTitle(data.book.title);
  pdf.setCreator('Grundschulbuch');
  for (let i = 0; i < data.pages.length; i++) {
    onProgress(`PDF-Seite ${i + 1} von ${data.pages.length}`);
    const page = data.pages[i],
      snapshot = await pageSnapshot(page),
      image = await pdf.embedPng(snapshot.png),
      width = ((page.orientation === 'landscape' ? 297 : 210) * 72) / 25.4,
      height = ((page.orientation === 'landscape' ? 210 : 297) * 72) / 25.4;
    pdf
      .addPage([width, height])
      .drawImage(image, { x: 0, y: 0, width, height });
  }
  return new Blob([new Uint8Array(await pdf.save())], {
    type: 'application/pdf',
  });
}

export async function exportBackup(onProgress: (message: string) => void) {
  const books = await api<import('./notebook-model').BookSummary[]>('list'),
    files: Record<string, Uint8Array> = {};
  for (let i = 0; i < books.length; i++) {
    onProgress(`Heft ${i + 1} von ${books.length} sichern`);
    const data = await api<BookData>('open', { id: books[i].id });
    files[`hefte/${books[i].id}.grundschulbuch`] = new Uint8Array(
      await (await exportArchive(data)).arrayBuffer(),
    );
  }
  const [folders, templates, assets] = await Promise.all([
    api('folders'),
    api<import('./notebook-model').Template[]>('templates'),
    api<import('./notebook-model').Template[]>('assets'),
  ]);
  const personal = templates.filter((t) => !t.school),
    library = [...personal, ...assets];
  for (let at = 0; at < library.length; at += 100) {
    const pages = library.slice(at, at + 100).map((t) => t.page);
    files[`bibliothek/${at}.grundschulbuch`] = new Uint8Array(
      await (
        await exportArchive({
          book: {
            id: uuid(),
            ownerId: '',
            ownerRole: 'lehrkraft',
            title: 'Bibliothek wiederherstellen',
            color: '#52796f',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            revision: 0,
            pageIds: pages.map((p) => p.id),
            classId: null,
            sourceId: null,
            allowChildPages: false,
          },
          pages,
        })
      ).arrayBuffer(),
    );
  }
  files['sicherung.json'] = strToU8(
    JSON.stringify({
      format: 'grundschulbuch-backup',
      version: 1,
      folders,
      templates: personal,
      assets,
      books: books.map((b) => ({ id: b.id, folderId: b.folderId })),
    }),
  );
  return new Blob([new Uint8Array(zipSync(files))], {
    type: 'application/zip',
  });
}
export async function importBackup(
  file: File,
  onProgress: (message: string) => void,
) {
  const files = safeZip(new Uint8Array(await file.arrayBuffer()));
  if (!files['sicherung.json'])
    throw new Error('Keine Grundschulbuch-Sicherung.');
  const metadata = JSON.parse(strFromU8(files['sicherung.json']));
  if (metadata.format !== 'grundschulbuch-backup')
    throw new Error('Unbekannte Sicherung.');
  const folderMap: Record<string, string> = {};
  for (const folder of metadata.folders || []) {
    const created = await api<{ id: string }>('folder', {
      title: folder.title,
      color: folder.color,
    });
    folderMap[folder.id] = created.id;
  }
  const names = Object.keys(files).filter(
    (name) => name.startsWith('hefte/') && name.endsWith('.grundschulbuch'),
  );
  for (let i = 0; i < names.length; i++) {
    onProgress(`Heft ${i + 1} von ${names.length} wiederherstellen`);
    const result = await importPortable(
      new File([new Uint8Array(files[names[i]])], names[i], {
        type: 'application/zip',
      }),
    );
    const old = metadata.books?.find((b: { id: string }) =>
      names[i].includes(b.id),
    );
    if (old?.folderId && folderMap[old.folderId])
      await api('update', {
        id: result.book.id,
        revision: result.book.revision,
        folderId: folderMap[old.folderId],
      });
  }
  const libraryPages: Page[] = [];
  for (const name of Object.keys(files)
    .filter((name) => name.startsWith('bibliothek/'))
    .sort(
      (a, b) =>
        Number(a.split('/')[1].split('.')[0]) -
        Number(b.split('/')[1].split('.')[0]),
    )) {
    const imported = await importPortable(
      new File([new Uint8Array(files[name])], name, {
        type: 'application/zip',
      }),
    );
    libraryPages.push(...imported.pages);
    await api('delete', { id: imported.book.id });
  }
  let index = 0;
  for (const template of metadata.templates || []) {
    const page = libraryPages[index++] || template.page;
    await api('template', { title: template.title, page });
  }
  for (const asset of metadata.assets || []) {
    const page = libraryPages[index++] || asset.page;
    await api('asset', { title: asset.title, page });
  }
  return names.length;
}
