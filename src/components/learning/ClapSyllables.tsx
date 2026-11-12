'use client';
// “Silben klatschen” of the reference.
import type { PageElement } from '@/lib/notebook-model';
import { CLAP_CSS, cleanClap, renderClap } from '@/lib/reference/clap';
import { safePicture } from '@/lib/reference/clap-defaults';
import ReferenceWidget from './ReferenceWidget';

export default function ClapSyllables({ element }: { element: PageElement }) {
  const clap = cleanClap(element.settings?.clap, safePicture) as { words: { img?: string }[] };
  const assets = Object.fromEntries(clap.words.filter((w) => w.img).map((w) => [w.img, { dataUrl: w.img }]));
  return <ReferenceWidget element={element} kind="clap" field="clap" value={clap} render={renderClap} options={{ assets }} css={CLAP_CSS} />;
}
