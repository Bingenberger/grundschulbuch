// Only recognizable old starter layouts; preserve title-only customizations.
// Preview by default. --apply writes an atomic template update after a backup.
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {legacyTemplateLayout} from '../src/lib/legacy-template-layouts.mjs';
import {readSchoolTemplates,saveSchoolTemplateEdit,schoolTemplateVersion} from '../src/lib/notebooks.mjs';
import {dataPath,writeJson} from '../src/lib/store.mjs';
import {readAccounts} from '../src/lib/accounts.mjs';
const compiled=await build({stdin:{contents:"export {designPage} from './src/lib/learning/page-designs';",resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs',packages:'external'});
const mod={exports:{}};new Function('require','module','exports',compiled.outputFiles[0].text)(createRequire(import.meta.url),mod,mod.exports);
const plans=(await readSchoolTemplates()).templates.flatMap(template=>{const layout=legacyTemplateLayout(template);return layout?[{template,layout}]:[];});
console.log(`${plans.length} recognizable legacy school templates.`);
if(process.argv.includes('--apply')&&plans.length){
  const backup=dataPath('sicherungen',`vorlagen-originalabgleich-${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
  await writeJson(backup,plans.map(p=>p.template));
  const admin=(await readAccounts()).users.find(a=>a.role==='admin'&&!a.blocked);if(!admin)throw Error('No active administrator');
  for(const {template,layout} of plans){
    const page=mod.exports.designPage(layout.referenceId)[0];
    if(layout.heading){const heading=page.elements.find(e=>e.type==='text');heading.text=layout.heading;delete heading.runs;}
    await saveSchoolTemplateEdit(admin.id,{key:template.replaces,title:template.title,category:template.category,page,expectedVersion:schoolTemplateVersion(template)});
    console.log(`Updated ${template.replaces}; custom heading retained: ${!!layout.heading}`);
  }
  console.log(`Backup: ${backup}`);
}
