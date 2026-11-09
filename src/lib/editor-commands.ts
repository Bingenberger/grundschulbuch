export const editorCommands = {
  undo: ['Rückgängig', 'Mod+z'],
  redo: ['Wiederholen', 'Mod+Shift+z'],
  save: ['Speichern', 'Mod+s'],
  files: ['Heftdateien', 'Mod+Shift+s'],
  help: ['Hilfe / Tastatur', 'F1'],
  nextPage: ['Nächste Seite', 'Alt+ArrowRight'],
  prevPage: ['Vorherige Seite', 'Alt+ArrowLeft'],
  firstPage: ['Erste Seite', 'Mod+Home'],
  lastPage: ['Letzte Seite', 'Mod+End'],
  newPage: ['Neue Seite', 'Mod+Enter'],
  readPage: ['Seite vorlesen', 'Alt+r'],
  addText: ['Text einfügen', 'Alt+t'],
  addImage: ['Bild einfügen', 'Alt+i'],
  pen: ['Stift an / aus', 'Alt+p'],
  addAudio: ['Ton einfügen', 'Alt+a'],
  addEmbed: ['Internet einfügen', 'Alt+w'],
  shelf: ['Sammlung öffnen', 'Alt+e'],
  pagePanel: ['Seiteneinstellungen', 'Alt+s'],
  itemsPanel: ['Elementliste', 'Alt+l'],
  selectNext: ['Nächstes Element', 'Tab'],
  selectPrev: ['Vorheriges Element', 'Shift+Tab'],
  selectAll: ['Alle Elemente', 'Mod+a'],
  activate: ['Element gestalten', 'Enter'],
  copy: ['Kopieren', 'Mod+c'],
  paste: ['Einfügen', 'Mod+v'],
  moveLeft: ['Nach links (1 mm)', 'ArrowLeft'],
  moveRight: ['Nach rechts (1 mm)', 'ArrowRight'],
  moveUp: ['Nach oben (1 mm)', 'ArrowUp'],
  moveDown: ['Nach unten (1 mm)', 'ArrowDown'],
  moveLeft10: ['Nach links (10 mm)', 'Shift+ArrowLeft'],
  moveRight10: ['Nach rechts (10 mm)', 'Shift+ArrowRight'],
  moveUp10: ['Nach oben (10 mm)', 'Shift+ArrowUp'],
  moveDown10: ['Nach unten (10 mm)', 'Shift+ArrowDown'],
  bigger: ['Größer', 'Alt+ArrowUp'],
  smaller: ['Kleiner', 'Alt+ArrowDown'],
  rotateRight: ['Nach rechts drehen', 'Alt+Shift+ArrowRight'],
  rotateLeft: ['Nach links drehen', 'Alt+Shift+ArrowLeft'],
  delete: ['Entfernen', 'Delete'],
  duplicate: ['Duplizieren', 'Mod+d'],
  group: ['Gruppieren', 'Mod+g'],
  ungroup: ['Gruppe lösen', 'Mod+Shift+g'],
  front: ['Nach vorn', 'Mod+ArrowUp'],
  back: ['Nach hinten', 'Mod+ArrowDown'],
  lock: ['Sperren / Entsperren', 'Mod+l'],
  zoomIn: ['Ansicht vergrößern', 'Mod++'],
  zoomOut: ['Ansicht verkleinern', 'Mod+-'],
  zoomFit: ['Ganze Seite', 'Mod+0'],
  board: ['Tafelmodus', 'Alt+f'],
  boardNow: ['Tafelmodus mit Stift', 'Alt+Shift+f'],
  escape: ['Auswahl / Tafelmodus beenden', 'Escape'],
} as const;
export type EditorCommand = keyof typeof editorCommands;
export type Shortcuts = Record<EditorCommand, string>;
export const defaultShortcuts = Object.fromEntries(
  Object.entries(editorCommands).map(([id, [, key]]) => [id, key]),
) as Shortcuts;
export function keyChord(event: KeyboardEvent | React.KeyboardEvent) {
  const key =
    event.key.length === 1
      ? event.key.toLowerCase()
      : event.key === ' '
        ? 'Space'
        : event.key;
  return [
    event.ctrlKey || event.metaKey ? 'Mod' : '',
    event.altKey ? 'Alt' : '',
    event.shiftKey && key !== '+' ? 'Shift' : '',
    key,
  ]
    .filter(Boolean)
    .join('+');
}
