'use client';

import { useState } from 'react';

export default function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const logout = async () => {
    setBusy(true);
    await fetch('/api/abmelden', { method: 'POST' }).catch(() => null);
    window.location.replace('/anmelden');
  };
  return <button className="knopf" onClick={logout} disabled={busy}>Abmelden</button>;
}
