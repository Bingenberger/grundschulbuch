// Functions a teacher can switch on or off for children (per class or per
// child). Shared by the server (validation) and the editor (src/lib/features.ts).
export const CHILD_FEATURES = [
  'pen',
  'eraser',
  'text',
  'image',
  'pages',
  'readAloud',
  'brushFountain',
  'brushWater',
  'fill',
  'eyedropper',
  'guides',
  'shapeRecognition',
  'eraserOptions',
  'elementStyle',
];

/** Used while a class has no own setting. */
export const CHILD_DEFAULTS = CHILD_FEATURES.filter((f) => f !== 'brushFountain');

/** Returns a clean list or throws a German message for invalid input. */
export function cleanChildFeatures(list) {
  if (
    !Array.isArray(list) ||
    list.length > CHILD_FEATURES.length * 2 ||
    list.some((f) => typeof f !== 'string' || !CHILD_FEATURES.includes(f))
  )
    throw new Error('Unbekannte Funktion für Kinder.');
  return CHILD_FEATURES.filter((f) => list.includes(f));
}
