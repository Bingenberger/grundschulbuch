import type { PageElement } from '@/lib/notebook-model';

type Area = { width: number; height: number; left: number; top: number };

/** The part of the page (in page mm) that is visible in the scroll area. */
export function visibleRect(area: HTMLElement | null, surface: HTMLElement | null, size: Area) {
  if (!area || !surface) return null;
  const view = area.getBoundingClientRect(), page = surface.getBoundingClientRect();
  if (!page.width || !page.height) return null;
  const x = (px: number) => size.left + ((px - page.left) / page.width) * size.width;
  const y = (px: number) => size.top + ((px - page.top) / page.height) * size.height;
  const left = Math.max(size.left, x(view.left)), right = Math.min(size.left + size.width, x(view.right));
  const top = Math.max(size.top, y(view.top)), bottom = Math.min(size.top + size.height, y(view.bottom));
  if (right <= left || bottom <= top) return null;
  return { x: left, y: top, width: right - left, height: bottom - top };
}

/** Middle of the visible part of the page, in page mm. */
export function visibleCenter(area: HTMLElement | null, surface: HTMLElement | null, size: Area) {
  const rect = visibleRect(area, surface, size);
  return rect && { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

/**
 * On endless paper the user may look at any part of the surface. A new element
 * that would land outside the visible part moves into its middle, so it is
 * never inserted somewhere out of sight.
 */
export function intoView(el: PageElement, area: HTMLElement | null, surface: HTMLElement | null, size: Area): PageElement {
  return groupIntoView([el], area, surface, size)[0];
}

/** Like intoView for several elements that keep their arrangement. */
export function groupIntoView(elements: PageElement[], area: HTMLElement | null, surface: HTMLElement | null, size: Area): PageElement[] {
  const rect = visibleRect(area, surface, size);
  if (!rect || !elements.length) return elements;
  const x0 = Math.min(...elements.map(el => el.x)), y0 = Math.min(...elements.map(el => el.y));
  const x1 = Math.max(...elements.map(el => el.x + el.width)), y1 = Math.max(...elements.map(el => el.y + el.height));
  if (x0 >= rect.x && y0 >= rect.y && x1 <= rect.x + rect.width && y1 <= rect.y + rect.height) return elements;
  const dx = Math.round((rect.x + Math.max(0, (rect.width - (x1 - x0)) / 2) - x0) * 10) / 10;
  const dy = Math.round((rect.y + Math.max(0, (rect.height - (y1 - y0)) / 2) - y0) * 10) / 10;
  return elements.map(el => ({ ...el, x: el.x + dx, y: el.y + dy }));
}
