'use client';

import { useState } from 'react';

type Mode = 'pin' | 'code';

export default function LoginForm() {
  const [mode, setMode] = useState<Mode>('pin');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [code, setCode] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setPin('');
    setRepeat('');
    setError(null);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === 'code' && pin !== repeat) {
      setError('Die beiden PINs stimmen nicht überein.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(mode === 'pin' ? '/api/anmelden' : '/api/erstzugang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'pin' ? { name, pin } : { name, code, pin }),
      });
      if (response.ok) {
        window.location.replace('/');
        return;
      }
      const data = await response.json().catch(() => null);
      setError(data?.error ?? 'Die Anmeldung hat nicht geklappt.');
    } catch {
      setError('Keine Verbindung zum Server.');
    }
    setBusy(false);
  };

  return (
    <form className="karte" onSubmit={submit}>
      <div className="reiter">
        <button type="button" className="knopf" aria-pressed={mode === 'pin'} onClick={() => switchMode('pin')}>Mit PIN</button>
        <button type="button" className="knopf" aria-pressed={mode === 'code'} onClick={() => switchMode('code')}>Mit Einmalcode</button>
      </div>

      <label className="feld">
        <span>Name</span>
        <input value={name} onChange={event => setName(event.target.value)} autoComplete="username" autoCapitalize="words" required />
      </label>

      {mode === 'code' && (
        <label className="feld">
          <span>Einmalcode</span>
          <input value={code} onChange={event => setCode(event.target.value)} autoComplete="one-time-code"
            autoCapitalize="characters" spellCheck={false} placeholder="XXXX-XXXX-XXXX" required />
        </label>
      )}

      <label className="feld">
        <span>{mode === 'pin' ? 'PIN' : 'Neue PIN (6 Ziffern)'}</span>
        <input type="password" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={pin}
          onChange={event => setPin(event.target.value.replace(/\D/g, ''))}
          autoComplete={mode === 'pin' ? 'current-password' : 'new-password'} required />
      </label>

      {mode === 'code' && (
        <label className="feld">
          <span>Neue PIN wiederholen</span>
          <input type="password" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={repeat}
            onChange={event => setRepeat(event.target.value.replace(/\D/g, ''))} autoComplete="new-password" required />
        </label>
      )}

      {error && <p className="fehler" role="alert">{error}</p>}

      <button className="knopf knopf-haupt" type="submit" disabled={busy} style={{ width: '100%' }}>
        {mode === 'pin' ? 'Anmelden' : 'PIN festlegen und anmelden'}
      </button>

      {mode === 'code' && (
        <p className="hinweis" style={{ marginBottom: 0 }}>
          Den Einmalcode für den ersten Zugang oder eine vergessene PIN erzeugt die Administration auf dem Server.
        </p>
      )}
    </form>
  );
}
