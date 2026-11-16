import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
const directory=await fs.mkdtemp(path.join(os.tmpdir(),'grundschulbuch-template-edit-'));
process.env.GRUNDSCHULBUCH_DATA_DIR=directory;
after(()=>fs.rm(directory,{recursive:true,force:true}));
const books=await import('../src/lib/notebooks.mjs'),owner=crypto.randomUUID();
const page=()=>({id:crypto.randomUUID(),revision:0,orientation:'landscape',ruling:'blanko',elements:[]});
test('Direktes Bearbeiten ersetzt denselben Vorlagenplatz und legt kein Heft an',async()=>{
  const key='bp-template-edit';
  const first=await books.saveSchoolTemplateEdit(owner,{key,title:'Vorlage',category:'Schule',page:page(),expectedVersion:null});
  assert.equal(first.replaces,key);
  const second=await books.saveSchoolTemplateEdit(owner,{key,title:'Geänderte Vorlage',category:'Gestalten',page:first.page,expectedVersion:books.schoolTemplateVersion(first)});
  assert.equal(first.id,second.id);assert.equal(second.title,'Geänderte Vorlage');
  assert.equal(second.revision,2);assert.equal(second.page.revision,2);
  assert.equal((await books.readSchoolTemplates()).templates.filter(t=>t.replaces===key).length,1);
  assert.deepEqual(await books.listBooks(owner),[]);
});
test('Zwei geöffnete Bearbeitungen überschreiben sich nicht und veraltete Fassungen bleiben ungespeichert',async()=>{
  const key='bp-template-race',first=await books.saveSchoolTemplateEdit(owner,{key,title:'Original',category:'Schule',page:page(),expectedVersion:null});
  const version=books.schoolTemplateVersion(first);
  const results=await Promise.allSettled(['Fenster A','Fenster B'].map(title=>books.saveSchoolTemplateEdit(owner,{key,title,category:'Schule',page:first.page,expectedVersion:version})));
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  assert.equal(results.filter(r=>r.status==='rejected'&&r.reason.status===409).length,1);
  assert.equal((await books.readSchoolTemplates()).templates.filter(t=>t.replaces===key).length,1);
  await books.removeSchoolTemplate(first.id);
  await assert.rejects(books.saveSchoolTemplateEdit(owner,{key,title:'Veraltet',category:'Schule',page:first.page,expectedVersion:version}),e=>e.status===409);
});
test('Neue Schulvorlagen behalten bei weiteren Speichervorgängen ihre Kennung; Klassenregeln bleiben erhalten',async()=>{
  const templateId=crypto.randomUUID(),key=`tpl-${templateId}`;
  await books.setTemplatePolicy(key,null,{enabled:false,insertion:'fixed'});
  const first=await books.saveSchoolTemplateEdit(owner,{key,title:'Neu',category:'Schule',page:{...page(),template:'bp-fremd',templateClassId:crypto.randomUUID()},expectedVersion:null});
  assert.equal(first.id,templateId);assert.equal(first.page.template,key);assert.equal(first.page.templateClassId,undefined);
  const next=await books.saveSchoolTemplateEdit(owner,{key,title:'Aktualisiert',category:'Schule',page:first.page,expectedVersion:books.schoolTemplateVersion(first)});
  assert.equal(next.id,templateId);
  const school=await books.readSchoolTemplates();assert.deepEqual(school.policies.global[key],{enabled:false,insertion:'fixed'});
  assert.equal(school.templates.filter(t=>t.id===templateId).length,1);
  assert.deepEqual(await books.listBooks(owner),[]);
});
test('Speichern erfordert eine bekannte Version und einen gültigen Vorlagenplatz',async()=>{
  await assert.rejects(books.saveSchoolTemplateEdit(owner,{key:'bp-missing-version',title:'Ohne Version',page:page()}),/Version/);
  await assert.rejects(books.saveSchoolTemplateEdit(owner,{key:'../fremd',title:'Falsch',page:page(),expectedVersion:null}),/Unbekannte Vorlage/);
});
