import {designPage} from './page-designs';
import type {Page,Ruling} from '../notebook-model';
export const paperDesignIds:Record<Ruling,string>={blanko:'blank',linie1:'lin1',linie2:'lin2',linie3:'lin3',linie4:'lines',linieneng:'lines-narrow',bildzeilen:'picture-lines',karo5:'squares',karo10:'squares-big',rechnen:'squares-big',punkte:'dots',noten:'music'};
export function referencePaper(ruling:Ruling,orientation:Page['orientation']='landscape'):Page {
  const id=paperDesignIds[ruling],page=designPage(id,orientation)[0];
  return {...page,ruling,paperReferenceId:id,elements:page.elements.filter(e=>e.type!=='shape')};
}
