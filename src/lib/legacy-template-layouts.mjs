import {createHash} from 'node:crypto';
import definitions from './reference/legacy-starter-fingerprints.json' with {type:'json'};
import {validatePage} from './notebooks.mjs';
export function layoutFingerprint(page){
  const stable=JSON.stringify(validatePage(page),(_,value)=>value&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.entries(value).filter(([key])=>!['id','revision','updatedAt','lastEditorId','template','templateClassId'].includes(key)).sort(([a],[b])=>a.localeCompare(b))):value);
  return createHash('sha256').update(stable).digest('hex');
}
export function legacyTemplateLayout(template){
  const old=definitions.find(d=>d.key===template.replaces);if(!old)return null;
  if(layoutFingerprint(template.page)===old.fingerprint)return{referenceId:old.referenceId};
  if(old.referenceId==='profile'){
    const withoutTitle={...template.page,elements:template.page.elements.map((e,i)=>i===0?{...e,text:'__TITLE__'}:e)};
    if(layoutFingerprint(withoutTitle)===old.titleFingerprint)return{referenceId:old.referenceId,heading:template.page.elements[0].text};
  }
  return null;
}
