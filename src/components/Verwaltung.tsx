/* eslint-disable @next/next/no-img-element */
'use client';
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import Icon from './Icon';
import { ChoiceButton } from './ui/Choice';
import { Preview } from './editor/TemplateChooser';
import { categoryIcon, templateCatalog, type TemplateEntry } from './editor/page-templates';
import { starterTemplates } from '@/lib/generators';
import { qrDigest } from '@/lib/child-api';
import { uuid, type Template } from '@/lib/notebook-model';
import type { AdminOverview } from '@/lib/admin';
import type { AdminAccount } from '@/lib/accounts.mjs';
import type { SchoolClass } from '@/lib/classes.mjs';
import type { YoutubeSettings } from '@/lib/video-search.mjs';
import { templatePolicy, type TemplatePolicy, type TemplatePolicies } from '@/lib/template-policy.mjs';

type Tab = 'konten' | 'klassen' | 'vorlagen' | 'einstellungen';
type Slip = { name: string; code: string; expiresAt: string };
type Card = { name: string; qr: string };

async function admin<T>(action: string, values: object = {}): Promise<T> {
  const response = await fetch('/api/verwaltung', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, action }),
    cache: 'no-store',
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Anfrage fehlgeschlagen.');
  return result;
}

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' });

function accountState(a: AdminAccount) {
  if (a.blocked) return 'gesperrt';
  if (a.codeUntil) return `Einmalcode gültig bis ${dateTime(a.codeUntil)}`;
  if (!a.hasPin) return 'Einmalcode abgelaufen';
  return 'aktiv';
}

/**
 * Admin area: teacher accounts, classes with several teachers and their
 * children (with login cards), and the school-wide templates.
 */
export default function Verwaltung({ initial, me, initialTab='konten' }: { initial: AdminOverview; me: string; initialTab?:Tab }) {
  const [data, setData] = useState(initial);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [slip, setSlip] = useState<Slip | null>(null);
  const [cards, setCards] = useState<{ title: string; cards: Card[] } | null>(null);

  function showTab(next: Tab) {
    setTab(next);
    setError('');
    setMessage('');
  }
  async function run(task: () => Promise<void>) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await task();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const putAccount = (account: AdminAccount) =>
    setData((d) => ({ ...d, accounts: d.accounts.map((a) => (a.id === account.id ? account : a)) }));
  const putClass = (klass: SchoolClass) =>
    setData((d) => ({ ...d, classes: d.classes.some((c) => c.id === klass.id) ? d.classes.map((c) => (c.id === klass.id ? klass : c)) : [...d.classes, klass] }));

  return (
    <main className="seite class-page admin-page">
      <header className="kopf">
        <div>
          <Link href="/" className="admin-back-link"><Icon name="left" size={20}/> Mein Regal</Link>
          <h1>Verwaltung</h1>
        </div>
        <Link className="knopf" href="/klassen">
          <Icon name="conference_call" size={22} /> Meine Klassen
        </Link>
      </header>
      <nav className="reiter admin-tabs" aria-label="Bereiche der Verwaltung">
        <ChoiceButton icon="businesswoman" label={`Lehrkräfte (${data.accounts.length})`} pressed={tab === 'konten'} onClick={() => showTab('konten')} />
        <ChoiceButton icon="conference_call" label={`Klassen und Kinder (${data.classes.length})`} pressed={tab === 'klassen'} onClick={() => showTab('klassen')} />
        <ChoiceButton icon="template" label="Vorlagen für alle" pressed={tab === 'vorlagen'} onClick={() => showTab('vorlagen')} />
        <ChoiceButton icon="settings" label="Einstellungen" pressed={tab === 'einstellungen'} onClick={() => showTab('einstellungen')} />
      </nav>
      {error && (
        <p className="fehler" role="alert">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      {tab === 'konten' && <Accounts data={data} me={me} busy={busy} run={run} putAccount={putAccount} setData={setData} onSlip={setSlip} />}
      {tab === 'klassen' && (
        <Classes data={data} busy={busy} run={run} putClass={putClass} setData={setData} onCards={setCards} onMessage={setMessage} />
      )}
      {tab === 'einstellungen' && (
        <Settings
          youtube={data.youtube}
          busy={busy}
          run={run}
          onYoutube={(youtube) => setData((d) => ({ ...d, youtube }))}
          onMessage={setMessage}
        />
      )}
      {tab === 'vorlagen' && (
        <Templates
          data={data}
          busy={busy}
          run={run}
          setData={setData}
        />
      )}
      {slip && (
        <div className="modal-backdrop card-backdrop">
          <section className="modal printable-card access-slip" role="dialog" aria-modal="true" aria-labelledby="slip-title">
            <h2 id="slip-title">Zugang zum Grundschulbuch</h2>
            <dl>
              <dt>Adresse</dt>
              <dd>{typeof window !== 'undefined' ? `${window.location.origin}/anmelden` : '/anmelden'}</dd>
              <dt>Name</dt>
              <dd>{slip.name}</dd>
              <dt>Einmalcode</dt>
              <dd className="access-code">{slip.code}</dd>
              <dt>Gültig bis</dt>
              <dd>{dateTime(slip.expiresAt)}</dd>
            </dl>
            <p>Auf der Anmeldeseite „Mit Einmalcode“ wählen, Name und Code eingeben und eine eigene sechsstellige PIN festlegen.</p>
            <p className="no-print option-hint">Der Code wird nur jetzt angezeigt. Bitte drucken oder notieren.</p>
            <div className="dialog-actions no-print">
              <button className="knopf" onClick={() => setSlip(null)}>
                <Icon name="cancel" size={20}/> Schließen
              </button>
              <button className="knopf knopf-haupt" onClick={() => window.print()}>
                <Icon name="print" size={20}/> Zettel drucken
              </button>
            </div>
          </section>
        </div>
      )}
      {cards && (
        <div className="modal-backdrop card-backdrop">
          <section className="modal card-sheet" role="dialog" aria-modal="true" aria-labelledby="cards-title">
            <h2 id="cards-title" className="no-print">
              Anmeldekarten · {cards.title}
            </h2>
            <div className="card-grid">
              {cards.cards.map((card) => (
                <figure key={card.qr} className="login-card">
                  <img src={card.qr} alt={`Anmeldekarte für ${card.name}`} width="180" height="180" />
                  <figcaption>
                    <strong>{card.name}</strong>
                    <small>Grundschulbuch · {cards.title}</small>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="no-print option-hint">Die Karten werden nur jetzt angezeigt. Ältere Karten dieser Kinder gelten nicht mehr.</p>
            <div className="dialog-actions no-print">
              <button className="knopf" onClick={() => setCards(null)}>
                <Icon name="cancel" size={20}/> Schließen
              </button>
              <button className="knopf knopf-haupt" onClick={() => window.print()}>
                <Icon name="print" size={20}/> Karten drucken
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

type Shared = {
  data: AdminOverview;
  busy: boolean;
  run: (task: () => Promise<void>) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<AdminOverview>>;
};

function Accounts({
  data,
  me,
  busy,
  run,
  putAccount,
  setData,
  onSlip,
}: Shared & { me: string; putAccount: (a: AdminAccount) => void; onSlip: (s: Slip) => void }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'lehrkraft' | 'admin'>('lehrkraft');
  const classesOf = (id: string) => data.classes.filter((c) => c.teacherIds.includes(id)).map((c) => c.title);
  return (
    <>
      <section className="karte class-section">
        <h2>Neue Lehrkraft</h2>
        <p>Das Konto bekommt einen Einmalcode (7 Tage gültig). Damit legt die Lehrkraft bei der ersten Anmeldung ihre PIN fest.</p>
        <form
          className="child-create"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              const result = await admin<{ account: AdminAccount; code: string; expiresAt: string }>('createAccount', { name, role });
              setData((d) => ({ ...d, accounts: [...d.accounts, result.account].sort((a, b) => a.name.localeCompare(b.name, 'de')) }));
              onSlip({ name: result.account.name, code: result.code, expiresAt: result.expiresAt });
              setName('');
              setRole('lehrkraft');
            });
          }}
        >
          <input aria-label="Name der Lehrkraft" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Name, z. B. Frau Müller" required />
          <ChoiceButton icon="businesswoman" label="Lehrkraft" pressed={role === 'lehrkraft'} onClick={() => setRole('lehrkraft')} />
          <ChoiceButton icon="privacy" label="Admin" pressed={role === 'admin'} onClick={() => setRole('admin')} />
          <button className="knopf knopf-haupt" disabled={busy}>
            <Icon name="plus" size={20} /> Konto anlegen
          </button>
        </form>
      </section>
      <section className="karte class-section">
        <h2>Alle Konten</h2>
        <div className="child-list">
          {data.accounts.map((a) => {
            const classes = classesOf(a.id);
            return (
              <article key={a.id} className={`child-row ${a.blocked ? 'is-blocked' : ''}`}>
                <label>
                  <strong>{a.name}</strong> {a.role === 'admin' && <span className="badge">Admin</span>}
                  {a.id === me && <span className="badge">du</span>}
                </label>
                <small>
                  {accountState(a)}
                  {classes.length ? ` · Klassen: ${classes.join(', ')}` : ''}
                </small>
                <div className="child-row-actions">
                  <button
                    className="knopf compact"
                    disabled={busy}
                    onClick={() => {
                      const next = prompt('Name des Kontos', a.name);
                      if (next?.trim() && next !== a.name) void run(async () => putAccount(await admin('renameAccount', { id: a.id, name: next })));
                    }}
                  >
                    <Icon name="signature" size={20}/> Umbenennen
                  </button>
                  <button
                    className="knopf compact"
                    disabled={busy || a.blocked}
                    title="Für die erste Anmeldung oder eine vergessene PIN"
                    onClick={() =>
                      run(async () => {
                        const result = await admin<{ account: AdminAccount; code: string; expiresAt: string }>('resetCode', { id: a.id });
                        putAccount(result.account);
                        onSlip({ name: result.account.name, code: result.code, expiresAt: result.expiresAt });
                      })
                    }
                  >
                    <Icon name="privacy" size={20}/> Neuer Einmalcode
                  </button>
                  <button
                    className="knopf compact"
                    disabled={busy || a.id === me}
                    onClick={() => run(async () => putAccount(await admin('setRole', { id: a.id, role: a.role === 'admin' ? 'lehrkraft' : 'admin' })))}
                  >
                    <Icon name="privacy" size={20}/><span>{a.role === 'admin' ? 'Admin-Rechte entziehen' : 'Zum Admin machen'}</span>
                  </button>
                  <button
                    className="knopf compact"
                    disabled={busy || a.id === me}
                    onClick={() => {
                      if (a.blocked || confirm(`Konto „${a.name}“ sperren? Die Lehrkraft wird sofort abgemeldet; ihre Hefte bleiben erhalten.`))
                        void run(async () => putAccount(await admin('block', { id: a.id, blocked: !a.blocked })));
                    }}
                  >
                    <Icon name={a.blocked?'unlock':'lock'} size={20}/>{a.blocked ? 'Entsperren' : 'Sperren'}
                  </button>
                  {!a.hasPin && a.id !== me && (
                    <button
                      className="knopf compact danger-text"
                      disabled={busy}
                      onClick={() => {
                        if (confirm(`Unbenutztes Konto „${a.name}“ löschen?`))
                          void run(async () => {
                            await admin('deleteAccount', { id: a.id });
                            setData((d) => ({
                              ...d,
                              accounts: d.accounts.filter((x) => x.id !== a.id),
                              classes: d.classes.map((c) => ({ ...c, teacherIds: c.teacherIds.filter((t) => t !== a.id) })),
                            }));
                          });
                      }}
                    >
                      <Icon name="empty_trash" size={20}/> Löschen
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function TeacherToggles({ accounts, chosen, disabled, onChange }: { accounts: AdminAccount[]; chosen: string[]; disabled?: boolean; onChange: (ids: string[]) => void }) {
  if (!accounts.length) return <p className="option-hint">Noch keine Lehrkräfte angelegt.</p>;
  return (
    <div className="choice-row">
      {accounts.map((a) => (
        <ChoiceButton
          key={a.id}
          icon={chosen.includes(a.id) ? 'checkmark' : 'businesswoman'}
          label={a.name}
          pressed={chosen.includes(a.id)}
          disabled={disabled}
          onClick={() => onChange(chosen.includes(a.id) ? chosen.filter((t) => t !== a.id) : [...chosen, a.id])}
        />
      ))}
    </div>
  );
}

function Classes({
  data,
  busy,
  run,
  putClass,
  setData,
  onCards,
  onMessage,
}: Shared & { putClass: (c: SchoolClass) => void; onCards: (c: { title: string; cards: Card[] }) => void; onMessage: (m: string) => void }) {
  const [activeId, setActiveId] = useState(data.classes[0]?.id || '');
  const [title, setTitle] = useState('');
  const [teachers, setTeachers] = useState<string[]>([]);
  const [names, setNames] = useState('');
  const [moving, setMoving] = useState('');
  const active = data.classes.find((c) => c.id === activeId);
  const usable = data.accounts.filter((a) => !a.blocked);
  const teacherName = (id: string) => data.accounts.find((a) => a.id === id)?.name || 'unbekannt';
  const change = async (values: object) => putClass(await admin<SchoolClass>('changeClass', { id: activeId, ...values }));

  /** New QR cards for the given children; shown once to print. */
  async function makeCards(klass: SchoolClass, children: SchoolClass['children']) {
    const made: Card[] = [];
    let latest = klass;
    for (const child of children) {
      const value = `grundschulbuch:${uuid()}:${uuid()}`;
      latest = await admin<SchoolClass>('changeClass', { id: klass.id, childId: child.id, digest: await qrDigest(value) });
      made.push({ name: child.name, qr: await QRCode.toDataURL(value, { width: 400, margin: 3 }) });
    }
    putClass(latest);
    onCards({ title: klass.title, cards: made });
  }

  return (
    <>
      <section className="karte class-section">
        <h2>Neue Klasse</h2>
        <form
          className="child-create"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              const klass = await admin<SchoolClass>('createClass', { title, teacherIds: teachers });
              putClass(klass);
              setActiveId(klass.id);
              setTitle('');
              setTeachers([]);
            });
          }}
        >
          <input aria-label="Name der neuen Klasse" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} placeholder="Neue Klasse, z. B. 1a" required />
          <button className="knopf knopf-haupt" disabled={busy}>
            <Icon name="plus" size={20}/> Klasse anlegen
          </button>
        </form>
        <p>Lehrkräfte der neuen Klasse:</p>
        <TeacherToggles accounts={usable} chosen={teachers} disabled={busy} onChange={setTeachers} />
      </section>
      <nav className="reiter class-tabs" aria-label="Klassen">
        {data.classes.map((c) => (
          <button
            key={c.id}
            className="knopf"
            aria-pressed={activeId === c.id}
            onClick={() => {
              setActiveId(c.id);
              setMoving('');
            }}
          >
            <Icon name={c.archived?'filing_cabinet':'conference_call'} size={20}/>{c.title}
            {c.archived ? ' · archiviert' : ''}
          </button>
        ))}
      </nav>
      {active && (
        <>
          <section className="karte class-section">
            <header className="kopf">
              <h2>{active.title}</h2>
              <div className="child-row-actions">
                <button
                  className="knopf"
                  disabled={busy}
                  onClick={() => {
                    const next = prompt('Name der Klasse', active.title);
                    if (next?.trim() && next !== active.title) void run(() => change({ title: next }));
                  }}
                >
                  <Icon name="signature" size={20}/> Umbenennen
                </button>
                <button className="knopf" disabled={busy} onClick={() => run(() => change({ archived: !active.archived }))}>
                  <Icon name={active.archived?'import':'filing_cabinet'} size={20}/>{active.archived ? 'Klasse aktivieren' : 'Archivieren'}
                </button>
              </div>
            </header>
            <p>Lehrkräfte dieser Klasse (alle sehen die Kinder und können Hefte austeilen):</p>
            <TeacherToggles
              accounts={data.accounts.filter((a) => !a.blocked || active.teacherIds.includes(a.id))}
              chosen={active.teacherIds}
              disabled={busy}
              onChange={(teacherIds) => run(() => change({ teacherIds }))}
            />
          </section>
          <section className="karte class-section">
            <h2>Kinder ({active.children.length})</h2>
            <form
              className="child-create child-bulk"
              onSubmit={(e) => {
                e.preventDefault();
                const list = names.split(/\r?\n|;/).map((n) => n.trim()).filter(Boolean);
                if (list.length)
                  void run(async () => {
                    await change({ addChildren: list });
                    setNames('');
                    onMessage(`${list.length} ${list.length === 1 ? 'Kind' : 'Kinder'} hinzugefügt.`);
                  });
              }}
            >
              <textarea
                aria-label="Namen der Kinder, einer pro Zeile"
                value={names}
                rows={4}
                onChange={(e) => setNames(e.target.value)}
                placeholder={'Vornamen oder Kürzel, einer pro Zeile\nAda\nBen'}
              />
              <button className="knopf" disabled={busy || !names.trim()}>
                <Icon name="plus" size={20} /> Kinder hinzufügen
              </button>
            </form>
            <div className="child-row-actions">
              <button
                className="knopf"
                disabled={busy || !active.children.some((c) => !c.hasCard)}
                onClick={() => run(() => makeCards(active, active.children.filter((c) => !c.hasCard)))}
              >
                <Icon name="camera" size={20} /> Karten für alle ohne Karte
              </button>
            </div>
            <div className="child-list">
              {active.children.map((child) => (
                <article key={child.id} className="child-row">
                  <label>
                    <strong>{child.name}</strong>
                  </label>
                  <small className="admin-icon-text"><Icon name={child.hasCard?'checkmark':'privacy'} size={18}/>{child.hasCard ? 'Karte zugeordnet' : 'Noch keine Karte'}</small>
                  <div className="child-row-actions">
                    <button
                      className="knopf compact"
                      disabled={busy}
                      onClick={() => {
                        const next = prompt('Vorname oder Kürzel', child.name);
                        if (next?.trim() && next !== child.name) void run(() => change({ childId: child.id, childName: next }));
                      }}
                    >
                      <Icon name="signature" size={20}/> Umbenennen
                    </button>
                    <button
                      className="knopf compact"
                      disabled={busy}
                      onClick={() => {
                        if (!child.hasCard || confirm(`Neue Karte für ${child.name}? Die alte Karte gilt dann nicht mehr.`))
                          void run(() => makeCards(active, [child]));
                      }}
                    >
                      <Icon name="camera" size={20}/>{child.hasCard ? 'Neue Karte' : 'Karte erzeugen'}
                    </button>
                    <button
                      className="knopf compact"
                      disabled={busy || data.classes.length < 2}
                      aria-pressed={moving === child.id}
                      onClick={() => setMoving(moving === child.id ? '' : child.id)}
                    >
                      <Icon name="share" size={20}/> In andere Klasse
                    </button>
                    <button
                      className="knopf compact danger-text"
                      disabled={busy}
                      onClick={() => {
                        if (confirm(`${child.name} und alle Hefte des Kindes endgültig löschen?`)) void run(() => change({ removeChild: child.id }));
                      }}
                    >
                      <Icon name="empty_trash" size={20}/> Entfernen
                    </button>
                  </div>
                  {moving === child.id && (
                    <div className="choice-row move-targets">
                      {data.classes
                        .filter((c) => c.id !== active.id)
                        .map((c) => (
                          <ChoiceButton
                            key={c.id}
                            icon="conference_call"
                            label={c.title}
                            disabled={busy}
                            onClick={() =>
                              run(async () => {
                                const classes = await admin<SchoolClass[]>('moveChild', { childId: child.id, targetId: c.id });
                                setData((d) => ({ ...d, classes }));
                                setMoving('');
                                onMessage(`${child.name} ist jetzt in ${c.title}. Hefte und Karte bleiben erhalten.`);
                              })
                            }
                          />
                        ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
          <section className="class-section">
            <p className="option-hint">Lehrkräfte: {active.teacherIds.map(teacherName).join(', ') || 'noch keine'}</p>
            <button
              className="knopf danger-text"
              disabled={busy}
              onClick={() => {
                if (confirm(`Klasse „${active.title}“, alle Kinder und deren Hefte endgültig löschen?`))
                  void run(async () => {
                    await admin('deleteClass', { id: active.id });
                    setData((d) => ({ ...d, classes: d.classes.filter((c) => c.id !== active.id) }));
                    setActiveId('');
                  });
              }}
            >
              <Icon name="empty_trash" size={20}/> Klasse löschen
            </button>
          </section>
        </>
      )}
    </>
  );
}

const STORED = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function Templates({ data, busy, run, setData }: Shared) {
  const [category, setCategory] = useState('Alle');
  const [scope,setScope] = useState('');
  const [query, setQuery] = useState('');
  const [status,setStatus] = useState('all');
  const [page,setPage] = useState(1);
  const [view,setView] = useState<'groups'|'list'>('groups');
  const [expanded,setExpanded] = useState<Set<string>>(()=>new Set());
  const listRef=useRef<HTMLDivElement>(null);
  const pageSize=20;
  const saved: Template[] = useMemo(
    () => [
      ...starterTemplates().map((t, i) => ({ ...t, id: `start-${i}`, school: true })),
      ...data.templates.map((t) => ({ ...t, school: true })),
    ],
    [data.templates],
  );
  const entries = useMemo(() => templateCatalog(saved, data.hidden, true), [saved, data.hidden]);
  const categories = useMemo(() => [...new Set(entries.map((e) => e.category))].sort((a,b)=>a.localeCompare(b,'de')), [entries]);
  const words = query.trim().toLocaleLowerCase('de').split(/\s+/).filter(Boolean);
  const shown = entries.filter(
    (e) => {
      const enabled=templatePolicy(data.policies,data.hidden,e.key,scope).enabled;
      const local=scope ? data.policies.classes[scope]?.[e.key] : undefined;
      return (category==='Alle'||e.category===category) &&
        (status==='all'||(status==='enabled'&&enabled)||(status==='disabled'&&!enabled)||(status==='overrides'&&!!local&&Object.keys(local).length>0)) &&
        words.every(word=>`${e.title} ${e.words}`.toLocaleLowerCase('de').includes(word));
    },
  );
  const pages=Math.max(1,Math.ceil(shown.length/pageSize)),currentPage=Math.min(page,pages);
  const visible=shown.slice((currentPage-1)*pageSize,currentPage*pageSize);
  const groups=categories.filter(c=>shown.some(e=>e.category===c));
  const scopeTitle=scope ? data.classes.find(c=>c.id===scope)?.title||'Klasse' : 'Ganze Schule';
  const modeLabel=(mode:TemplatePolicy['insertion'])=>mode==='fixed'?'Fest positioniert':mode==='editable'?'Bearbeitbar':'Sperren der Vorlage';
  const own = (e: TemplateEntry) => !!e.schoolId && STORED.test(e.schoolId);

  /** Open the actual template; its editor never creates a shelf notebook. */
  async function edit(entry: TemplateEntry | null) {
    window.location.assign(`/verwaltung/vorlagen/${encodeURIComponent(entry?.key||'neu')}`);
  }
  async function changePolicy(key:string,patch:{enabled?:boolean|null;insertion?:TemplatePolicy['insertion']|null}) {
    const result=await admin<{policies:TemplatePolicies;hidden:string[]}>('templatePolicy',{key,classId:scope||null,patch});
    setData(d=>({...d,...result}));
  }
  function renderEntry(entry: TemplateEntry) {
          const effective = templatePolicy(data.policies,data.hidden,entry.key,scope);
          const hidden = !effective.enabled;
          const local = scope ? data.policies.classes[scope]?.[entry.key] : data.policies.global[entry.key];
          const global = templatePolicy(data.policies,data.hidden,entry.key);
          return (
            <article key={entry.key} className={`karte admin-template ${hidden ? 'is-hidden' : ''}`} aria-label={`Vorlage: ${entry.title}`}>
              <Preview entry={entry} orientation={entry.orientation || 'landscape'} />
              <div className="admin-template-info">
                <h3>{entry.title}</h3><p>{entry.category}{entry.configure?' · Einstellbar':''}{entry.replaced ? ' · geändert' : own(entry) ? ' · Schulvorlage' : ''}</p>
                <div className="admin-template-badges"><span className={`admin-template-status ${hidden?'is-disabled':''}`}><Icon name={hidden?'lock':'checkmark'} size={14}/>{hidden?'Gesperrt · ausgeblendet':'Freigegeben'}</span>
                {scope&&<span className="admin-template-inheritance">{local&&Object.keys(local).length?'Klassen-Ausnahme':'Schulvorgabe'}</span>}</div>
              </div>
              <div className="admin-template-settings">
              <label>Freigabe
                <select aria-label={`Freigabe: ${entry.title}`} disabled={busy} value={scope ? (local?.enabled===undefined?'inherit':String(local.enabled)) : String(effective.enabled)}
                  onChange={e=>void run(()=>changePolicy(entry.key,{enabled:e.target.value==='inherit'?null:e.target.value==='true'}))}>
                  {scope&&<option value="inherit">Schulvorgabe</option>}
                  <option value="true">Freigegeben</option><option value="false">Gesperrt</option>
                </select>
                {scope&&local?.enabled===undefined&&<small>{global.enabled?'Freigegeben':'Gesperrt'}</small>}
              </label>
              <label>Beim Einfügen
                <select aria-label={`Einfügeart: ${entry.title}`} disabled={busy} value={scope ? (local?.insertion||'inherit') : effective.insertion}
                  onChange={e=>void run(()=>changePolicy(entry.key,{insertion:e.target.value==='inherit'?null:e.target.value as TemplatePolicy['insertion']}))}>
                  {scope&&<option value="inherit">Schulvorgabe</option>}
                  <option value="template">Wie in der Vorlage</option><option value="editable">Bearbeitbar</option><option value="fixed">Fest positioniert</option>
                </select>
                <small>{scope&&local?.insertion===undefined?modeLabel(global.insertion):effective.insertion==='template'?'Bestehende Sperren beibehalten':effective.insertion==='fixed'?'Elemente nicht verschiebbar':'Elemente entsperrt'}</small>
              </label>
              </div>
              <div className="admin-template-actions">
                {!entry.configure && (
                  <button className="knopf compact" disabled={busy} onClick={() => run(() => edit(entry))}>
                    <Icon name="edit_image" size={18}/> <span>Bearbeiten</span>
                  </button>
                )}
                {(entry.replaced || own(entry)) && entry.schoolId && (
                  <button
                    className="knopf compact danger-text"
                    disabled={busy}
                    onClick={() => {
                      if (confirm(entry.replaced ? `Änderungen an „${entry.title}“ verwerfen und das Original wiederherstellen?` : `Schulvorlage „${entry.title}“ löschen?`))
                        void run(async () => {
                          await admin('removeTemplate', { templateId: entry.schoolId });
                          setData((d) => ({ ...d, templates: d.templates.filter((t) => t.id !== entry.schoolId) }));
                        });
                    }}
                  >
                    <Icon name={entry.replaced?'undo':'empty_trash'} size={18}/><span>{entry.replaced ? 'Original wiederherstellen' : 'Löschen'}</span>
                  </button>
                )}
              </div>
            </article>
          );

  }
  function pagination(position:string) {
    const changePage=(next:number)=>{setPage(next);requestAnimationFrame(()=>listRef.current?.scrollIntoView({block:'start'}));};
    return <nav className="admin-template-pagination" aria-label={`Vorlagenseiten ${position}`}>
      <button className="knopf compact" disabled={currentPage===1||busy} onClick={()=>changePage(currentPage-1)} aria-label="Vorherige Vorlagenseite"><Icon name="left" size={18}/></button>
      <span>Seite {currentPage} von {pages}</span>
      <button className="knopf compact" disabled={currentPage===pages||busy} onClick={()=>changePage(currentPage+1)} aria-label="Nächste Vorlagenseite"><Icon name="right" size={18}/></button>
    </nav>;
  }

  return (
    <>
      <section className="karte admin-template-toolbar" aria-labelledby="admin-template-title">
        <div className="admin-template-heading">
          <div><h2 id="admin-template-title">Vorlagen verwalten</h2><p>Freigabe und Einfügeart für die Schule oder eine Klasse festlegen.</p></div>
          <button className="knopf knopf-haupt" disabled={busy} onClick={() => run(() => edit(null))}>
            <Icon name="plus" size={20} /> Neue Schulvorlage gestalten
          </button>
        </div>
        <div className="admin-template-filters">
        <label><span className="admin-icon-text"><Icon name="conference_call" size={18}/> Vorgaben für</span>
          <select aria-label="Vorlagen verwalten für" value={scope} disabled={busy} onChange={e=>{setScope(e.target.value);setPage(1);if(status==='overrides')setStatus('all');}}>
            <option value="">Ganze Schule</option>
            {data.classes.map(c=><option key={c.id} value={c.id}>{c.title}{c.archived?' (archiviert)':''}</option>)}
          </select>
        </label>
        <label className="admin-template-search"><span className="admin-icon-text"><Icon name="search" size={18}/> Suche</span>
          <input type="search" aria-label="Vorlagen durchsuchen" placeholder="Name oder Stichwort" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);setExpanded(new Set(e.target.value.trim()?categories:category==='Alle'?[]:[category]));}}/>
        </label>
        <label><span className="admin-icon-text"><Icon name="folder" size={18}/> Kategorie</span>
          <select aria-label="Vorlagenkategorie" value={category} onChange={e=>{setCategory(e.target.value);setPage(1);setExpanded(new Set(e.target.value==='Alle'?(query.trim()?categories:[]):[e.target.value]));}}>
            <option value="Alle">Alle Kategorien</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label><span className="admin-icon-text"><Icon name="filled_filter" size={18}/> Freigabe filtern</span>
          <select aria-label="Vorlagen nach Freigabe filtern" value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}}>
            <option value="all">Alle Freigaben</option><option value="enabled">Freigegeben</option><option value="disabled">Gesperrt</option>
            {scope&&<option value="overrides">Klassen-Ausnahmen</option>}
          </select>
        </label>
        </div>
        <details className="admin-template-help"><summary><Icon name="right" size={16} className="admin-help-chevron"/><span className="admin-icon-text"><Icon name="faq" size={18}/> So funktionieren Vorlagen und Vorgaben</span></summary>
          <p>Klassen erben die Schulvorgaben und können davon abweichen. Die Einfügeart gilt für neue Übernahmen; vorhandene Seiten bleiben erhalten. „Fest positioniert“ sperrt die Elemente gegen Verschieben und Größenänderungen.</p>
          <p>„Bearbeiten“ öffnet die Vorlage direkt. Änderungen ersetzen die bisherige Fassung; im Regal wird kein Heft angelegt. Die Gestaltung gilt für alle Klassen.</p>
        </details>
      </section>
      <div className="admin-template-results">
        <div><strong>{scopeTitle}</strong><p role="status">{!shown.length?'Keine passenden Vorlagen':view==='groups'?`${shown.length} Vorlagen in ${groups.length} ${groups.length===1?'Gruppe':'Gruppen'}`:`${(currentPage-1)*pageSize+1}–${Math.min(currentPage*pageSize,shown.length)} von ${shown.length} Vorlagen`}</p></div>
        <div className="admin-template-view-controls">
          <div className="admin-template-view" role="group" aria-label="Vorlagenansicht">
            <button className="knopf compact" aria-pressed={view==='groups'} onClick={()=>setView('groups')}><Icon name="folder" size={18}/> Gruppen</button>
            <button className="knopf compact" aria-pressed={view==='list'} onClick={()=>{setView('list');setPage(1);}}><Icon name="list" size={18}/> Liste</button>
          </div>
          {view==='groups'&&groups.length>0&&<button className="knopf compact" onClick={()=>setExpanded(groups.every(g=>expanded.has(g))?new Set():new Set(groups))}><Icon name={groups.every(g=>expanded.has(g))?'folder':'opened_folder'} size={18}/>{groups.every(g=>expanded.has(g))?'Alle Gruppen schließen':'Alle Gruppen öffnen'}</button>}
          {view==='list'&&shown.length>pageSize&&pagination('oben')}
        </div>
      </div>
      {!shown.length&&<div className="karte admin-template-empty"><p>Keine Vorlage passt zu diesen Filtern.</p><button className="knopf" onClick={()=>{setQuery('');setCategory('Alle');setStatus('all');setPage(1);setExpanded(new Set());}}><Icon name="clear_filters" size={20}/> Filter zurücksetzen</button></div>}
      <div ref={listRef}>
      {view==='groups'?<div className="admin-template-groups" aria-label="Vorlagengruppen">
        {groups.map((name,index)=>{
          const items=shown.filter(e=>e.category===name),open=expanded.has(name),panelId=`admin-template-group-${index}`;
          return <section key={name} className="admin-template-group" aria-label={`Vorlagengruppe: ${name}`}>
            <h3><button type="button" aria-expanded={open} aria-controls={panelId} onClick={()=>setExpanded(previous=>{const next=new Set(previous);if(next.has(name))next.delete(name);else next.add(name);return next;})}>
              <Icon name={open?'down':'right'} size={18}/><Icon name={categoryIcon(name)} size={24}/><span>{name}</span><small>{items.length} {items.length===1?'Vorlage':'Vorlagen'}</small>
            </button></h3>
            <div id={panelId} hidden={!open} className="admin-templates">{open&&items.map(renderEntry)}</div>
          </section>;
        })}
      </div>:<div className="admin-templates" aria-label="Vorlagenliste">
        {visible.map(renderEntry)}
      </div>}
      </div>
      {view==='list'&&shown.length>pageSize&&<div className="admin-template-footer">{pagination('unten')}</div>}
    </>
  );
}

/** Settings for the whole instance: the key for the YouTube video search. */
function Settings({
  youtube,
  busy,
  run,
  onYoutube,
  onMessage,
}: {
  youtube: YoutubeSettings;
  busy: boolean;
  run: (task: () => Promise<void>) => Promise<void>;
  onYoutube: (youtube: YoutubeSettings) => void;
  onMessage: (message: string) => void;
}) {
  const [key, setKey] = useState('');
  const save = (values: { key?: string; childSearch?: boolean }, done: string) =>
    run(async () => {
      const result = await admin<YoutubeSettings & { warning: string }>('youtube', values);
      const { warning, ...settings } = result;
      onYoutube(settings);
      setKey('');
      onMessage(warning || done);
    });
  return (
    <section className="karte class-section admin-settings">
      <h2>YouTube-Videosuche</h2>
      <p>
        Mit einem API-Schlüssel für die YouTube Data API v3 können alle Lehrkräfte im Dialog „Video oder Webseite einfügen“ direkt
        nach Videos suchen. Der Schlüssel gilt für die ganze Schule, bleibt auf dem Server und wird nie an Geräte gesendet.
      </p>
      <p className="admin-settings-state" role="status">
        <Icon name={youtube.configured ? 'ok' : 'high_priority'} size={22} />{' '}
        {youtube.configured
          ? `Eingerichtet – Schlüssel endet auf „…${youtube.keyEnd}“${youtube.source === 'datei' ? ' (aus YOUTUBE_API_KEY_FILE)' : ''}${youtube.updatedAt ? `, geändert ${dateTime(youtube.updatedAt)}` : ''}.`
          : 'Noch nicht eingerichtet. Ohne Schlüssel lassen sich Videos weiterhin über ihre Adresse einfügen.'}
      </p>
      <form
        className="child-create"
        onSubmit={(e) => {
          e.preventDefault();
          void save({ key }, 'Der Schlüssel wurde geprüft und gespeichert.');
        }}
      >
        <input
          type="password"
          aria-label="API-Schlüssel für YouTube"
          autoComplete="off"
          spellCheck={false}
          value={key}
          maxLength={200}
          onChange={(e) => setKey(e.target.value)}
          placeholder={youtube.configured ? 'Neuen Schlüssel einfügen' : 'API-Schlüssel einfügen, z. B. AIza…'}
          required
        />
        <button className="knopf knopf-haupt" disabled={busy || !key.trim()}>
          <Icon name="checkmark" size={20} /> Prüfen und speichern
        </button>
        {youtube.configured && youtube.source === 'verwaltung' && (
          <button
            type="button"
            className="knopf danger-text"
            disabled={busy}
            onClick={() => {
              if (confirm('YouTube-Schlüssel entfernen? Die Videosuche ist dann für alle abgeschaltet.'))
                void save({ key: '' }, 'Der Schlüssel wurde entfernt.');
            }}
          >
            Schlüssel entfernen
          </button>
        )}
      </form>
      <div className="admin-settings-switch">
        <ChoiceButton
          icon="conference_call"
          label="Kinder mit „Internet“ dürfen Videos suchen"
          pressed={youtube.childSearch}
          disabled={busy}
          onClick={() =>
            void save(
              { childSearch: !youtube.childSearch },
              youtube.childSearch ? 'Kinder können nicht mehr suchen.' : 'Kinder mit „Internet“ können jetzt Videos suchen.',
            )
          }
        />
        <small>
          {youtube.childSearch
            ? 'An: Kinder, denen „Internet“ erlaubt ist, können im Heft selbst suchen (SafeSearch „streng“).'
            : 'Aus: Nur Lehrkräfte suchen. Kinder fügen Videos weiter über die Adresse ein.'}
        </small>
      </div>
      <details className="admin-settings-help">
        <summary>So bekommst du einen Schlüssel</summary>
        <ol>
          <li>In der Google Cloud Console (console.cloud.google.com) ein Projekt anlegen oder wählen.</li>
          <li>Unter „APIs und Dienste“ → „Bibliothek“ die „YouTube Data API v3“ aktivieren.</li>
          <li>Unter „Anmeldedaten“ → „Anmeldedaten erstellen“ → „API-Schlüssel“ wählen.</li>
          <li>Den Schlüssel unter „API-Einschränkungen“ auf die YouTube Data API v3 beschränken und hier einfügen.</li>
        </ol>
        <p>
          Eine Suche kostet 100 von 10.000 kostenlosen Einheiten am Tag – also etwa 100 Suchen täglich für die ganze Schule. Gleiche
          Suchen werden sechs Stunden lang zwischengespeichert, und jedes Konto kann höchstens 30-mal in der Stunde suchen. Gesucht wird
          mit SafeSearch „streng“ und nur nach Videos, die sich einbetten lassen.
        </p>
      </details>
    </section>
  );
}
