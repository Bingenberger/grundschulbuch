'use client';
import type {PageElement} from '@/lib/notebook-model';
import {textStyle} from '../PageView';
import TextFrame from '../TextFrame';
export const isLockedTemplateField=(el:PageElement)=>el.type==='text'&&el.locked&&typeof el.textHint==='string';
/** Fixed geometry, editable contents: template hints are never dead text. */
export default function TemplateTextField({element,onText}:{element:PageElement;onText:(text:string)=>void}){
  return <><TextFrame element={element}/><textarea className="template-text-field" aria-label={`Textfeld: ${element.textHint}`} placeholder={element.textHint} value={element.text||''} maxLength={20000}
    style={{...textStyle(element),width:'100%',height:'100%',boxSizing:'border-box',margin:0,border:0,background:'transparent',resize:'none',outline:'none'}}
    onPointerDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} onChange={e=>onText(e.target.value)}/></>;
}
