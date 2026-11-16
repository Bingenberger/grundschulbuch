import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { adminOverview } from '@/lib/admin';
import Verwaltung from '@/components/Verwaltung';
export const dynamic = 'force-dynamic';
export default async function VerwaltungSeite({searchParams}:{searchParams:Promise<{bereich?:string}>}) {
  const user = await currentUser();
  if (!user) redirect('/anmelden');
  if (user.role !== 'admin') redirect('/');
  return <Verwaltung initial={await adminOverview()} me={user.id} initialTab={(await searchParams).bereich==='vorlagen'?'vorlagen':'konten'} />;
}
