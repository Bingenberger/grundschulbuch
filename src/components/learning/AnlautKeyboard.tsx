'use client';
// “Anlaut-Tastatur” of the reference, with its pictures and recorded sounds.
import type { PageElement } from '@/lib/notebook-model';
import { ANLAUT_CSS, cleanAnlaut, renderAnlaut } from '@/lib/reference/anlaut';
import { safeAnlautAsset } from '@/lib/reference/anlaut-defaults';
import ReferenceWidget from './ReferenceWidget';
import { decodeMaps } from '@/lib/reference/keys';

type Anlaut = { keys: Record<string, { img?: string; alt?: { img?: string } }>; sounds: Record<string, string>; practice?: { words: { img?: string }[] } };

export default function AnlautKeyboard({ element }: { element: PageElement }) {
  const a = cleanAnlaut(decodeMaps(element.settings?.anlaut, ['keys', 'sounds']), safeAnlautAsset) as Anlaut;
  // Pictures and recordings are their own “assets”: the path is the id.
  const paths = [...Object.values(a.keys).flatMap((k) => [k.img, k.alt?.img]), ...Object.values(a.sounds), ...(a.practice?.words ?? []).map((w) => w.img)].filter((p): p is string => !!p);
  const assets = Object.fromEntries(paths.map((p) => [p, { dataUrl: p }]));
  return <ReferenceWidget element={element} kind="anlaut" field="anlaut" value={a} render={renderAnlaut} options={{ assets }} css={ANLAUT_CSS} />;
}
