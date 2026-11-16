import { redirect, notFound } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import {
  accessibleOwner,
  BookError,
  getBook,
  readSchoolTemplates,
  listTemplates,
} from '@/lib/notebooks.mjs';
import { starterTemplates } from '@/lib/generators';
import Editor from '@/components/Editor';
import { childById, listAllClasses, listClasses } from '@/lib/classes.mjs';
export const dynamic = 'force-dynamic';
export default async function Heft({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect('/anmelden');
  const { id } = await params;
  const data = await accessibleOwner(user.id, id)
    .then((owner) => getBook(owner, id))
    .catch((e) => {
      if (e instanceof BookError && [400, 404].includes(e.status)) notFound();
      throw e;
    });
  const school = await readSchoolTemplates();
  const classId = data.book.ownerRole === 'kind' ? (await childById(data.book.ownerId))?.classId : undefined;
  return (
    <Editor
      initial={data}
      initialTemplates={[
        ...starterTemplates().map((t, i) => ({
          ...t,
          // Fixed ids, so school templates can replace or hide them.
          id: `start-${i}`,
          school: true,
        })),
        ...(await listTemplates(user.id)),
      ]}
      hiddenTemplates={school.hidden}
      templatePolicies={school.policies}
      templateClasses={classId ? [] : (await (user.role === 'admin' ? listAllClasses() : listClasses(user.id))).filter(c=>!c.archived).map(c=>({id:c.id,title:c.title}))}
      fixedTemplateClassId={classId}
      admin={user.role === 'admin'}
      dictionaryOrigin={process.env.WOERTERBUCH_ORIGIN || ''}
    />
  );
}
