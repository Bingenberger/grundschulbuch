import { redirect, notFound } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import {
  accessibleOwner,
  BookError,
  getBook,
  listTemplates,
} from '@/lib/notebooks.mjs';
import { starterTemplates } from '@/lib/generators';
import Editor from '@/components/Editor';
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
  return (
    <Editor
      initial={data}
      initialTemplates={[
        ...starterTemplates().map((t) => ({
          ...t,
          id: crypto.randomUUID(),
          school: true,
        })),
        ...(await listTemplates(user.id)),
      ]}
      galleryOrigin={process.env.GALLERY_ORIGIN || ''}
      dictionaryOrigin={process.env.WOERTERBUCH_ORIGIN || ''}
    />
  );
}
