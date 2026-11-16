import originals from '../reference/page-templates.json';
import { newPage, uuid, type Font, type Page, type PageElement } from '../notebook-model';
export const pageDesigns = originals;
const fonts: Record<string, Font> = { arial:'Arial',andika:'Andika',nunito:'Nunito',grund:'Playwrite DE Grund',schreib:'Playwrite DE VA',sas:'Playwrite DE SAS',druck:'Andika',lexend:'Lexend',atkinson:'Atkinson Hyperlegible',merriweather:'Merriweather',caveat:'Caveat',comic:'Bangers' };
type Item = Record<string, unknown> & { type:string;x:number;y:number;w:number;h:number };
/** Original 1400 × 990 design; text, picture slots and every vector remain editable. */
export function designPage(id: string, orientation: Page['orientation'] = 'landscape'): Page[] {
  const design = originals.find(d=>d.id===id);
  if(!design) throw Error('Unbekannte Seitenvorlage.');
  const page=newPage('blanko',orientation), k=orientation==='landscape'?297/1400:210/1400, offset=orientation==='portrait'?(297-990*k)/2:0;
  page.paperColor=design.paper;
  page.lineColor=design.line;
  const grid=design.grid;
  if(grid)page.templateRuling={top:grid.top*k+offset,pitch:grid.pitch*k,baseline:grid.baseline*k,xHeight:grid.xHeight*k,count:grid.count,left:grid.left*k,right:grid.right*k};
  page.elements=design.items.map(raw=>referenceElement(raw as Item,k,offset,grid));
  return [page];
}
/** One item of the reference (1400 × 990 units) as an editable element. */
export function referenceElement(item: Item, k: number, offset = 0, grid?: { pitch: number } | null): PageElement {
    const base={id:uuid(),x:item.x*k,y:item.y*k+offset,width:Math.max(.1,item.w*k),height:Math.max(.1,item.h*k),rotation:Number(item.rot)||0,locked:false,color:String(item.color||'#1f2937'),designScale:k};
    if(item.type==='vector') return {...base,type:'shape',shape:'template',vectorId:String(item.vectorId),fill:String(item.fill),strokeWidth:Number(item.strokeWidth)*k,opacity:Math.max(.01,Number(item.opacity))} as PageElement;
    if(item.type==='text') {
      const el=documentFreeText(String(item.html||''));
      return {...base,type:'text',...el,font:fonts[String(item.font)]||'Andika',...(!item.svgLabel?{referenceFont:String(item.font||'andika'),referencePadding:String(item.referencePadding||'4px 6px'),referenceCentered:!!item.referenceCentered}:{}),...(item.referenceFrameId?{referenceFrameId:String(item.referenceFrameId),background:String(item.fill||'none'),borderColor:String(item.stroke||'#1f2937'),borderWidth:0}:{}),fontSize:Math.max(6,Number(item.size||32)*k*72/25.4),bold:!!item.bold,italic:!!item.italic,underline:!!item.underline,align:(item.align||'left') as PageElement['align'],lineHeight:item.onLines&&grid?grid.pitch/Number(item.size):item.svgLabel?1.2:1.3,...(item.onLines&&grid?{textLinePitch:grid.pitch*k}:{}),...(item.placeholder?{textHint:String(item.placeholder)}:{})} as PageElement;
    }
    if(item.type==='image') return {...base,type:'image',placeholder:String(item.placeholder||'Bild'),fit:item.fit==='cover'?'cover':'contain',imageFrame:String(item.frame||'none')} as PageElement;
    if(item.type==='embed') return {...base,type:'embed',embedKind:item.kind==='page'?'webpage':'video',url:String(item.url||''),alt:String(item.placeholder||'Video')} as PageElement;
    if(item.type==='audio'&&item.tts&&item.label) return {...base,type:'audio',speechText:String(item.label),alt:String(item.label)} as PageElement;
    if(item.type==='audio'&&item.placeholder) return {...base,type:'audio',placeholder:String(item.placeholder),alt:''} as PageElement;
    throw Error('Unbekanntes Vorlagenelement: '+item.type);
}
const decode=(s:string)=>s.replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,'\u00a0').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
function documentFreeText(html:string): Pick<PageElement,'text'|'runs'> {
  const parts=html.split(/(<\/?(?:b|strong|i|em|u)>)/gi),runs:NonNullable<PageElement['runs']>=[];
  let bold=false,italic=false,underline=false;
  for(const part of parts){if(/^<\/?(?:b|strong)>$/i.test(part))bold=!part.startsWith('</');else if(/^<\/?(?:i|em)>$/i.test(part))italic=!part.startsWith('</');else if(/^<\/?u>$/i.test(part))underline=!part.startsWith('</');else if(part)runs.push({text:decode(part),bold,italic,underline});}
  return {text:runs.map(r=>r.text).join(''),...(/<(?:b|strong|i|em|u)>/i.test(html)?{runs}:{})};
}
