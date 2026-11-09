import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import Link from 'next/link';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function Anmelden() {
  if (await currentUser()) redirect('/');
  return (
    <main className="seite">
      <div className="anmeldung">
        <h1 style={{ textAlign: 'center' }}>Grundschulbuch</h1>
        <LoginForm /><p style={{ textAlign: 'center' }}><Link className="knopf" href="/kinder">Kinder: mit Karte anmelden</Link></p>
      </div>
    </main>
  );
}
