export type ChildFeature =
  | 'pen'
  | 'eraser'
  | 'text'
  | 'image'
  | 'imageUpload'
  | 'imageSearch'
  | 'imageEdit'
  | 'pages'
  | 'readAloud'
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
