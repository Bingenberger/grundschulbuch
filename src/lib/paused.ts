/**
 * Functions that are switched off for now (decision 12 November 2026): the
 * worksheet generator and “Mit KI entwerfen” are not part of the reference
 * and wait until the learning tools are rebuilt. The code stays; set to true
 * to bring an entry point back.
 */
export const ENABLED = {
  worksheetGenerator: false,
  aiDesign: false,
} as const;
