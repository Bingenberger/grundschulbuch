'use client';
// Hör-Memory and Was hörst du? of Lernsachen-Heft 1.47.3, drawn and run by the
// reference itself (reference/tools-runtime.ts). The built-in sounds are
// synthesised on the device; own recordings and pictures come from the school
// server.
import type { PageElement } from '@/lib/notebook-model';
import { listenAssets, listenSettings } from '@/lib/learning/hoeren';
import { renderListen, stopListen, TOOLS_CSS } from '@/lib/reference/tools-runtime';
import ReferenceWidget from './ReferenceWidget';

export default function ListenWidget({ element }: { element: PageElement }) {
  const listen = listenSettings(element.settings?.listen);
  return <ReferenceWidget element={element} kind="listen" field="listen" value={listen} render={renderListen} options={{ assets: listenAssets(listen) }} css={TOOLS_CSS + LISTEN_HOST_CSS} stop={() => stopListen()} />;
}

/** The tool host of the reference fills its element; ours is the widget box. */
export const LISTEN_HOST_CSS = '.lh-wg-listen{position:relative;width:100%;height:100%}';
