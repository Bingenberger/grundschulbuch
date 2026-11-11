'use client';
import { uuid, type PageElement } from '@/lib/notebook-model';
import { defaultSettings } from '@/lib/learning/catalog';

export function audioElement(src: string, title: string): PageElement {
  return { id: uuid(), type: 'audio', x: 20, y: 25, width: 28, height: 28, rotation: 0, locked: false, color: '#253c42', src, alt: title };
}

/** Empty sound button with a task; tapping it lets children record. */
export function audioPlaceholder(label: string): PageElement {
  return {
    id: uuid(), type: 'audio', x: 20, y: 25, width: 95, height: 20, rotation: 0, locked: false, color: '#253c42',
    placeholder: label.trim().slice(0, 200), alt: '',
  };
}

export function cassetteRecorder(): PageElement {
  return {
    id: uuid(), type: 'widget', widgetKind: 'recorder', x: 20, y: 25, width: 125, height: 108, rotation: 0, locked: false,
    color: '#253c42', settings: { ...defaultSettings('recorder'), title: 'Meine Aufnahme' },
  };
}

export const isAudioPlaceholder = (el?: PageElement | null) =>
  !!el && el.type === 'audio' && typeof el.placeholder === 'string';

/** Puts a recording into an element: a sound button or a recorder/studio widget. */
export function withRecording(el: PageElement, src: string, title: string): PageElement {
  if (el.type === 'audio') return { ...el, src, alt: title || el.placeholder || 'Tonaufnahme' };
  return {
    ...el,
    response: {
      ...el.response,
      recordingSrc: src,
      recordings: [
        ...(Array.isArray(el.response?.recordings) ? el.response.recordings : []),
        { title: title || 'Aufnahme', src, offset: 0, volume: 1 },
      ],
    },
  };
}
