'use client';
import {useCallback,useRef,useState} from 'react';
import Editor from './Editor';
import Icon from './Icon';
import {ApiError} from '@/lib/client-api';
import {flushEditor,useEditor} from '@/lib/editor-store';
import type {BookData,Page,Template} from '@/lib/notebook-model';
import type {SchoolTemplate} from '@/lib/notebooks.mjs';

/** Uses the page editor with direct template persistence; no notebook is created. */
export default function TemplateEditor({initial,templates,targetKey,title,category,expectedVersion,dictionaryOrigin}:{initial:BookData;templates:Template[];targetKey:string;title:string;category:string;expectedVersion:string|null;dictionaryOrigin:string}) {
  const [name,setName]=useState(title),[group,setGroup]=useState(category);
  const target=useRef({key:targetKey,title,category,version:expectedVersion});
  const state=useEditor();
  const savePage=useCallback(async(page:Page)=>{
    if(!target.current.title.trim())throw new Error('Bitte einen Namen für die Vorlage eingeben.');
    const response=await fetch('/api/verwaltung',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'saveTemplateEdit',key:target.current.key,title:target.current.title,category:target.current.category,expectedVersion:target.current.version,page})});
    const result=await response.json();if(!response.ok)throw new ApiError(result.error||'Vorlage konnte nicht gespeichert werden.',response.status);
    const saved=result as SchoolTemplate;
    target.current.version=`${saved.id}:${saved.revision||0}:${saved.updatedAt}`;
    // New templates get a stable address for reopening and refreshing.
    const address=`/verwaltung/vorlagen/${encodeURIComponent(target.current.key)}`;
    if(window.location.pathname!==address)window.history.replaceState(window.history.state,'',address);
    return saved.page;
  },[]);
  function updateMetadata(nameValue:string,groupValue:string){
    const nextName=nameValue.trim(),nextGroup=groupValue.trim()||'Schulvorlagen';
    if(target.current.title===nextName&&target.current.category===nextGroup)return;
    target.current={...target.current,title:nextName,category:nextGroup};
    const current=useEditor.getState(),page=current.pages[0];
    if(current.book&&page)useEditor.setState({book:{...current.book,title:nextName||'Neue Schulvorlage'},dirty:{...current.dirty,[page.id]:(current.dirty[page.id]||0)+1}});
  }
  function applyMetadata(){
    const nextName=name.trim();
    if(!nextName){useEditor.setState({error:'Bitte einen Namen für die Vorlage eingeben.'});return false;}
    updateMetadata(name,group);
    return true;
  }
  const tools=<form className="template-edit-toolbar" aria-label="Vorlage bearbeiten" onSubmit={e=>{e.preventDefault();if(applyMetadata()){
    const current=useEditor.getState(),page=current.pages[0];
    if(page&&!Object.keys(current.dirty).length&&!target.current.version)useEditor.setState({dirty:{[page.id]:1}});
    void flushEditor();
  }}}>
    <label>Name der Vorlage<input aria-label="Vorlagenname" maxLength={120} value={name} required onChange={e=>{setName(e.target.value);updateMetadata(e.target.value,group);}} onBlur={applyMetadata}/></label>
    <label>Kategorie<input aria-label="Kategorie der Vorlage" maxLength={40} value={group} onChange={e=>{setGroup(e.target.value);updateMetadata(name,e.target.value);}} onBlur={applyMetadata}/></label>
    <button className="knopf knopf-haupt" disabled={state.saving||state.conflict}><Icon name="ok" size={20}/> Vorlage speichern</button>
    <p>Änderungen werden direkt in dieser Vorlage gespeichert. Die bisherige Fassung wird ersetzt.</p>
  </form>;
  return <Editor initial={initial} initialTemplates={templates} dictionaryOrigin={dictionaryOrigin} templateEditing={{savePage,tools}}/>;
}
