import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import {
  WIDGET_KINDS,
  ACTIVITY_KINDS,
  SHAPES,
  PAGE_FRAMES,
  learningSettings,
  widgetSettings,
  learningResponse,
  mediaReferences,
  safeWebUrl,
  lockedDesign,
} from './learning/validation.mjs';
import { dataPath, readJson, writeJson, withLock } from './store.mjs';

export class BookError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
const UUID =
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const COLORS = /^#[a-fA-F0-9]{6}$/;
const RULINGS = [
  'blanko',
  'linie1',
  'linie2',
  'linie3',
  'linie4',
  'karo5',
  'karo10',
  'rechnen',
  'punkte',
  'noten',
  'bildzeilen',
];
const FONTS = [
  'Andika',
  'Playwrite DE Grund',
  'Playwrite DE VA',
  'Playwrite DE SAS',
  'Lexend',
  'Nunito',
  'Atkinson Hyperlegible',
  'Merriweather',
  'Caveat',
  'Bangers',
];
export function id(value) {
  if (typeof value !== 'string' || !UUID.test(value))
    throw new BookError('Ungültige Kennung.');
  return value;
}
function title(value) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 120)
    throw new BookError(
      'Bitte einen Namen mit höchstens 120 Zeichen eingeben.',
    );
  return value.trim();
}
function num(value, min, max) {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  )
    throw new BookError('Ungültige Seitenkoordinaten.');
  return value;
}
function color(value) {
  if (!COLORS.test(value)) throw new BookError('Ungültige Farbe.');
  return value;
}
export function validatePage(input) {
  if (
    !input ||
    !['portrait', 'landscape'].includes(input.orientation) ||
    !RULINGS.includes(input.ruling) ||
    !Array.isArray(input.elements) ||
    input.elements.length > 2000
  )
    throw new BookError('Ungültige Seite.');
  const seen = new Set();
  let count = 0;
  const elements = input.elements.map((el) => {
    id(el.id);
    if (seen.has(el.id)) throw new BookError('Doppelte Elementkennung.');
    seen.add(el.id);
    if (
      ![
        'text',
        'image',
        'stroke',
        'audio',
        'shape',
        'sticker',
        'widget',
        'activity',
        'embed',
      ].includes(el.type) ||
      typeof el.locked !== 'boolean'
    )
      throw new BookError('Ungültiges Element.');
    const result = {
      id: el.id,
      type: el.type,
      x: num(el.x, -297, 594),
      y: num(el.y, -297, 594),
      width: num(el.width, 0.1, 594),
      height: num(el.height, 0.1, 594),
      rotation: num(el.rotation, -360, 360),
      locked: el.locked,
      color: color(el.color),
    };
    if (el.groupId !== undefined) result.groupId = id(el.groupId);
    if (el.opacity !== undefined) result.opacity = num(el.opacity, 0.01, 1);
    if (el.type === 'text') {
      if (
        typeof el.text !== 'string' ||
        el.text.length > 20000 ||
        !FONTS.includes(el.font)
      )
        throw new BookError('Ungültiger Text.');
      Object.assign(result, {
        text: el.text,
        font: el.font,
        fontSize: num(el.fontSize, 6, 150),
        bold: !!el.bold,
      });
      if (el.italic !== undefined) result.italic = !!el.italic;
      if (el.underline !== undefined) result.underline = !!el.underline;
      if (el.align !== undefined) {
        if (!['left', 'center', 'right', 'justify'].includes(el.align))
          throw new BookError('Ungültige Textausrichtung.');
        result.align = el.align;
      }
      if (el.lineHeight !== undefined)
        result.lineHeight = num(el.lineHeight, 0.8, 3);
      if (el.background !== undefined) result.background = color(el.background);
      if (el.textFrame !== undefined) {
        if (
          ![
            'none',
            'box',
            'note',
            'speech',
            'thought',
            'shout',
            'banner',
          ].includes(el.textFrame)
        )
          throw new BookError('Ungültiger Textrahmen.');
        result.textFrame = el.textFrame;
      }
      if (el.runs !== undefined) {
        if (
          !Array.isArray(el.runs) ||
          el.runs.length > 2000 ||
          el.runs.reduce(
            (n, r) => n + (typeof r.text === 'string' ? r.text.length : 20001),
            0,
          ) > 20000
        )
          throw new BookError('Ungültige Textabschnitte.');
        result.runs = el.runs.map((r) => ({
          text: r.text,
          bold: !!r.bold,
          italic: !!r.italic,
          underline: !!r.underline,
          ...(r.color ? { color: color(r.color) } : {}),
        }));
        result.text = result.runs.map((r) => r.text).join('');
      }
    } else if (el.type === 'image' || el.type === 'audio') {
      if (
        typeof el.src !== 'string' ||
        !/^\/api\/medien\/[a-f0-9]{64}\.(png|jpg|webp|mp3|wav|ogg|webm|m4a|apphtml)$/.test(
          el.src,
        )
      )
        throw new BookError('Nur Bilder aus dem Medienspeicher sind erlaubt.');
      Object.assign(result, {
        src: el.src,
        alt: typeof el.alt === 'string' ? el.alt.slice(0, 300) : '',
      });
      if (el.type === 'image') {
        if (el.crop !== undefined) {
          const c = el.crop;
          result.crop = {
            x: num(c.x, 0, 1),
            y: num(c.y, 0, 1),
            width: num(c.width, 0.02, 1),
            height: num(c.height, 0.02, 1),
          };
          if (c.x + c.width > 1.001 || c.y + c.height > 1.001)
            throw new BookError('Der Ausschnitt liegt außerhalb des Bildes.');
        }
        if (el.imageFilter !== undefined) {
          if (
            ![
              'none',
              'scan',
              'gray',
              'sepia',
              'bright',
              'contrast',
              'vivid',
              'pale',
              'warm',
              'cold',
              'invert',
            ].includes(el.imageFilter)
          )
            throw new BookError('Ungültiger Bildfilter.');
          result.imageFilter = el.imageFilter;
        }
        if (el.imageFrame !== undefined) {
          if (
            ![
              'none',
              'photo',
              'polaroid',
              'border',
              'round',
              'shadow',
            ].includes(el.imageFrame)
          )
            throw new BookError('Ungültiger Bildrahmen.');
          result.imageFrame = el.imageFrame;
        }
        if (el.flip !== undefined) result.flip = !!el.flip;
        if (el.fit !== undefined) {
          if (!['contain', 'cover'].includes(el.fit))
            throw new BookError('Ungültige Bildgröße.');
          result.fit = el.fit;
        }
      }
    } else if (el.type === 'shape' || el.type === 'sticker') {
      if (el.type === 'shape' && !SHAPES.includes(el.shape))
        throw new BookError('Ungültige Form.');
      if (
        el.type === 'sticker' &&
        (typeof el.symbol !== 'string' ||
          el.symbol.length > 24 ||
          !el.symbol.trim())
      )
        throw new BookError('Ungültiger Sticker.');
      if (el.shape) result.shape = el.shape;
      if (el.symbol) result.symbol = el.symbol;
      result.fill = el.fill ? color(el.fill) : '#ffffff';
      result.strokeWidth = num(el.strokeWidth ?? 0.4, 0, 10);
    } else if (el.type === 'widget' || el.type === 'activity') {
      const kind = el.type === 'widget' ? el.widgetKind : el.activityKind;
      if (
        !(el.type === 'widget' ? WIDGET_KINDS : ACTIVITY_KINDS).includes(kind)
      )
        throw new BookError('Unbekanntes Lernwerkzeug.');
      result[el.type === 'widget' ? 'widgetKind' : 'activityKind'] = kind;
      try {
        result.settings = widgetSettings(el.settings);
        if (el.response !== undefined)
          result.response = learningResponse(el.response);
      } catch (e) {
        throw new BookError(e.message);
      }
    } else if (el.type === 'embed') {
      if (!['video', 'webpage', 'link', 'qr', 'app'].includes(el.embedKind))
        throw new BookError('Ungültige Einbettung.');
      if (el.embedKind === 'app') {
        if (
          typeof el.src !== 'string' ||
          !/^\/api\/medien\/[a-f0-9]{64}\.apphtml$/.test(el.src)
        )
          throw new BookError('Ungültige HTML-App.');
        result.src = el.src;
      } else {
        try {
          result.url = safeWebUrl(el.url);
        } catch (e) {
          throw new BookError(e.message);
        }
      }
      result.embedKind = el.embedKind;
      result.alt = typeof el.alt === 'string' ? el.alt.slice(0, 300) : '';
    } else {
      if (
        !Array.isArray(el.points) ||
        el.points.length < 1 ||
        el.points.length > 20000 ||
        (count += el.points.length) > 150000
      )
        throw new BookError('Zu viele Zeichenpunkte.');
      Object.assign(result, {
        points: el.points.map((p) => {
          const result = { x: num(p.x, -594, 594), y: num(p.y, -594, 594), pressure: num(p.pressure, 0, 1) };
          for (const key of ['time', 'tiltX', 'tiltY']) {
            if (p[key] !== undefined) result[key] = num(p[key], key === 'time' ? 0 : -90, key === 'time' ? Number.MAX_SAFE_INTEGER : 90);
          }
          return result;
        }),
        penWidth: num(el.penWidth, 0.1, 40),
        opacity: num(el.opacity, 0.01, 1),
        ...(el.penStyle &&
        ['pen', 'fountain', 'crayon', 'marker', 'water'].includes(el.penStyle)
          ? { penStyle: el.penStyle }
          : {}),
        ...(el.fill ? { fill: color(el.fill) } : {}),
      });
      if (el.fillOnly !== undefined) {
        if (el.fillOnly !== true || !el.fill || el.points.length < 4) throw new BookError('Ungültige Füllfläche.');
        result.fillOnly = true;
      }
      if (el.brushVersion !== undefined) {
        if (el.brushVersion !== 2) throw new BookError('Ungültige Pinselversion.');
        result.brushVersion = 2;
      }
      if (el.nibHand !== undefined) {
        if (!['left', 'right'].includes(el.nibHand)) throw new BookError('Ungültige Schreibhand.');
        result.nibHand = el.nibHand;
      }
      if (el.simulatePressure !== undefined) {
        if (typeof el.simulatePressure !== 'boolean') throw new BookError('Ungültige Stifteingabe.');
        result.simulatePressure = el.simulatePressure;
      }
      if (el.geometry !== undefined) {
        if (!['line', 'ellipse', 'triangle', 'rectangle', 'arrow', 'star', 'heart'].includes(el.geometry)) throw new BookError('Ungültige erkannte Form.');
        result.geometry = el.geometry;
      }
      if (el.erasures !== undefined) {
        if (!Array.isArray(el.erasures) || el.erasures.length > 256)
          throw new BookError('Zu viele Radierwege.');
        const ids = new Set();
        result.erasures = el.erasures.map((erasure) => {
          if (!erasure || !Array.isArray(erasure.points) || !erasure.points.length ||
              erasure.points.length > 20000 || (count += erasure.points.length) > 150000 ||
              typeof erasure.soft !== 'boolean') throw new BookError('Ungültiger Radierweg.');
          const key = id(erasure.id);
          if (ids.has(key)) throw new BookError('Doppelter Radierweg.');
          ids.add(key);
          if (erasure.tip !== undefined && !['round', 'square', 'slant'].includes(erasure.tip))
            throw new BookError('Ungültige Radierform.');
          return {
            id: key, size: num(erasure.size, 0.1, 40), opacity: num(erasure.opacity, 0.05, 1),
            soft: erasure.soft, width: num(erasure.width, 0.1, 594), height: num(erasure.height, 0.1, 594),
            ...(erasure.tip !== undefined ? { tip: erasure.tip } : {}),
            points: erasure.points.map(p => {
              if (!p || typeof p !== 'object') throw new BookError('Ungültiger Radierpunkt.');
              return { x: num(p.x, -1500, 1500), y: num(p.y, -1500, 1500) };
            }),
          };
        });
      }
    }
    return result;
  });
  const result = {
    id: id(input.id),
    revision: num(input.revision, 0, Number.MAX_SAFE_INTEGER),
    orientation: input.orientation,
    ruling: input.ruling,
    elements,
  };
  for (const name of ['paperColor', 'lineColor', 'frameColor'])
    if (input[name] !== undefined) result[name] = color(input[name]);
  if (input.pageFrame !== undefined) {
    if (!PAGE_FRAMES.includes(input.pageFrame))
      throw new BookError('Ungültiger Seitenrahmen.');
    result.pageFrame = input.pageFrame;
  }
  if (input.backgroundImage !== undefined) {
    if (
      typeof input.backgroundImage !== 'string' ||
      !/^\/api\/medien\/[a-f0-9]{64}\.(png|jpg|webp)$/.test(
        input.backgroundImage,
      )
    )
      throw new BookError('Ungültiges Hintergrundbild.');
    result.backgroundImage = input.backgroundImage;
  }
  return result;
}
const bookPath = (bookId) => dataPath('hefte', id(bookId), 'heft.json');
const pagePath = (bookId, pageId) =>
  dataPath('hefte', id(bookId), 'seiten', `${id(pageId)}.json`);
async function owned(owner, bookId) {
  const book = await readJson(bookPath(bookId), null);
  if (!book || book.ownerId !== owner)
    throw new BookError('Heft nicht gefunden.', 404);
  return book;
}
export async function getBook(owner, bookId) {
  return withLock(`heft-${id(bookId)}`, async () => {
    const book = await owned(owner, bookId);
    return {
      book,
      pages: await Promise.all(
        book.pageIds.map((pageId) => readJson(pagePath(bookId, pageId))),
      ),
    };
  });
}
export async function listBooks(owner) {
  const entries = await fs.readdir(dataPath('hefte')).catch((e) => {
    if (e.code === 'ENOENT') return [];
    throw e;
  });
  const result = [];
  for (const entry of entries.filter((e) => UUID.test(e))) {
    try {
      const book = await owned(owner, entry);
      result.push({
        ...book,
        preview: await readJson(pagePath(entry, book.pageIds[0])),
      });
    } catch (e) {
      if (!(e instanceof BookError) && e.code !== 'ENOENT') throw e;
    }
  }
  return result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function blankPage() {
  return {
    id: crypto.randomUUID(),
    revision: 0,
    orientation: 'portrait',
    ruling: 'blanko',
    elements: [],
  };
}
export async function createBook(owner, role, input) {
  const bookId = crypto.randomUUID();
  const now = new Date().toISOString();
  const pages = input.pages
    ? input.pages
        .map(validatePage)
        .map((page) => ({ ...page, id: crypto.randomUUID(), revision: 0 }))
    : [blankPage()];
  if (pages.length < 1 || pages.length > 300)
    throw new BookError('Ein Heft braucht 1 bis 300 Seiten.');
  await checkMedia(owner, pages);
  const book = {
    id: bookId,
    ownerId: owner,
    ownerRole: role,
    title: title(input.title),
    color: color(input.color || '#52796f'),
    createdAt: now,
    updatedAt: now,
    revision: 0,
    pageIds: pages.map((p) => p.id),
    classId: null,
    sourceId: input.sourceId ? id(input.sourceId) : null,
    allowChildPages: role === 'kind' && !input.sourceId,
    trashed: false,
  };
  for (const page of pages) await writeJson(pagePath(bookId, page.id), page);
  await writeJson(bookPath(bookId), book);
  return { book, pages };
}
export async function updateBook(owner, bookId, input) {
  const mutate = () =>
    withLock(`heft-${id(bookId)}`, async () => {
      const book = await owned(owner, bookId);
      const previousIds = [...book.pageIds];
      if (input.revision !== book.revision)
        throw new BookError(
          'Dieses Heft wurde inzwischen geändert. Bitte neu laden.',
          409,
        );
      if (input.title !== undefined) book.title = title(input.title);
      if (input.color !== undefined) book.color = color(input.color);
      if (input.folderId !== undefined) {
        if (
          input.folderId !== null &&
          !(await listFolders(owner)).some((f) => f.id === input.folderId)
        )
          throw new BookError('Ordner nicht gefunden.', 404);
        book.folderId = input.folderId;
      }
      if (input.pageIds !== undefined) {
        if (
          !Array.isArray(input.pageIds) ||
          input.pageIds.length < 1 ||
          new Set(input.pageIds).size !== input.pageIds.length ||
          input.pageIds.some((p) => !book.pageIds.includes(p))
        )
          throw new BookError('Ungültige Seitenreihenfolge.');
        book.pageIds = input.pageIds;
      }
      book.revision++;
      book.updatedAt = new Date().toISOString();
      await writeJson(bookPath(bookId), book);
      for (const pageId of previousIds.filter((p) => !book.pageIds.includes(p)))
        await fs.rm(pagePath(bookId, pageId), { force: true });
      return book;
    });
  return input.folderId === undefined
    ? mutate()
    : withLock(`ordner-${id(owner)}`, mutate);
}
export async function addPage(owner, bookId, input, afterId) {
  const page = { ...validatePage(input), id: crypto.randomUUID(), revision: 0 };
  await checkMedia(owner, page);
  return withLock(`heft-${id(bookId)}`, async () => {
    const book = await owned(owner, bookId);
    if (book.pageIds.length >= 300)
      throw new BookError('Höchstens 300 Seiten pro Heft.');
    const index = afterId
      ? book.pageIds.indexOf(afterId)
      : book.pageIds.length - 1;
    if (index < 0) throw new BookError('Seite nicht gefunden.', 404);
    await writeJson(pagePath(bookId, page.id), page);
    book.pageIds.splice(index + 1, 0, page.id);
    book.revision++;
    book.updatedAt = new Date().toISOString();
    await writeJson(bookPath(bookId), book);
    return { book, page };
  });
}
export async function savePage(
  owner,
  bookId,
  input,
  childMode = false,
  actor = owner,
) {
  const page = validatePage(input);
  await checkMedia(owner, page);
  return withLock(`heft-${id(bookId)}`, async () => {
    const book = await owned(owner, bookId);
    if (!book.pageIds.includes(page.id))
      throw new BookError('Seite nicht gefunden.', 404);
    const previous = await readJson(pagePath(bookId, page.id));
    if (childMode) {
      for (const key of [
        'paperColor',
        'lineColor',
        'frameColor',
        'pageFrame',
        'backgroundImage',
      ])
        if (page[key] !== previous[key])
          throw new BookError('Der Seitenhintergrund ist vorgegeben.', 403);
      for (const el of page.elements.filter((el) =>
        ['widget', 'activity', 'embed'].includes(el.type),
      )) {
        const old = previous.elements.find((p) => p.id === el.id);
        if (
          !old ||
          JSON.stringify(lockedDesign(el)) !== JSON.stringify(lockedDesign(old))
        )
          throw new BookError(
            'Lernwerkzeuge dürfen nur von der Lehrkraft gestaltet werden.',
            403,
          );
      }

      if (
        !book.allowChildAudio &&
        page.elements.some(
          (el) =>
            el.type === 'audio' &&
            !previous.elements.some((old) => old.id === el.id),
        )
      )
        throw new BookError(
          'Tonaufnahmen sind für dieses Heft nicht erlaubt.',
          403,
        );
      if (
        book.trashed ||
        page.ruling !== previous.ruling ||
        page.orientation !== previous.orientation
      )
        throw new BookError('Diese Seiteneinstellungen sind vorgegeben.', 403);
      const locked = previous.elements.filter((el) => el.locked);
      if (
        JSON.stringify(locked.map((el) => el.id)) !==
        JSON.stringify(
          page.elements.filter((el) => el.locked).map((el) => el.id),
        )
      )
        throw new BookError(
          'Die Reihenfolge vorgegebener Elemente ist gesperrt.',
          403,
        );
      if (
        locked.some(
          (el) =>
            JSON.stringify(
              lockedDesign(page.elements.find((n) => n.id === el.id)),
            ) !== JSON.stringify(lockedDesign(el)),
        ) ||
        page.elements.some(
          (el) => el.locked && !locked.some((old) => old.id === el.id),
        )
      )
        throw new BookError(
          'Vorgegebene Elemente dürfen nicht verändert werden.',
          403,
        );
    }
    if (page.revision !== previous.revision)
      throw new BookError(
        'Diese Seite wurde an einem anderen Gerät geändert. Deine Fassung bleibt hier geöffnet. Bitte sichere sie als neue Seite oder lade neu.',
        409,
      );
    page.revision++;
    page.updatedAt = new Date().toISOString();
    page.lastEditorId = actor;
    await writeJson(pagePath(bookId, page.id), page);
    book.updatedAt = new Date().toISOString();
    await writeJson(bookPath(bookId), book);
    return page;
  });
}
export async function deleteBook(owner, bookId) {
  return withLock(`heft-${id(bookId)}`, async () => {
    await owned(owner, bookId);
    await fs.rm(dataPath('hefte', bookId), { recursive: true });
  });
}
export async function listTemplates(owner) {
  const personal = await readJson(
    dataPath('vorlagen', `${id(owner)}.json`),
    [],
  );
  const school = [];
  if (process.env.GRUNDSCHULBUCH_ASSET_DIR) {
    const directory = path.join(
      process.env.GRUNDSCHULBUCH_ASSET_DIR,
      'vorlagen',
    );
    const entries = await fs.readdir(directory).catch((e) => {
      if (e.code === 'ENOENT') return [];
      throw e;
    });
    for (const file of entries.filter((e) => e.endsWith('.json'))) {
      const template = await readJson(path.join(directory, file));
      school.push({
        id: id(template.id),
        title: title(template.title),
        page: validatePage(template.page),
        school: true,
      });
    }
  }
  return [...school, ...personal];
}
export async function saveTemplate(owner, input) {
  const template = {
    id: crypto.randomUUID(),
    title: title(input.title),
    page: validatePage(input.page),
  };
  await checkMedia(owner, template.page);
  return withLock(`vorlagen-${id(owner)}`, async () => {
    const file = dataPath('vorlagen', `${owner}.json`);
    const templates = await readJson(file, []);
    if (templates.length >= 200)
      throw new BookError('Höchstens 200 eigene Vorlagen.');
    templates.push(template);
    await writeJson(file, templates);
    return template;
  });
}
export async function removeTemplate(owner, templateId) {
  return withLock(`vorlagen-${id(owner)}`, async () => {
    const file = dataPath('vorlagen', `${id(owner)}.json`);
    const templates = await readJson(file, []);
    await writeJson(
      file,
      templates.filter((t) => t.id !== id(templateId)),
    );
  });
}
export async function checkMedia(owner, elements) {
  const sources = mediaReferences(elements);
  if (!sources.length) return;
  const allowed = await readJson(
    dataPath('medien', 'rechte', `${id(owner)}.json`),
    [],
  );
  if (sources.some((src) => !allowed.includes(src.split('/').pop())))
    throw new BookError('Kein Zugriff auf dieses Medium.', 403);
}

export async function storeImage(owner, buffer) {
  if (!buffer.length || buffer.length > 12 * 1024 * 1024)
    throw new BookError('Bilder dürfen höchstens 12 MB groß sein.', 413);
  let extension;
  if (
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    extension = 'png';
  else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255)
    extension = 'jpg';
  else if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  )
    extension = 'webp';
  else throw new BookError('Bitte ein PNG-, JPEG- oder WebP-Bild auswählen.');
  try {
    buffer = await sharp(buffer, { limitInputPixels: 40000000 })
      .rotate()
      .webp({ quality: 90 })
      .toBuffer();
    extension = 'webp';
  } catch {
    throw new BookError('Dieses Bild ist beschädigt oder zu groß.');
  }
  const name = `${crypto.createHash('sha256').update(buffer).digest('hex')}.${extension}`;
  await fs.mkdir(dataPath('medien'), { recursive: true, mode: 0o700 });
  await fs
    .writeFile(dataPath('medien', name), buffer, { flag: 'wx', mode: 0o600 })
    .catch((e) => {
      if (e.code !== 'EEXIST') throw e;
    });
  await withLock(`medien-${id(owner)}`, async () => {
    const file = dataPath('medien', 'rechte', `${owner}.json`);
    const rights = await readJson(file, []);
    if (!rights.includes(name)) {
      rights.push(name);
      await writeJson(file, rights);
    }
  });
  return { src: `/api/medien/${name}` };
}
export async function readImage(owner, name) {
  if (!/^[a-f0-9]{64}\.(png|jpg|webp|mp3|wav|ogg|webm|m4a|apphtml)$/.test(name))
    throw new BookError('Bild nicht gefunden.', 404);
  await checkMedia(owner, [{ type: 'image', src: `/api/medien/${name}` }]);
  return fs.readFile(dataPath('medien', name));
}

export async function trashBook(owner, bookId, trashed = true) {
  return withLock(`heft-${id(bookId)}`, async () => {
    const book = await owned(owner, bookId);
    book.trashed = trashed;
    book.revision++;
    await writeJson(bookPath(bookId), book);
    return book;
  });
}
export async function accessibleOwner(teacher, bookId) {
  const book = await readJson(bookPath(bookId), null);
  if (!book) throw new BookError('Heft nicht gefunden.', 404);
  if (book.ownerId === teacher) return teacher;
  const { childById } = await import('./classes.mjs');
  const child = await childById(book.ownerId, true);
  if (child?.teacherId !== teacher)
    throw new BookError('Heft nicht gefunden.', 404);
  return child.id;
}
export async function storeAudio(owner, buffer) {
  if (!buffer.length || buffer.length > 20 * 1024 * 1024)
    throw new BookError('Tondateien dürfen höchstens 20 MB groß sein.', 413);
  let extension;
  if (
    buffer.toString('ascii', 0, 3) === 'ID3' ||
    (buffer[0] === 255 && (buffer[1] & 224) === 224)
  )
    extension = 'mp3';
  else if (buffer.toString('ascii', 0, 4) === 'OggS') extension = 'ogg';
  else if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WAVE'
  )
    extension = 'wav';
  else if (buffer.subarray(0, 4).equals(Buffer.from([26, 69, 223, 163])))
    extension = 'webm';
  else if (buffer.toString('ascii', 4, 8) === 'ftyp') extension = 'm4a';
  else throw new BookError('Unterstützt werden MP3, WAV, Ogg, WebM und M4A.');
  const name = `${crypto.createHash('sha256').update(buffer).digest('hex')}.${extension}`;
  await fs.mkdir(dataPath('medien'), { recursive: true, mode: 0o700 });
  await fs
    .writeFile(dataPath('medien', name), buffer, { flag: 'wx', mode: 0o600 })
    .catch((e) => {
      if (e.code !== 'EEXIST') throw e;
    });
  const { grantImages } = await import('./classes.mjs');
  await grantImages(owner, [`/api/medien/${name}`]);
  return { src: `/api/medien/${name}` };
}
export async function listAssets(owner) {
  return readJson(dataPath('sammlungen', `${id(owner)}.json`), []);
}
export async function saveAsset(owner, input) {
  const page = validatePage(input.page);
  await checkMedia(owner, page);
  return withLock(`sammlung-${id(owner)}`, async () => {
    const file = dataPath('sammlungen', `${owner}.json`);
    const assets = await readJson(file, []);
    if (assets.length >= 300)
      throw new BookError('Höchstens 300 Einträge in der Sammlung.');
    const asset = { id: crypto.randomUUID(), title: title(input.title), page };
    assets.push(asset);
    await writeJson(file, assets);
    return asset;
  });
}
export async function removeAsset(owner, assetId) {
  return withLock(`sammlung-${id(owner)}`, async () => {
    const file = dataPath('sammlungen', `${owner}.json`);
    await writeJson(
      file,
      (await readJson(file, [])).filter((a) => a.id !== id(assetId)),
    );
  });
}
export async function shareBook(owner, bookId, recipientId) {
  const { findAccount } = await import('./accounts.mjs');
  if (!(await findAccount(id(recipientId))) || recipientId === owner)
    throw new BookError('Bitte eine andere Lehrkraft auswählen.');
  const source = await getBook(owner, bookId);
  const { grantImages } = await import('./classes.mjs');
  await grantImages(recipientId, mediaReferences(source.pages));
  return createBook(recipientId, 'lehrkraft', {
    title: source.book.title,
    color: source.book.color,
    sourceId: source.book.id,
    pages: source.pages,
  });
}
export async function shareTemplate(owner, templateId, recipientId) {
  const { findAccount } = await import('./accounts.mjs');
  if (!(await findAccount(id(recipientId))) || recipientId === owner)
    throw new BookError('Bitte eine andere Lehrkraft auswählen.');
  const source = (await listTemplates(owner)).find(
    (t) => t.id === id(templateId),
  );
  if (!source) throw new BookError('Vorlage nicht gefunden.', 404);
  const { grantImages } = await import('./classes.mjs');
  await grantImages(recipientId, mediaReferences(source.page));
  return saveTemplate(recipientId, { title: source.title, page: source.page });
}

export async function listFolders(owner) {
  return readJson(dataPath('ordner', `${id(owner)}.json`), []);
}
export async function saveFolder(owner, input) {
  return withLock(`ordner-${id(owner)}`, async () => {
    const folders = await listFolders(owner);
    let folder = input.folderId
      ? folders.find((f) => f.id === id(input.folderId))
      : null;
    if (input.folderId && !folder)
      throw new BookError('Ordner nicht gefunden.', 404);
    if (!folder) {
      folder = {
        id: crypto.randomUUID(),
        title: title(input.title),
        color: color(input.color || '#52796f'),
      };
      folders.push(folder);
    } else {
      if (input.title !== undefined) folder.title = title(input.title);
      if (input.color !== undefined) folder.color = color(input.color);
    }
    if (folders.length > 200) throw new BookError('Höchstens 200 Ordner.');
    await writeJson(dataPath('ordner', `${owner}.json`), folders);
    return folder;
  });
}
export async function removeFolder(owner, folderId) {
  return withLock(`ordner-${id(owner)}`, async () => {
    const folders = await listFolders(owner);
    if (!folders.some((f) => f.id === id(folderId)))
      throw new BookError('Ordner nicht gefunden.', 404);
    for (const book of await listBooks(owner))
      if (book.folderId === folderId)
        await withLock(`heft-${book.id}`, async () => {
          const current = await owned(owner, book.id);
          current.folderId = null;
          current.revision++;
          await writeJson(bookPath(book.id), current);
        });
    await writeJson(
      dataPath('ordner', `${owner}.json`),
      folders.filter((f) => f.id !== folderId),
    );
  });
}
export async function preferences(owner, input) {
  const file = dataPath('einstellungen', `${id(owner)}.json`);
  if (input === undefined) return readJson(file, {});
  const settings = learningSettings(input);
  await withLock(`einstellungen-${owner}`, () => writeJson(file, settings));
  return settings;
}

export async function storeWebApp(owner, buffer) {
  if (!buffer.length || buffer.length > 2 * 1024 * 1024)
    throw new BookError('HTML-Apps dürfen höchstens 2 MB groß sein.', 413);
  const text = buffer.toString('utf8');
  if (
    !/<(?:!doctype|html|body|div|script|style|main|section|button)\b/i.test(
      text,
    ) ||
    text.includes('\0')
  )
    throw new BookError('Bitte eine eigenständige HTML-Datei wählen.');
  const name =
    crypto.createHash('sha256').update(buffer).digest('hex') + '.apphtml';
  await fs.mkdir(dataPath('medien'), { recursive: true, mode: 0o700 });
  await fs
    .writeFile(dataPath('medien', name), buffer, { flag: 'wx', mode: 0o600 })
    .catch((e) => {
      if (e.code !== 'EEXIST') throw e;
    });
  const { grantImages } = await import('./classes.mjs');
  await grantImages(owner, ['/api/medien/' + name]);
  return { src: '/api/medien/' + name };
}
