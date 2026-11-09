export const normalized = (s: string) =>
  s.trim().toLocaleLowerCase('de').replace(/\s+/g, ' ');
export function seeded(seed = 42) {
  let value = seed >>> 0;
  return (max: number) => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return max > 0 ? value % max : 0;
  };
}
export function shuffled<T>(items: T[], seed = 42): T[] {
  const next = seeded(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = next(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function wordleFeedback(
  answer: string,
  guess: string,
): ('correct' | 'present' | 'absent')[] {
  const a = Array.from(answer.toLocaleUpperCase('de')),
    g = Array.from(guess.toLocaleUpperCase('de'));
  const result: ('correct' | 'present' | 'absent')[] = g.map(() => 'absent');
  const remaining = new Map<string, number>();
  a.forEach((letter, i) => {
    if (g[i] === letter) result[i] = 'correct';
    else remaining.set(letter, (remaining.get(letter) || 0) + 1);
  });
  g.forEach((letter, i) => {
    if (result[i] !== 'correct' && (remaining.get(letter) || 0) > 0) {
      result[i] = 'present';
      remaining.set(letter, remaining.get(letter)! - 1);
    }
  });
  return result;
}
export function searchGrid(input: string[], size = 12, seed = 42) {
  const next = seeded(seed);
  const words = input
    .map((s) => s.toLocaleUpperCase('de').replace(/[^A-ZÄÖÜ]/g, ''))
    .filter((s) => s.length > 1 && s.length <= size)
    .slice(0, 20);
  const grid = Array.from({ length: size * size }, () => '');
  const placed: { word: string; cells: number[] }[] = [];
  for (const word of words) {
    for (let tries = 0; tries < 200; tries++) {
      const horizontal = !!next(2),
        r = next(horizontal ? size : size - word.length + 1),
        c = next(horizontal ? size - word.length + 1 : size);
      const cells = Array.from(
        word,
        (_, i) => (r + (horizontal ? 0 : i)) * size + c + (horizontal ? i : 0),
      );
      if (cells.some((cell, i) => grid[cell] && grid[cell] !== word[i]))
        continue;
      cells.forEach((cell, i) => (grid[cell] = word[i]));
      placed.push({ word, cells });
      break;
    }
  }
  for (let i = 0; i < grid.length; i++)
    if (!grid[i]) grid[i] = String.fromCharCode(65 + next(26));
  return { grid, placed, size };
}
export function mazeGrid(size = 8, seed = 42) {
  const next = seeded(seed),
    walls = Array.from({ length: size * size }, () => [true, true, true, true]);
  const visited = new Set([0]),
    stack = [0];
  while (stack.length) {
    const cell = stack[stack.length - 1],
      r = Math.floor(cell / size),
      c = cell % size;
    const options = [
      r > 0 ? cell - size : -1,
      c < size - 1 ? cell + 1 : -1,
      r < size - 1 ? cell + size : -1,
      c > 0 ? cell - 1 : -1,
    ]
      .map((cell, direction) => ({ cell, direction }))
      .filter((o) => o.cell >= 0 && !visited.has(o.cell));
    if (!options.length) {
      stack.pop();
      continue;
    }
    const option = options[next(options.length)];
    walls[cell][option.direction] = false;
    walls[option.cell][(option.direction + 2) % 4] = false;
    visited.add(option.cell);
    stack.push(option.cell);
  }
  return { walls, size };
}
export function connectWinner(board: number[], columns = 7, rows = 6): number {
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < columns; c++) {
      const value = board[r * columns + c];
      if (!value) continue;
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ])
        if (
          [1, 2, 3].every(
            (n) =>
              r + n * dr >= 0 &&
              r + n * dr < rows &&
              c + n * dc >= 0 &&
              c + n * dc < columns &&
              board[(r + n * dr) * columns + c + n * dc] === value,
          )
        )
          return value;
    }
  return 0;
}
/** Arithmetic parser: numeric expressions only; no eval or generated code. */
export function calculate(expression: string): number {
  const tokens =
    expression
      .replace(/,/g, '.')
      .replace(/×/g, '*')
      .replace(/[÷:]/g, '/')
      .replace(/−/g, '-')
      .match(/(?:\d*\.)?\d+|[()+*/-]/g) || [];
  if (
    tokens.join('') !==
    expression
      .replace(/\s/g, '')
      .replace(/,/g, '.')
      .replace(/×/g, '*')
      .replace(/[÷:]/g, '/')
      .replace(/−/g, '-')
  )
    throw new Error('Bitte nur Zahlen und Rechenzeichen verwenden.');
  let at = 0;
  const factor = (): number => {
    const token = tokens[at++];
    if (token === '-') return -factor();
    if (token === '+') return factor();
    if (token === '(') {
      const value = sum();
      if (tokens[at++] !== ')') throw new Error('Eine Klammer fehlt.');
      return value;
    }
    if (!token || !/^[\d.]+$/.test(token))
      throw new Error('Die Rechnung ist unvollständig.');
    return Number(token);
  };
  const product = (): number => {
    let result = factor();
    while (tokens[at] === '*' || tokens[at] === '/') {
      const op = tokens[at++],
        value = factor();
      result = op === '*' ? result * value : result / value;
    }
    return result;
  };
  const sum = (): number => {
    let result = product();
    while (tokens[at] === '+' || tokens[at] === '-') {
      const op = tokens[at++],
        value = product();
      result = op === '+' ? result + value : result - value;
    }
    return result;
  };
  const result = sum();
  if (
    at !== tokens.length ||
    !Number.isFinite(result) ||
    Math.abs(result) > 1e12
  )
    throw new Error('Diese Rechnung kann nicht berechnet werden.');
  return Math.round(result * 1e8) / 1e8;
}
export function noteFrequency(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
export function detectedPitch(
  samples: Float32Array,
  sampleRate: number,
): number | null {
  const length = samples.length;
  let power = 0;
  for (const sample of samples) power += sample * sample;
  if (Math.sqrt(power / length) < 0.01) return null;
  let best = 0,
    bestLag = 0;
  const minLag = Math.floor(sampleRate / 1200),
    maxLag = Math.min(Math.floor(sampleRate / 65), Math.floor(length / 2));
  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0,
      norm = 0;
    for (let i = 0; i < length - maxLag; i++) {
      corr += samples[i] * samples[i + lag];
      norm += samples[i] * samples[i] + samples[i + lag] * samples[i + lag];
    }
    const score = (2 * corr) / (norm || 1);
    if (score > best) {
      best = score;
      bestLag = lag;
    }
  }
  return best > 0.8 ? sampleRate / bestLag : null;
}

/** Build crossings where possible; unrelated vocabulary forms separate groups. */
export function crosswordGrid(entries: { left: string; right: string }[]) {
  const cells = new Map<
      string,
      { x: number; y: number; letter: string; number?: number }
    >(),
    placed: {
      clue: string;
      word: string;
      x: number;
      y: number;
      vertical: boolean;
      number: number;
    }[] = [];
  const words = entries
    .map((e) => ({
      ...e,
      right: e.right.toLocaleUpperCase('de').replace(/[^A-ZÄÖÜ]/g, ''),
    }))
    .filter((e) => e.right.length > 0 && e.right.length <= 24)
    .slice(0, 12);
  for (const entry of words) {
    let location: { x: number; y: number; vertical: boolean } | null = null;
    const valid = (x: number, y: number, vertical: boolean) => {
      for (let i = 0; i < entry.right.length; i++) {
        const xx = x + (vertical ? 0 : i),
          yy = y + (vertical ? i : 0),
          old = cells.get(`${xx},${yy}`);
        if (old && old.letter !== entry.right[i]) return false;
        if (!old) {
          if (
            cells.has(
              `${xx + (vertical ? 1 : 0)},${yy + (vertical ? 0 : 1)}`,
            ) ||
            cells.has(`${xx - (vertical ? 1 : 0)},${yy - (vertical ? 0 : 1)}`)
          )
            return false;
        }
      }
      return (
        !cells.has(`${x - (vertical ? 0 : 1)},${y - (vertical ? 1 : 0)}`) &&
        !cells.has(
          `${x + (vertical ? 0 : entry.right.length)},${y + (vertical ? entry.right.length : 0)}`,
        )
      );
    };
    search: for (const old of placed)
      for (let i = 0; i < old.word.length; i++)
        for (let j = 0; j < entry.right.length; j++)
          if (old.word[i] === entry.right[j]) {
            const vertical = !old.vertical,
              x = old.x + (old.vertical ? 0 : i) - (vertical ? 0 : j),
              y = old.y + (old.vertical ? i : 0) - (vertical ? j : 0);
            if (valid(x, y, vertical)) {
              location = { x, y, vertical };
              break search;
            }
          }
    if (!location)
      location = {
        x: 0,
        y: placed.length
          ? Math.max(...Array.from(cells.values()).map((c) => c.y)) + 2
          : 0,
        vertical: false,
      };
    const number = placed.length + 1;
    for (let i = 0; i < entry.right.length; i++) {
      const x = location.x + (location.vertical ? 0 : i),
        y = location.y + (location.vertical ? i : 0),
        key = `${x},${y}`,
        old = cells.get(key);
      cells.set(key, {
        x,
        y,
        letter: entry.right[i],
        number: i === 0 ? number : old?.number,
      });
    }
    placed.push({ clue: entry.left, word: entry.right, ...location, number });
  }
  if (!cells.size) return { width: 1, height: 1, cells: [], clues: [] };
  const all = Array.from(cells.values()),
    minX = Math.min(...all.map((c) => c.x)),
    minY = Math.min(...all.map((c) => c.y));
  return {
    width: Math.max(...all.map((c) => c.x)) - minX + 1,
    height: Math.max(...all.map((c) => c.y)) - minY + 1,
    cells: all.map((c) => ({ ...c, x: c.x - minX, y: c.y - minY })),
    clues: placed.map((c) => ({ ...c, x: c.x - minX, y: c.y - minY })),
  };
}

export function animationPose(
  frames: {
    x: number;
    y: number;
    text?: string;
    scale?: number;
    angle?: number;
    opacity?: number;
    symbol?: string;
    color?: string;
  }[],
  phase: number,
  mode = 'linear',
) {
  const fallback = {
      x: 50,
      y: 50,
      text: '',
      symbol: '●',
      color: '#52796f',
      scale: 1,
      angle: 0,
      opacity: 1,
    },
    list = frames.length ? frames : [fallback],
    position = Math.max(0, Math.min(1, phase)) * (list.length - 1),
    i = Math.min(list.length - 1, Math.floor(position)),
    a = list[i],
    b = list[Math.min(list.length - 1, i + 1)],
    t = position - i,
    p =
      mode === 'in'
        ? t * t
        : mode === 'out'
          ? 1 - (1 - t) ** 2
          : mode === 'inout'
            ? t * t * (3 - 2 * t)
            : t;
  return {
    x: a.x + (b.x - a.x) * p,
    y: a.y + (b.y - a.y) * p,
    scale: (a.scale ?? 1) + ((b.scale ?? 1) - (a.scale ?? 1)) * p,
    angle: (a.angle ?? 0) + ((b.angle ?? 0) - (a.angle ?? 0)) * p,
    opacity: (a.opacity ?? 1) + ((b.opacity ?? 1) - (a.opacity ?? 1)) * p,
    text: a.text || '',
    symbol: a.symbol || '●',
    color: a.color || '#52796f',
  };
}

export function battleFleet(seed = 42): number[] {
  const occupied = new Set<number>(),
    random = seeded(seed);
  for (const length of [3, 3, 2]) {
    const candidates: number[][] = [];
    for (let row = 0; row < 10; row++)
      for (let col = 0; col < 10; col++)
        for (const vertical of [false, true]) {
          if ((vertical ? row : col) + length > 10) continue;
          const cells = Array.from(
            { length },
            (_, i) =>
              (row + (vertical ? i : 0)) * 10 + col + (vertical ? 0 : i),
          );
          if (
            cells.every((cell) => {
              const r = Math.floor(cell / 10),
                c = cell % 10;
              for (let dy = -1; dy <= 1; dy++)
                for (let dx = -1; dx <= 1; dx++)
                  if (
                    r + dy >= 0 &&
                    r + dy < 10 &&
                    c + dx >= 0 &&
                    c + dx < 10 &&
                    occupied.has((r + dy) * 10 + c + dx)
                  )
                    return false;
              return true;
            })
          )
            candidates.push(cells);
        }
    const ship = candidates[random(candidates.length)];
    if (ship) ship.forEach((cell) => occupied.add(cell));
  }
  return [...occupied].sort((a, b) => a - b);
}
export function sudokuSolutions(input: number[], limit = 2): number {
  const board = [...input];
  let count = 0;
  const solve = () => {
    const at = board.indexOf(0);
    if (at < 0) {
      count++;
      return;
    }
    const row = Math.floor(at / 4),
      col = at % 4;
    for (let n = 1; n <= 4 && count < limit; n++) {
      if (
        Array.from({ length: 4 }, (_, i) => board[row * 4 + i]).includes(n) ||
        Array.from({ length: 4 }, (_, i) => board[i * 4 + col]).includes(n) ||
        Array.from(
          { length: 4 },
          (_, i) =>
            board[
              (Math.floor(row / 2) * 2 + Math.floor(i / 2)) * 4 +
                Math.floor(col / 2) * 2 +
                (i % 2)
            ],
        ).includes(n)
      )
        continue;
      board[at] = n;
      solve();
      board[at] = 0;
    }
  };
  solve();
  return count;
}
export function sudoku4(seed = 42): { puzzle: number[]; solution: number[] } {
  const digits = shuffled([1, 2, 3, 4], seed),
    solution = Array.from(
      { length: 16 },
      (_, i) =>
        digits[
          ((Math.floor(i / 4) % 2) * 2 +
            Math.floor(Math.floor(i / 4) / 2) +
            (i % 4)) %
            4
        ],
    ),
    puzzle = [...solution];
  for (const at of shuffled(
    Array.from({ length: 16 }, (_, i) => i),
    seed + 1,
  )) {
    if (puzzle.filter(Boolean).length <= 8) break;
    const old = puzzle[at];
    puzzle[at] = 0;
    if (sudokuSolutions(puzzle) !== 1) puzzle[at] = old;
  }
  return { puzzle, solution };
}
