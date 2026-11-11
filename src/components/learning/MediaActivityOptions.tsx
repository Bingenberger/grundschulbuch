/* eslint-disable @next/next/no-img-element -- Authenticated school media. */
'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { LearningSettings, LearningMedia } from '@/lib/learning/catalog';
import type { MediaActivityKind } from '@/lib/learning/media-activity';
import AudioDialog from '../AudioDialog';
import VoiceOptions from './VoiceOptions';
function MediaPicker({ value = {}, label, onChange, upload, record }: {
  value?: LearningMedia; label: string; onChange: (value: LearningMedia) => void;
  upload: (file: File, done: (src: string) => void) => Promise<void>; record: (done: (src: string) => void) => void;
}) {
  const file = (accept: string, title: string, done: (src: string) => void) => <label className="knopf compact">{title}<input type="file" className="visually-hidden" aria-label={`${label}: ${title}`} accept={accept} onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file, done); event.target.value = ''; }} /></label>;
  return <div className="task-media-editor">
    {value.image && <img src={value.image} alt={`Vorschau ${label}`} />}
    {value.audio && <audio controls src={value.audio} preload="none" />}
    <div className="learning-actions">
      {file('image/png,image/jpeg,image/webp', 'Bild wählen', image => onChange({ ...value, image }))}
      {file('audio/*', 'Ton wählen', audio => onChange({ ...value, audio }))}
      <button type="button" className="knopf compact" onClick={() => record(audio => onChange({ ...value, audio }))}>Ton aufnehmen</button>
      {value.image && <button type="button" className="knopf compact" onClick={() => { const next = { ...value }; delete next.image; onChange(next); }}>Bild entfernen</button>}
      {value.audio && <button type="button" className="knopf compact" onClick={() => { const next = { ...value }; delete next.audio; onChange(next); }}>Ton entfernen</button>}
    </div>
    {(value.image || value.audio) && <label><input type="checkbox" checked={!!value.hideText} onChange={event => onChange({ ...value, hideText: event.target.checked })} /> Beschriftung im Spiel ausblenden</label>}
  </div>;
}
export default function MediaActivityOptions({ kind, settings: c, onChange, upload, busy }: {
  kind: MediaActivityKind; settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void;
  upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean;
}) {
  const [recording, setRecording] = useState<{ label: string; done: (src: string) => void } | null>(null);
  const questions = c.questions || [], pairs = c.pairs || [];
  const picker = (value: LearningMedia | undefined, label: string, done: (media: LearningMedia) => void) => <MediaPicker value={value} label={label} onChange={done} upload={upload} record={done => setRecording({ label, done })} />;
  return <fieldset className="media-activity-options" disabled={busy}>
    <legend>{kind === 'quiz' ? 'Quiz mit Bildern und Ton' : kind === 'matching' ? 'Zuordnungen mit Bildern und Ton' : 'Memory mit Bildern und Ton'}</legend>
    <p>Beschriftungen können durch Bilder und Ton ergänzt oder im Spiel ausgeblendet werden. Sie bleiben als Beschreibung für die Vorlesebedienung hilfreich. Ton lässt sich anhören, ohne eine Quizantwort auszuwählen oder eine Zuordnung zu ändern.</p>
    {kind === 'quiz' ? <>
      {questions.map((question, i) => {
        const change = (patch: Partial<typeof question>) => onChange({ questions: questions.map((q, n) => n === i ? { ...q, ...patch } : q) });
        return <fieldset key={i}><legend>Frage {i + 1}</legend>
          <label className="property-label">Fragetext<input aria-label={`Frage ${i + 1}`} value={question.text} onChange={event => change({ text: event.target.value })} /></label>
          {picker(question.media, `Frage ${i + 1}`, media => change({ media }))}
          {question.answers.map((answer, j) => <fieldset key={j}><legend>Antwort {String.fromCharCode(65 + j)}</legend>
            <label className="quiz-answer-editor"><input type="radio" name={`quiz-correct-${i}`} aria-label={`Frage ${i + 1}, Antwort ${j + 1} ist richtig`} checked={question.correct === j} onChange={() => change({ correct: j })} /> Richtig
              <input aria-label={`Frage ${i + 1}, Antwort ${j + 1}`} value={answer} onChange={event => change({ answers: question.answers.map((text, n) => n === j ? event.target.value : text) })} />
            </label>
            {picker(question.answerMedia?.[j], `Frage ${i + 1}, Antwort ${j + 1}`, media => change({ answerMedia: question.answers.map((_, n) => n === j ? media : question.answerMedia?.[n] || {}) }))}
            <button type="button" className="knopf compact" disabled={question.answers.length <= 2} onClick={() => change({ answers: question.answers.filter((_, n) => n !== j), answerMedia: question.answers.map((_, n) => question.answerMedia?.[n] || {}).filter((_, n) => n !== j), correct: question.correct === j ? 0 : question.correct > j ? question.correct - 1 : question.correct })}>Antwort entfernen</button>
          </fieldset>)}
          <button type="button" className="knopf compact" disabled={question.answers.length >= 8} onClick={() => change({ answers: [...question.answers, 'Neue Antwort'], ...(question.answerMedia ? { answerMedia: [...question.answers.map((_, n) => question.answerMedia?.[n] || {}), {}] } : {}) })}>＋ Antwort</button>
          <label className="property-label">Rückmeldung bei einer falschen Antwort<input aria-label={`Rückmeldung für Frage ${i + 1}`} value={question.explanation || ''} onChange={event => change({ explanation: event.target.value })} /></label>
          <button type="button" className="knopf compact" onClick={() => onChange({ questions: questions.filter((_, n) => n !== i) })}>Frage entfernen</button>
        </fieldset>;
      })}
      <button type="button" className="knopf" disabled={questions.length >= 40} onClick={() => onChange({ questions: [...questions, { text: 'Neue Frage', answers: ['Antwort 1', 'Antwort 2'], correct: 0 }] })}>＋ Frage</button>
    </> : <>
      {pairs.map((pair, i) => { const change = (patch: Partial<typeof pair>) => onChange({ pairs: pairs.map((value, n) => n === i ? { ...value, ...patch } : value) }); return <fieldset key={i}><legend>Paar {i + 1}</legend>
        <label className="property-label">Linke Seite<input aria-label={`Paar ${i + 1}, links`} value={pair.left} onChange={event => change({ left: event.target.value })} /></label>
        {picker(pair.leftMedia, `Paar ${i + 1}, links`, leftMedia => change({ leftMedia }))}
        <label className="property-label">Rechte Seite<input aria-label={`Paar ${i + 1}, rechts`} value={pair.right} onChange={event => change({ right: event.target.value })} /></label>
        {picker(pair.rightMedia, `Paar ${i + 1}, rechts`, rightMedia => change({ rightMedia }))}
        <button type="button" className="knopf compact" onClick={() => onChange({ pairs: pairs.filter((_, n) => n !== i) })}>Paar entfernen</button>
      </fieldset>; })}
      {pairs.length > 12 && <p>Gespielt werden die ersten zwölf Paare. Weitere vorhandene Paare bleiben gespeichert.</p>}
      <button type="button" className="knopf" disabled={pairs.length >= 12} onClick={() => onChange({ pairs: [...pairs, { left: 'Neuer Begriff', right: 'Neue Zuordnung' }] })}>＋ Paar</button>
    </>}
    <label><input type="checkbox" checked={!!c.mediaReadText} onChange={event => onChange({ mediaReadText: event.target.checked })} /> Texte zusätzlich mit der Gerätestimme anhören</label>
    {c.mediaReadText && <VoiceOptions settings={c} onChange={onChange} />}
    {recording && createPortal(<div className="alphabet-recording"><p className="alphabet-recording-label">Ton aufnehmen: {recording.label}</p><AudioDialog bookId="" onClose={() => setRecording(null)} onAudio={src => { recording.done(src); setRecording(null); }} /></div>, document.body)}
  </fieldset>;
}
