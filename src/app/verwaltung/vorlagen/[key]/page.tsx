import {notFound,redirect} from 'next/navigation';
import {currentUser} from '@/lib/auth';
import {readSchoolTemplates,schoolTemplateVersion} from '@/lib/notebooks.mjs';
import {starterTemplates} from '@/lib/generators';
import {newPage,uuid,type BookData} from '@/lib/notebook-model';
import {templateCatalog} from '@/components/editor/page-templates';
import TemplateEditor from '@/components/TemplateEditor';
export const dynamic='force-dynamic';

export default async function EditTemplate({params}:{params:Promise<{key:string}>}) {
  const user=await currentUser();if(!user)redirect('/anmelden');if(user.role!=='admin')redirect('/');
  const {key}=await params,school=await readSchoolTemplates();
  const saved=[...starterTemplates().map((t,i)=>({...t,id:`start-${i}`,school:true})),...school.templates.map(t=>({...t,school:true}))];
  const catalogue=templateCatalog(saved,[],true),entry=catalogue.find(e=>e.key===key);
  if(key!=='neu'&&(!entry||entry.configure))notFound();
  const targetKey=entry?.key||`tpl-${uuid()}`;
  const stored=school.templates.find(t=>(t.replaces||`tpl-${t.id}`)===targetKey);
  const page=entry?entry.build(entry.orientation||'landscape')[0]:newPage('blanko','landscape');
  const now=new Date().toISOString(),bookId=uuid(),title=entry?.title||'Neue Schulvorlage';
  const initial:BookData={book:{id:bookId,ownerId:user.id,ownerRole:'admin',title,color:'#52796f',createdAt:now,updatedAt:now,revision:0,pageIds:[page.id],classId:null,sourceId:null,allowChildPages:false},pages:[{...page,template:targetKey}]};
  return <TemplateEditor key={targetKey} initial={initial} templates={saved} targetKey={targetKey} title={title} category={entry?.category||'Schulvorlagen'} expectedVersion={schoolTemplateVersion(stored)} dictionaryOrigin={process.env.WOERTERBUCH_ORIGIN||''}/>;
}
