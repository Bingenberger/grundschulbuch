import { currentChild } from '@/lib/child-auth';
import { listBooks } from '@/lib/notebooks.mjs';
import ChildHome from '@/components/ChildHome';
export const dynamic = 'force-dynamic';
export default async function Kinder() {
  const child = await currentChild();
  return (
    <ChildHome
      name={child?.name}
      books={child ? (await listBooks(child.id)).filter((b) => !b.trashed) : []}
    />
  );
}
