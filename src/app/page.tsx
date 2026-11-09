import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export const dynamic = 'force-dynamic';

export default async function Regal() {
  const user = await currentUser();
  if (!user) redirect('/anmelden');

  return (
    <main className="seite">
      <header className="kopf">
        <h1>Mein Regal</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="hinweis">Angemeldet als {user.name}</span>
          <LogoutButton />
        </div>
      </header>
      <section className="karte leer">
        <p>Hier stehen bald deine Hefte.</p>
      </section>
    </main>
  );
}
