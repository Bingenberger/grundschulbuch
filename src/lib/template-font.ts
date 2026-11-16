import families from './reference/template-fonts.json';
import type {PageElement} from './notebook-model';
export const templateFontFamilies=Object.values(families);
export function fontFamilyFor(el:Pick<PageElement,'font'|'referenceFont'>):string {
  return el.referenceFont && Object.hasOwn(families,el.referenceFont) ? families[el.referenceFont as keyof typeof families] : el.font||'Andika';
}
