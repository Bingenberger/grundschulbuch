'use client';
// Programmieren of Lernsachen-Heft 1.47.3: a floor robot on a carpet, moved by
// arrow cards or keys – drawn and run by the reference itself
// (reference/tools-runtime.ts).
import type { PageElement } from '@/lib/notebook-model';
import { CODE_CSS, codeConfig, renderCode } from '@/lib/reference/tools-runtime';
import ReferenceWidget from './ReferenceWidget';

export const codeSettings = (raw: unknown) => codeConfig(raw) as Record<string, unknown>;

export default function CodeWidget({ element }: { element: PageElement }) {
  return <ReferenceWidget element={element} kind="code" field="pg" value={codeSettings(element.settings?.pg)} render={renderCode} css={CODE_CSS} />;
}
