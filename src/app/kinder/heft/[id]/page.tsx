import { redirect, notFound } from 'next/navigation';
import { currentChild } from '@/lib/child-auth';
import { getBook, BookError, readSchoolTemplates } from '@/lib/notebooks.mjs';
import ChildEditor from '@/components/ChildEditor';
import CollectedBook from '@/components/CollectedBook';
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
  if (data.book.collected) return <CollectedBook initial={data} allowed={child.features} />;
  const school = await readSchoolTemplates();
  return <ChildEditor initial={data} images={child.images} allowed={child.features} templatePolicies={school.policies} hiddenTemplates={school.hidden} templateClassId={child.classId} />;
}
