export type ChildFeature =
  | 'pen'
  | 'eraser'
  | 'text'
  | 'image'
  | 'audio'
  | 'insert'
  | 'internet'
  | 'page'
  | 'imageUpload'
  | 'imageSearch'
  | 'imageEdit'
  | 'pages'
  | 'readAloud'
  | 'reader'
  | 'brushFountain'
  | 'brushWater'
  | 'fill'
  | 'eyedropper'
  | 'guides'
  | 'shapeRecognition'
  | 'eraserOptions'
  | 'elementStyle';
export const CHILD_FEATURES: readonly ChildFeature[];
export const CHILD_DEFAULTS: readonly ChildFeature[];
export function cleanChildFeatures(list: unknown): ChildFeature[];
