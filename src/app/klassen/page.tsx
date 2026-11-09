import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { listClasses } from '@/lib/classes.mjs';
import { listBooks } from '@/lib/notebooks.mjs';
import Classroom from '@/components/Classroom';
export const dynamic = 'force-dynamic';
export default async function Klassen() {
  const user = await currentUser();
  if (!user) redirect('/anmelden');
  return (
    <Classroom
      initialClasses={await listClasses(user.id)}
      books={await listBooks(user.id)}
    />
  );
}
