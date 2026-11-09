import { redirect, notFound } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { accessibleOwner, BookError, getBook } from '@/lib/notebooks.mjs';
import PrintBook from '@/components/PrintBook';
export const dynamic = 'force-dynamic';
export default async function Drucken({
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
  return <PrintBook data={data} />;
}
