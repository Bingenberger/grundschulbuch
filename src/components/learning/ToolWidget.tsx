'use client';
// A tool of Lernsachen-Heft 1.47.3 (Strichliste, Glücksrad, Suchbild, Muster …),
// drawn and run by the reference itself (reference/tools-runtime.ts). What the
// reference keeps (e.g. the counts of the Strichliste, also when the Glücksrad
// on the same page counts into it) is saved as the response of the element.
import { useEffect, useLayoutEffect, useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { fingerprint, isTool, toolAssets, toolCurrent, toolSpec, TOOL_IDS, type ToolId } from '@/lib/learning/werkzeuge';
import { TOOLS_CSS } from '@/lib/reference/tools-runtime';
import ReferenceWidget from './ReferenceWidget';
import { useLearning } from './Runtime';

/** Where the reference's save calls go: element id → save of that element. */
const savers = new Map<string, (a: unknown, b?: unknown) => void>();
let registered = false;
function registerSavers() {
  if (registered) return;
  registered = true;
  for (const tool of TOOL_IDS) toolSpec(tool).register?.((id, a, b) => savers.get(id)?.(a, b));
}

export const TOOL_HOST_CSS = '.reference-widget[class*="lh-wg-"]{position:relative}';

export default function ToolWidget({ element }: { element: PageElement }) {
  const tool = (isTool(element.settings?.tool) ? element.settings.tool : 'tally') as ToolId;
  const spec = toolSpec(tool);
  const { update } = useLearning(element);
  const config = toolCurrent(tool, element.settings, element.response);
  const base = fingerprint(element.settings?.werkzeug);
  // New settings start the tool afresh (new picture, first pattern …), as in the reference.
  // (The widget has drawn already – its effects run first – so it is drawn again.)
  const shown = useRef(base);
  useLayoutEffect(() => {
    if (shown.current === base) return;
    shown.current = base;
    if (spec.reset) { spec.reset(element.id); spec.redraw(element.id); }
  }, [base, element.id, spec]);
  useEffect(() => {
    registerSavers();
    if (!spec.state) return;
    savers.set(element.id, (a, b) => {
      const values = [a, b];
      update({ werkzeug: { base, state: Object.fromEntries(spec.state!.map((key, i) => [key, values[i]])) } } as never);
    });
    return () => { savers.delete(element.id); };
  }, [element.id, base, spec, update]);
  return <ReferenceWidget element={element} kind={tool} field={spec.field} value={config} render={spec.draw} options={{ assets: toolAssets(config) }} css={TOOLS_CSS + TOOL_HOST_CSS} />;
}
