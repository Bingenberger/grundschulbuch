import { redirect, notFound } from 'next/navigation';
import { currentChild } from '@/lib/child-auth';
import { getBook, BookError } from '@/lib/notebooks.mjs';
import ChildEditor from '@/components/ChildEditor';
export const dynamic = 'force-dynamic';
export default async function Kinderheft({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const child = await currentChild();
  if (!child) redirect('/kinder');
  const { id } = await params;
  const data = await getBook(child.id, id).catch((e) => {
    if (e instanceof BookError) notFound();
    throw e;
  });
  if (data.book.trashed) notFound();
  return <ChildEditor initial={data} images={child.images} allowed={child.features} />;
}
