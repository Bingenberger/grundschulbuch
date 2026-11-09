'use client';
import { useEffect } from 'react';
import { flushEditor, useEditor } from '@/lib/editor-store';
import { childApi } from '@/lib/child-api';
/** Safari can restore a snapshot after logout. Hide the page before caching. */
export default function SharedDeviceGuard({
  enabled,
  schoolEndHour,
}: {
  enabled: boolean;
  schoolEndHour: number;
}) {
  useEffect(() => {
    const hide = () => {
      document.body.style.visibility = 'hidden';
    };
    const show = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload();
      else document.body.style.visibility = '';
    };
    window.addEventListener('pagehide', hide);
    window.addEventListener('pageshow', show);
    return () => {
      window.removeEventListener('pagehide', hide);
      window.removeEventListener('pageshow', show);
    };
  }, []);
  useEffect(() => {
    if (!enabled) return;
    let lastActivity = Date.now();
    let timer: ReturnType<typeof setTimeout>;
    let ending = false;
    const finish = async () => {
      if (ending) return;
      ending = true;
      if (useEditor.getState().mode === 'child' && !(await flushEditor())) {
        ending = false;
        return;
      }
      await childApi('logout').catch(() => undefined);
      window.location.replace('/kinder');
    };
    const activity = () => {
      lastActivity = Date.now();
      clearTimeout(timer);
      timer = setTimeout(() => void finish(), 590000);
    };
    const ping = setInterval(() => {
      if (Date.now() - lastActivity < 240000)
        void childApi('ping').catch(() => {
          if (!Object.keys(useEditor.getState().dirty).length) void finish();
          else
            useEditor.setState({
              error:
                'Bitte deine Lehrkraft fragen. Die Anmeldung ist abgelaufen.',
            });
        });
    }, 240000);
    const schoolEnd = setInterval(() => {
      const time = new Intl.DateTimeFormat('de-DE', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());
      const [h, m, se] = time.split(':').map(Number);
      if (h * 3600 + m * 60 + se >= schoolEndHour * 3600 - 30) void finish();
    }, 10000);
    activity();
    window.addEventListener('pointerdown', activity);
    window.addEventListener('keydown', activity);
    return () => {
      clearTimeout(timer);
      clearInterval(ping);
      clearInterval(schoolEnd);
      window.removeEventListener('pointerdown', activity);
      window.removeEventListener('keydown', activity);
    };
  }, [enabled, schoolEndHour]);
  return null;
}
