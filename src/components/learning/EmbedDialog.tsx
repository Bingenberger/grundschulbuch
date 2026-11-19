/* eslint-disable @next/next/no-img-element -- Preview pictures come from our own server. */
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from '../Icon';
import { ChoiceButton, OptionGroup } from '../ui/Choice';
import { uuid, type PageElement } from '@/lib/notebook-model';
import { autoplayAddress, detectVideo, hostOf, MEDIATHEK_NAMES, VIDEO_SOURCES, webAddress } from '@/lib/video-address.mjs';
import type { VideoHit, VideoSearchResult } from '@/lib/video-search.mjs';

type Mode = 'address' | 'search' | 'qr' | 'app';
type Duration = 'any' | 'short' | 'medium' | 'long';
type Order = 'relevance' | 'date' | 'viewCount';

async function internet<T>(action: string, values: object = {}): Promise<T> {
  const response = await fetch('/api/internet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, action }),
    cache: 'no-store',
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Das hat nicht geklappt.');
  return result as T;
}

/** 754 s → „12:34“, 3725 s → „1:02:05“. */
export function clock(seconds: number) {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600),
    m = Math.floor((seconds % 3600) / 60),
    s = seconds % 60;
  const two = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${two(m)}:${two(s)}` : `${m}:${two(s)}`;
}

const DURATION_OPTIONS: [Duration, string][] = [
  ['any', 'Alle Längen'],
  ['short', 'Kurz (unter 4 Min.)'],
  ['medium', 'Mittel (4–20 Min.)'],
  ['long', 'Lang (über 20 Min.)'],
];
const ORDER_OPTIONS: [Order, string, 'like' | 'clock' | 'positive_dynamic'][] = [
  ['relevance', 'Passendste', 'like'],
  ['date', 'Neueste', 'clock'],
  ['viewCount', 'Meistgesehen', 'positive_dynamic'],
];

/**
 * „Video oder Webseite einfügen“ as in Lernsachen-Heft: one address field, the
 * notebook recognises videos (YouTube, Vimeo, ZDF, video files) and web pages
 * by itself, fetches title and preview picture, web pages appear as a card or
 * directly in the notebook. In addition a YouTube search (set up in the admin
 * area), QR posters and, for teachers, own HTML apps.
 */
export default function EmbedDialog({
  element,
  onInsert,
  onClose,
  child = false,
}: {
  /** Element to change („Ändern“); otherwise a new one is inserted. */
  element?: PageElement;
  onInsert: (el: PageElement) => void;
  onClose: () => void;
  /** Children embed videos, web pages, links and QR posters, but no own HTML apps. */
  child?: boolean;
}) {
  const editing = !!element;
  const [mode, setMode] = useState<Mode>(element?.embedKind === 'qr' ? 'qr' : element?.embedKind === 'app' ? 'app' : 'address');
  const [input, setInput] = useState(element?.url ?? '');
  const [title, setTitle] = useState(element?.alt ?? '');
  const titleTouched = useRef(!!element?.alt);
  const [showPage, setShowPage] = useState(element?.embedKind === 'webpage');
  /** A ZDF address that is no video after all („Als Webseite einfügen“). */
  const [asPage, setAsPage] = useState(!!element?.url && element.embedKind !== 'video' && !!detectVideo(element.url));
  const [thumb, setThumb] = useState(element?.poster ?? '');
  /** Own player of the ARD/ZDF Mediathek, if the broadcaster allows it for this video. */
  const [player, setPlayer] = useState(element?.url && detectVideo(element.url)?.embed ? element.url : '');
  /** Address whose details have arrived (the Mediathek note waits for them). */
  const [checked, setChecked] = useState(element?.url ?? '');
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [app, setApp] = useState<File | null>(null);
  const [searchReady, setSearchReady] = useState<{ search: boolean; admin: boolean } | null>(null);
  // Search
  const [query, setQuery] = useState('');
  const [duration, setDuration] = useState<Duration>('any');
  const [order, setOrder] = useState<Order>('relevance');
  const [hits, setHits] = useState<VideoHit[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [searched, setSearched] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [playing, setPlaying] = useState('');
  const [chosen, setChosen] = useState('');

  const address = mode === 'qr' ? webAddress(input) : mode === 'address' ? webAddress(input) : null;
  const detected = address ? detectVideo(address) : null;
  const video = asPage ? null : detected;
  const kind: NonNullable<PageElement['embedKind']> = video ? 'video' : showPage ? 'webpage' : 'link';
  const lastChecked = useRef(element?.url ?? '');
  const mediathek = video?.kind === 'ard' || video?.kind === 'zdf' ? video.kind : null;

  useEffect(() => {
    let current = true;
    internet<{ search: boolean; admin: boolean }>('status')
      .then((s) => current && setSearchReady(s))
      .catch(() => current && setSearchReady({ search: false, admin: false }));
    return () => {
      current = false;
    };
  }, []);

  // Title and preview picture of a video address, a moment after typing.
  useEffect(() => {
    if (mode !== 'address' || !address || address === lastChecked.current) return;
    let current = true;
    const timer = window.setTimeout(async () => {
      lastChecked.current = address;
      setThumb('');
      setPlayer('');
      setWarning('');
      setPreview(false);
      const found = detectVideo(address);
      if (!found) return;
      if (found.kind === 'file') {
        setWarning('Für diese Videodatei gibt es kein Vorschaubild – das Video lässt sich trotzdem abspielen.');
        return;
      }
      setLoading(true);
      try {
        const info = await internet<{ title: string; thumb: string; player: string }>('info', { url: address });
        if (!current) return;
        if (info.title && !titleTouched.current) setTitle(info.title);
        setThumb(info.thumb);
        setPlayer(info.player);
        if (!info.title && !info.thumb && !info.player) setWarning('Titel und Vorschaubild konnten nicht geladen werden. Ist der Server online?');
      } catch {
        if (current) setWarning('Titel und Vorschaubild konnten nicht geladen werden.');
      } finally {
        if (current) {
          setLoading(false);
          setChecked(address);
        }
      }
    }, 450);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [address, mode]);

  async function search(more = false, filters: { duration?: Duration; order?: Order } = {}) {
    const q = (more ? searched : query).trim();
    if (!q) return;
    setSearching(true);
    setSearchError('');
    try {
      const result = await internet<VideoSearchResult>('search', {
        q,
        duration: filters.duration ?? duration,
        order: filters.order ?? order,
        pageToken: more ? next : undefined,
      });
      setHits((old) => (more ? [...old, ...result.items] : result.items));
      setNext(result.nextPageToken);
      setSearched(q);
      if (!more) setPlaying('');
    } catch (e) {
      setSearchError((e as Error).message);
    } finally {
      setSearching(false);
    }
  }
  // Filters apply at once to the last search.
  function filter(values: { duration?: Duration; order?: Order }) {
    if (values.duration) setDuration(values.duration);
    if (values.order) setOrder(values.order);
    if (searched) void search(false, values);
  }

  function choose(hit: VideoHit) {
    setChosen(hit.id);
    setInput(hit.url);
    setTitle(hit.title);
    titleTouched.current = true;
    setAsPage(false);
    setThumb(`/api/internet/vorschau/${hit.id}`);
    setWarning('');
    lastChecked.current = hit.url;
    setPlaying('');
    setMode('address');
  }

  async function submit() {
    setError('');
    setBusy(true);
    try {
      if (mode === 'app') {
        if (!app) throw new Error('Bitte eine HTML-Datei wählen.');
        const response = await fetch('/api/apps', { method: 'POST', body: app });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        finish({ embedKind: 'app', src: data.src, url: undefined, poster: undefined }, 170, 100);
        return;
      }
      if (!address) throw new Error('Das ist keine gültige Internetadresse.');
      if (mode === 'qr') {
        finish({ embedKind: 'qr', url: address, poster: undefined }, 65, 75);
        return;
      }
      let poster: string | undefined = undefined;
      // Mediathek videos keep the broadcaster's player, the only thing allowed inside a page.
      const url = kind === 'video' && mediathek && player ? player : address;
      if (kind === 'video') {
        if (element?.poster && (element.url === address || element.url === url)) poster = element.poster;
        else if (video?.kind === 'youtube')
          poster = await internet<{ src: string }>('poster', { id: video.id }).then((r) => r.src).catch(() => undefined);
        else if (mediathek && thumb)
          poster = await internet<{ src: string }>('poster', { url: address }).then((r) => r.src).catch(() => undefined);
      }
      finish({ embedKind: kind, url, poster }, kind === 'link' ? 120 : 160, kind === 'video' ? 90 : kind === 'link' ? 14 : 120);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function finish(values: Partial<PageElement>, width: number, height: number) {
    const alt = title.trim().slice(0, 300);
    if (element) onInsert({ ...element, ...values, alt });
    else
      onInsert({
        id: uuid(),
        type: 'embed',
        x: 20,
        y: 40,
        width,
        height,
        rotation: 0,
        locked: false,
        color: '#253c42',
        alt,
        ...values,
      });
    onClose();
  }

  const searchAllowed = !!searchReady?.search;
  const canSubmit = mode === 'app' ? !!app : !!address;
  const heading = editing
    ? mode === 'qr' ? 'QR-Plakat ändern' : 'Video oder Webseite ändern'
    : 'Video oder Webseite einfügen';

  return (
    <div className="modal-backdrop">
      <section className="modal embed-dialog" role="dialog" aria-modal="true" aria-labelledby="embed-title">
        <h2 id="embed-title">{heading}</h2>
        {!editing && (
          <div className="embed-modes" role="group" aria-label="Art">
            <ChoiceButton icon="globe" label="Adresse eingeben" pressed={mode === 'address'} onClick={() => setMode('address')} />
            {(searchAllowed || (!child && searchReady)) && (
              <ChoiceButton icon="search" label="Video suchen" pressed={mode === 'search'} onClick={() => setMode('search')} />
            )}
            <ChoiceButton icon="grid" label="QR-Plakat" pressed={mode === 'qr'} onClick={() => setMode('qr')} />
            {!child && <ChoiceButton icon="settings" label="Eigene HTML-App" pressed={mode === 'app'} onClick={() => setMode('app')} />}
          </div>
        )}

        {mode === 'search' && (
          <div className="video-search">
            {!searchAllowed ? (
              <p className="hinweis">
                Die Videosuche ist noch nicht eingerichtet. Die Verwaltung kann dafür einen YouTube-Schlüssel hinterlegen.
                {searchReady?.admin && (
                  <>
                    {' '}
                    <Link href="/verwaltung?bereich=einstellungen">Zu den Einstellungen</Link>
                  </>
                )}
              </p>
            ) : (
              <>
                <form
                  className="video-search-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void search();
                  }}
                >
                  <input
                    type="search"
                    aria-label="Suchbegriff"
                    autoFocus
                    maxLength={200}
                    value={query}
                    placeholder="z. B. Wie wächst eine Sonnenblume?"
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button className="knopf knopf-haupt" disabled={searching || !query.trim()}>
                    <Icon name="search" size={20} /> Suchen
                  </button>
                </form>
                <div className="video-search-filters">
                  <OptionGroup label="Länge">
                    {DURATION_OPTIONS.map(([value, label]) => (
                      <ChoiceButton key={value} icon="clock" label={label} pressed={duration === value} disabled={searching} onClick={() => filter({ duration: value })} />
                    ))}
                  </OptionGroup>
                  <OptionGroup label="Reihenfolge">
                    {ORDER_OPTIONS.map(([value, label, icon]) => (
                      <ChoiceButton key={value} icon={icon} label={label} pressed={order === value} disabled={searching} onClick={() => filter({ order: value })} />
                    ))}
                  </OptionGroup>
                </div>
                {searchError && <p className="fehler" role="alert">{searchError}</p>}
                {searching && !hits.length && <p className="hinweis" role="status">Sucht …</p>}
                {searched && !searching && !hits.length && !searchError && (
                  <p className="hinweis">Keine Videos zu „{searched}“ gefunden.</p>
                )}
                {hits.length > 0 && (
                  <ul className="video-results" aria-label={`Videos zu „${searched}“`}>
                    {hits.map((hit) => (
                      <li key={hit.id} className={chosen === hit.id ? 'is-chosen' : ''}>
                        <div className="video-thumb">
                          {playing === hit.id ? (
                            <iframe
                              title={`Vorschau: ${hit.title}`}
                              src={autoplayAddress(hit.url)}
                              allow="autoplay; fullscreen"
                              sandbox="allow-scripts allow-same-origin allow-presentation"
                              referrerPolicy="strict-origin-when-cross-origin"
                            />
                          ) : (
                            <button type="button" className="video-thumb-play" onClick={() => setPlaying(hit.id)} aria-label={`${hit.title} ansehen`}>
                              <img src={`/api/internet/vorschau/${hit.id}`} alt="" loading="lazy" />
                              <span className="embed-play" aria-hidden="true">▶</span>
                              {hit.seconds > 0 && <span className="video-length">{clock(hit.seconds)}</span>}
                            </button>
                          )}
                        </div>
                        <strong title={hit.title}>{hit.title}</strong>
                        <small>
                          {hit.channel}
                          {hit.publishedAt ? ` · ${new Date(hit.publishedAt).toLocaleDateString('de-DE')}` : ''}
                          {hit.views ? ` · ${hit.views.toLocaleString('de-DE')} Aufrufe` : ''}
                        </small>
                        <button type="button" className="knopf compact knopf-haupt" onClick={() => choose(hit)}>
                          <Icon name="checkmark" size={18} /> Auswählen
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {next && hits.length > 0 && (
                  <button type="button" className="knopf video-more" disabled={searching} onClick={() => void search(true)}>
                    {searching ? 'Lädt …' : 'Mehr Ergebnisse'}
                  </button>
                )}
                <p className="hinweis small">
                  Gezeigt werden nur Videos, die sich einbetten lassen, mit YouTube-SafeSearch „streng“. Bitte jedes Video vor dem Einsatz selbst ansehen.
                </p>
              </>
            )}
          </div>
        )}

        {(mode === 'address' || mode === 'qr') && (
          <div className="stack embed-fields">
            {mode === 'address' && hits.length > 0 && !editing && (
              <button type="button" className="sidebar-link" onClick={() => setMode('search')}>
                ‹ Zurück zu den Suchergebnissen
              </button>
            )}
            <label className="feld">
              <span>Internetadresse</span>
              <input
                type="url"
                inputMode="url"
                aria-label="Internetadresse"
                autoFocus={mode === 'address' && !chosen}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={2000}
                placeholder="https://…"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setAsPage(false);
                  setChosen('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (canSubmit && !busy) void submit();
                  }
                }}
              />
              <small className="field-hint">
                {input.trim() && !address
                  ? 'Das ist keine gültige Internetadresse.'
                  : mode === 'qr'
                    ? 'Der QR-Code führt zu dieser Adresse – zum Ausdrucken und Scannen.'
                    : 'Ein Video (YouTube, Vimeo, ARD- oder ZDF-Mediathek, Videodatei) oder eine Webseite – was es ist, erkennt das Heft selbst.'}
              </small>
            </label>
            {mode === 'address' && address && (
              <p className="embed-kind">
                <Icon name={video ? 'camcorder_pro' : 'globe'} size={22} />
                <span>
                  {video ? (
                    <>
                      <strong>{video.kind === 'file' ? 'Videodatei' : `Video ${VIDEO_SOURCES[video.kind]}`}</strong> – es startet erst, wenn
                      du auf ▶ tippst.
                    </>
                  ) : (
                    <>
                      <strong>Webseite</strong> {hostOf(address)}
                    </>
                  )}
                </span>
              </p>
            )}
            {mode === 'address' && address && !video && (
              <div className="embed-page-choice">
                <ChoiceButton icon="next" label="Als Kärtchen" pressed={!showPage} onClick={() => setShowPage(false)} />
                <ChoiceButton icon="globe" label="Webseite direkt im Heft zeigen" pressed={showPage} onClick={() => setShowPage(true)} />
                <small className="field-hint">
                  {showPage
                    ? 'Die Seite erscheint im Heft. Manche Webseiten (z. B. zdf.de) erlauben das nicht – dann bleibt die Fläche leer. Dann besser „Als Kärtchen“.'
                    : 'Ein Kärtchen mit Titel und Adresse. Antippen öffnet die Webseite.'}
                </small>
              </div>
            )}
            <label className="feld">
              <span>{mode === 'qr' ? 'Beschriftung' : 'Titel (wird auch vorgelesen)'}</span>
              <input
                maxLength={300}
                value={title}
                placeholder={address ? hostOf(address) : 'z. B. Wie wächst eine Sonnenblume?'}
                onChange={(e) => {
                  titleTouched.current = true;
                  setTitle(e.target.value);
                }}
              />
            </label>
            {mode === 'address' && video && (
              <div className="embed-preview">
                {preview && video.kind !== 'file' && (!mediathek || player) ? (
                  <iframe
                    title={`Vorschau: ${title || 'Video'}`}
                    src={autoplayAddress(mediathek ? player : address!)}
                    allow="autoplay; fullscreen"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : thumb || (mediathek && player) ? (
                  <button
                    type="button"
                    className="video-thumb-play"
                    disabled={!!mediathek && !player}
                    onClick={() => setPreview(true)}
                    aria-label="Vorschau abspielen"
                  >
                    {thumb && <img src={thumb} alt="" />}
                    {(!mediathek || player) && <span className="embed-play" aria-hidden="true">▶</span>}
                  </button>
                ) : (
                  <Icon name="camcorder_pro" size={48} />
                )}
                {loading && <span className="embed-loading">Lädt …</span>}
              </div>
            )}
            {mode === 'address' && mediathek && !loading && address === checked && (
              <p className="embed-note">
                {player
                  ? `Das Video läuft im Heft im Player der ${MEDIATHEK_NAMES[mediathek]}. Viele Videos sind dort nur eine Zeit lang abrufbar.`
                  : `Die ${MEDIATHEK_NAMES[mediathek]} erlaubt für dieses Video nicht, es in anderen Seiten abzuspielen. Im Heft erscheint ein Bild mit Titel – Antippen öffnet das Video in einem neuen Fenster.`}{' '}
                <button type="button" className="linkish" onClick={() => setAsPage(true)}>
                  Kein Video? Als Webseite einfügen
                </button>
              </p>
            )}
            {mode === 'address' && asPage && detected && (
              <p className="embed-note">
                <button type="button" className="linkish" onClick={() => setAsPage(false)}>
                  Doch als Video einfügen
                </button>
              </p>
            )}
            {mode === 'address' && video && warning && <p className="embed-warn">{warning}</p>}
          </div>
        )}

        {mode === 'app' && (
          <div className="stack embed-fields">
            <label className="feld">
              <span>Eigenständige HTML-Datei (bis 2 MB)</span>
              <input type="file" accept=".html,.htm" onChange={(e) => setApp(e.target.files?.[0] || null)} />
              <small className="field-hint">Die App läuft getrennt vom Heft. Bilder, Schriften und Skripte müssen in der Datei enthalten sein.</small>
            </label>
            <label className="feld">
              <span>Titel (wird auch vorgelesen)</span>
              <input maxLength={300} value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
          </div>
        )}

        {mode !== 'search' && (
          <p className="hinweis small">
            Externe Inhalte werden erst nach Antippen geladen. In Kinderheften nur, wenn die Lehrkraft dem Kind „Internet“ erlaubt.
          </p>
        )}
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          {address && mode !== 'search' && (
            <button type="button" className="knopf" onClick={() => window.open(address, '_blank', 'noopener')}>
              <Icon name="share" size={18} /> Ausprobieren
            </button>
          )}
          <button type="button" className="knopf" onClick={onClose}>
            Abbrechen
          </button>
          {mode !== 'search' && (
            <button type="button" className="knopf knopf-haupt" disabled={busy || loading || !canSubmit} onClick={() => void submit()}>
              {busy ? 'Wird eingefügt …' : editing ? 'Übernehmen' : 'Einfügen'}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
