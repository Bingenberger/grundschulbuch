import type { LearningSettings, LearningResponse, LearningMedia } from './catalog';
import { shuffled, normalized } from './algorithms';
export type MediaActivityKind = 'quiz' | 'matching' | 'memory';
export type TaskCard = { text: string; media?: LearningMedia };
export function taskPairs(c: LearningSettings): NonNullable<LearningSettings['pairs']> {
  return (c.pairs?.length ? c.pairs : [{ left: '1 + 1', right: '2' }, { left: '2 + 2', right: '4' }]).slice(0, 12);
}
export function taskQuestions(c: LearningSettings): NonNullable<LearningSettings['questions']> {
  return c.questions?.length ? c.questions : [{ text: 'Wie viel ist 2 + 2?', answers: ['3', '4', '5'], correct: 1 }];
}
export function pairCard(c: LearningSettings, index: number, side: 'left' | 'right'): TaskCard {
  const pair = taskPairs(c)[index];
  return { text: pair?.[side] || '', media: side === 'left' ? pair?.leftMedia : pair?.rightMedia };
}
export function memoryDeck(c: LearningSettings) {
  return shuffled(taskPairs(c).flatMap((_, pair) => [{ pair, side: 'left' as const }, { pair, side: 'right' as const }]), c.seed);
}
function cardKey(card: TaskCard) {
  return [normalized(card.text.normalize('NFC')), card.media?.image || '', card.media?.audio || '', !!(card.media?.hideText && (card.media.image || card.media.audio))];
}
export function matchingRight(c: LearningSettings, row: number, source: number) {
  return source >= 0 && source < taskPairs(c).length && row >= 0 && row < taskPairs(c).length && JSON.stringify(cardKey(pairCard(c, row, 'right'))) === JSON.stringify(cardKey(pairCard(c, source, 'right')));
}
function exercise(kind: MediaActivityKind, c: LearningSettings) {
  const content = kind === 'quiz' ? taskQuestions(c).map(q => [q.text, q.answers, q.correct, q.media, q.answerMedia]) : taskPairs(c).map((_, i) => [cardKey(pairCard(c, i, 'left')), cardKey(pairCard(c, i, 'right'))]);
  const text = JSON.stringify([kind, content, c.seed ?? 42]);
  // A compact content stamp keeps large media-rich quizzes out of the response.
  let hash = 0xcbf29ce484222325n;
  for (let i = 0; i < text.length; i++) hash = BigInt.asUintN(64, (hash ^ BigInt(text.charCodeAt(i))) * 0x100000001b3n);
  return `${kind}:${text.length}:${hash.toString(16)}`;
}
export type MediaActivityState = { exercise: string; index: number; answers: number[]; evaluated: boolean[]; placements: number[]; open: number[]; matched: number[]; moves: number; checked: boolean; completed: boolean };
function initial(kind: MediaActivityKind, c: LearningSettings): MediaActivityState {
  return { exercise: exercise(kind, c), index: 0, answers: kind === 'quiz' ? taskQuestions(c).map(() => -1) : [], evaluated: kind === 'quiz' ? taskQuestions(c).map(() => false) : [], placements: kind === 'matching' ? taskPairs(c).map(() => -1) : [], open: [], matched: [], moves: 0, checked: false, completed: false };
}
export function readMediaActivity(response: LearningResponse, kind: MediaActivityKind, c: LearningSettings): MediaActivityState {
  const base = initial(kind, c), value = response.mediaActivity;
  const questions = taskQuestions(c), pairs = taskPairs(c), deck = memoryDeck(c);
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.exercise !== base.exercise) {
    if (value) return base;
    // Preserve legacy choices; they must be checked again against the new task.
    const old = Array.isArray(response.values) ? response.values : [];
    if (kind === 'quiz') return { ...base, index: Math.max(0, Math.min(questions.length - 1, Math.floor(Number(response.index) || 0))), answers: questions.map((q, i) => (typeof old[i] === 'string' && /^\d+$/.test(String(old[i])) || typeof old[i] === 'number') && Number.isInteger(Number(old[i])) && Number(old[i]) >= 0 && Number(old[i]) < q.answers.length ? Number(old[i]) : -1) };
    if (kind === 'matching') {
      const used = new Set<number>();
      return { ...base, placements: pairs.map((_, i) => {
        const source = pairs.findIndex((pair, n) => !used.has(n) && typeof old[i] === 'string' && normalized(String(old[i])) === normalized(pair.right));
        if (source >= 0) used.add(source); return source;
      }) };
    }
    if (kind === 'memory' && c.pairs?.length) {
      const legacy = Array.isArray(response.matched) ? response.matched.map(Number) : [];
      const matched = deck.map((_, i) => i).filter(i => legacy.includes(i) && deck.filter(card => card.pair === deck[i].pair).every(card => legacy.includes(deck.indexOf(card))));
      const open = Array.isArray(response.open) ? Array.from(new Set(response.open.map(Number))).filter(i => Number.isInteger(i) && i >= 0 && i < deck.length && !matched.includes(i)).slice(0, 2) : [];
      return { ...base, open, matched, moves: Math.max(0, Math.floor((Number(response.attempts) || 0) / 2)), completed: matched.length === deck.length };
    }
    return base;
  }
  const ints = (key: string, max: number) => Array.isArray(value[key]) ? value[key].map(Number).filter(n => Number.isInteger(n) && n >= 0 && n < max) : [];
  const unique = (values: number[]) => Array.from(new Set(values));
  const rawMatched = new Set(ints('matched', deck.length));
  const matched = kind === 'memory' ? deck.map((_, i) => i).filter(i => rawMatched.has(i) && deck.every((card, n) => card.pair !== deck[i].pair || rawMatched.has(n))) : [];
  const taken = new Set<number>();
  const result: MediaActivityState = { ...base, index: kind === 'quiz' ? Math.max(0, Math.min(questions.length - 1, Math.floor(Number(value.index) || 0))) : 0,
    answers: kind === 'quiz' ? questions.map((q, i) => Array.isArray(value.answers) && Number.isInteger(value.answers[i]) && Number(value.answers[i]) >= 0 && Number(value.answers[i]) < q.answers.length ? Number(value.answers[i]) : -1) : [],
    evaluated: kind === 'quiz' ? questions.map((_, i) => Array.isArray(value.evaluated) && value.evaluated[i] === true) : [],
    placements: kind === 'matching' ? pairs.map((_, i) => { const source = Array.isArray(value.placements) ? Number(value.placements[i]) : -1; if (!Number.isInteger(source) || source < 0 || source >= pairs.length || taken.has(source)) return -1; taken.add(source); return source; }) : [],
    matched, open: kind === 'memory' ? unique(ints('open', deck.length)).filter(i => !matched.includes(i)).slice(0, 2) : [], moves: Math.max(0, Math.min(1000000, Math.floor(Number(value.moves) || 0))),
    checked: value.checked === true, completed: false };
  result.completed = kind === 'quiz' ? questions.every((q, i) => result.evaluated[i] && result.answers[i] === q.correct) : kind === 'matching' ? result.checked && pairs.every((_, i) => matchingRight(c, i, result.placements[i])) : result.matched.length === deck.length;
  return result;
}
export type MediaActivityAction = { type: 'answer'; choice: number } | { type: 'question'; index: number } | { type: 'place'; row: number; source: number } | { type: 'flip'; card: number } | { type: 'check' | 'resolve' | 'restart' };
export function mediaActivityStep(state: MediaActivityState, kind: MediaActivityKind, c: LearningSettings, action: MediaActivityAction): MediaActivityState {
  if (action.type === 'restart') return initial(kind, c);
  const questions = taskQuestions(c), pairs = taskPairs(c), deck = memoryDeck(c);
  if (kind === 'quiz') {
    if (action.type === 'question') return Number.isInteger(action.index) && action.index >= 0 && action.index < questions.length ? { ...state, index: action.index } : state;
    if (action.type === 'answer') {
      if (!Number.isInteger(action.choice) || action.choice < 0 || action.choice >= questions[state.index].answers.length) return state;
      const answers = questions.map((_, i) => i === state.index ? action.choice : state.answers[i] ?? -1);
      const evaluated = questions.map((_, i) => i === state.index ? false : !!state.evaluated[i]);
      return { ...state, answers, evaluated, completed: false };
    }
    if (action.type === 'check' && state.answers[state.index] >= 0) {
      const evaluated = questions.map((_, i) => i === state.index || !!state.evaluated[i]);
      return { ...state, evaluated, completed: questions.every((q, i) => evaluated[i] && state.answers[i] === q.correct) };
    }
  }
  if (kind === 'matching') {
    if (action.type === 'place' && Number.isInteger(action.row) && action.row >= 0 && action.row < pairs.length && Number.isInteger(action.source) && action.source >= -1 && action.source < pairs.length) {
      const placements = pairs.map((_, i) => i === action.row ? action.source : state.placements[i] === action.source ? -1 : state.placements[i] ?? -1);
      return { ...state, placements, checked: false, completed: false };
    }
    if (action.type === 'check') return { ...state, checked: true, completed: pairs.every((_, i) => matchingRight(c, i, state.placements[i] ?? -1)) };
  }
  if (kind === 'memory' && !state.completed) {
    if (action.type === 'flip' && Number.isInteger(action.card) && action.card >= 0 && action.card < deck.length && state.open.length < 2 && !state.open.includes(action.card) && !state.matched.includes(action.card)) {
      const open = [...state.open, action.card]; return { ...state, open, moves: state.moves + (open.length === 2 ? 1 : 0) };
    }
    if (action.type === 'resolve' && state.open.length === 2) {
      const [a, b] = state.open, match = deck[a]?.pair === deck[b]?.pair;
      const matched = match ? Array.from(new Set([...state.matched, a, b])) : state.matched;
      return { ...state, open: [], matched, completed: matched.length === deck.length };
    }
  }
  return state;
}
export function mediaActivityScore(state: MediaActivityState, kind: MediaActivityKind, c: LearningSettings) {
  if (kind === 'quiz') { const questions = taskQuestions(c); return Math.round(questions.filter((q, i) => state.evaluated[i] && state.answers[i] === q.correct).length / Math.max(1, questions.length) * 100); }
  if (kind === 'matching') return state.checked ? Math.round(taskPairs(c).filter((_, i) => matchingRight(c, i, state.placements[i] ?? -1)).length / Math.max(1, taskPairs(c).length) * 100) : 0;
  return Math.round(state.matched.length / Math.max(1, memoryDeck(c).length) * 100);
}
