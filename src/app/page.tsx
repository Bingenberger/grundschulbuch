import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { listBooks } from '@/lib/notebooks.mjs';
import Shelf from '@/components/Shelf';
export const dynamic = 'force-dynamic';
export default async function Regal() {
  const user = await currentUser(); if (!user) redirect('/anmelden');
  return <Shelf initialBooks={await listBooks(user.id)} name={user.name} />;
}
