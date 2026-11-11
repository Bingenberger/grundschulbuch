'use client';
import { uuid, type PageElement } from '@/lib/notebook-model';

/** `edit`: open the picture editor right after inserting (e.g. to crop a screenshot). */
export type ChosenImage = { src: string; alt?: string; credit?: string; edit?: boolean };
export type PlaceholderShape = 'wide' | 'square' | 'tall' | 'round';

const naturalSize = (src: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth || 1, height: image.naturalHeight || 1 });
    image.onerror = () => reject(new Error('Das Bild konnte nicht geöffnet werden.'));
    image.src = src;
  });

/** A picture element in its own proportions, at most `maxWidth` wide. */
export async function imageElement(
  image: ChosenImage,
  page: { width: number; height: number },
  { maxWidth = 90, x = 20, y = 25 }: { maxWidth?: number; x?: number; y?: number } = {},
): Promise<PageElement> {
  const natural = await naturalSize(image.src);
  let width = Math.min(maxWidth, page.width - 2 * x);
  let height = (width * natural.height) / natural.width;
  if (height > page.height - y - 15) {
    height = page.height - y - 15;
    width = (height * natural.width) / natural.height;
  }
  return {
    id: uuid(),
    type: 'image',
    x,
    y,
    width,
    height,
    rotation: 0,
    locked: false,
    color: '#253c42',
    src: image.src,
    alt: image.alt || '',
    ...(image.credit ? { credit: image.credit } : {}),
  };
}

const shapes: Record<PlaceholderShape, [number, number]> = {
  wide: [80, 55],
  square: [60, 60],
  tall: [50, 70],
  round: [60, 60],
};

/** Empty photo frame; tapping it later opens the camera. */
export function placeholderElement(label: string, shape: PlaceholderShape): PageElement {
  const [width, height] = shapes[shape];
  return {
    id: uuid(),
    type: 'image',
    x: 20,
    y: 25,
    width,
    height,
    rotation: 0,
    locked: false,
    color: '#253c42',
    placeholder: label.trim().slice(0, 200),
    alt: '',
    fit: 'cover',
    ...(shape === 'round' ? { imageFrame: 'round' } : {}),
  };
}

/** Puts a picture into a placeholder; the frame keeps its place and size. */
export function fillPlaceholder(el: PageElement, image: ChosenImage | null): PageElement {
  const next: PageElement = { ...el, fit: 'cover' };
  delete next.crop;
  delete next.src;
  delete next.credit;
  if (!image) return { ...next, alt: '' };
  return { ...next, src: image.src, alt: image.alt || el.placeholder || '', ...(image.credit ? { credit: image.credit } : {}) };
}

export const isPlaceholder = (el?: PageElement | null) =>
  !!el && el.type === 'image' && typeof el.placeholder === 'string';

/** Moves a new element down-right while another one already sits at that spot. */
export function cascade(el: PageElement, others: PageElement[], page: { width: number; height: number }): PageElement {
  let { x, y } = el;
  for (let i = 0; i < 12 && others.some((o) => Math.abs(o.x - x) < 3 && Math.abs(o.y - y) < 3); i++) {
    x += 8;
    y += 8;
  }
  if (x + el.width > page.width || y + el.height > page.height) return el;
  return { ...el, x, y };
}

/** Element after editing its picture: new file, proportions follow unless the frame is fixed. */
export function withEditedPicture(el: PageElement, image: { src: string; width: number; height: number }): PageElement {
  const next: PageElement = { ...el, src: image.src };
  delete next.crop;
  delete next.imageFilter;
  delete next.flip;
  if (!el.locked && !isPlaceholder(el) && image.width > 0)
    next.height = Math.max(3, Math.round(((el.width * image.height) / image.width) * 100) / 100);
  return next;
}
