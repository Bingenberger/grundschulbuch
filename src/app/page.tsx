import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { currentChild } from '@/lib/child-auth';
import { listBooks } from '@/lib/notebooks.mjs';
import Shelf from '@/components/Shelf';
export const dynamic = 'force-dynamic';
export default async function Regal() {
  const user = await currentUser();
  // The installed app starts here: children who are signed in go to their notebooks.
  if (!user) redirect((await currentChild()) ? '/kinder' : '/anmelden');
  return <Shelf initialBooks={await listBooks(user.id)} name={user.name} />;
}
