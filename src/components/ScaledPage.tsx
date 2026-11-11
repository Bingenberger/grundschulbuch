'use client';
import { useEffect, useRef, useState } from 'react';
import { dimensions, type Page } from '@/lib/notebook-model';
import PageView from './PageView';
export default function ScaledPage({
  page,
  maxScale = 1,
  zoom = 1,
  decorative = false,
  children,
}: {
  page: Page;
  maxScale?: number;
  zoom?: number;
  decorative?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const size = dimensions(page);
  const px = 96 / 25.4;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Ignore tiny changes, so a scrollbar coming and going cannot make it jitter.
    const update = () => {
      const next = Math.min(maxScale, el.clientWidth / (size.width * px)) * zoom;
      setScale((old) => (Math.abs(old - next) < 0.004 * next ? old : next));
    };
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [size.width, maxScale, px, zoom]);
  return (
    <div
      ref={ref}
      aria-hidden={decorative || undefined}
      inert={decorative || undefined}
      className="scaled-page"
      style={{ width: '100%' }}
    >
      <div
        style={{
          width: size.width * px * scale,
          height: size.height * px * scale,
          position: 'relative',
          margin: 'auto',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <PageView page={page}>{children}</PageView>
        </div>
      </div>
    </div>
  );
}
