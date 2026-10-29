import { useLayoutEffect, useRef, type RefObject } from 'react';

/** Sliding selection pill: measures the active child of `ref` and publishes its box as --sx/--sy/--sw/--sh, so the stylesheet can slide one
 *  indicator between options. `slide-ready` is added only after the first measurement, so nothing animates in from 0 on load. */
export function useSlider(ref: RefObject<HTMLElement | null>, activeSel: string, key: unknown) {
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const place = () => {
      const a = el.querySelector<HTMLElement>(activeSel);
      if (!a) { el.classList.remove('has-slide'); return; }
      el.style.setProperty('--sx', a.offsetLeft + 'px'); el.style.setProperty('--sy', a.offsetTop + 'px');
      el.style.setProperty('--sw', a.offsetWidth + 'px'); el.style.setProperty('--sh', a.offsetHeight + 'px');
      el.classList.add('has-slide');
    };
    const jump = () => { const was = el.classList.contains('slide-ready'); el.classList.remove('slide-ready'); place(); if (was) { void el.offsetWidth; el.classList.add('slide-ready'); } };   // a resize moves the pill without sliding
    place();
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('slide-ready')));
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(jump) : null; ro?.observe(el);
    if (document.fonts?.status === 'loading') void document.fonts.ready.then(jump);
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); };
  }, [ref, activeSel, key]);
}

/** The segmented filter: one sliding pill, a count per option. */
export function SegFilter<T extends string>({ value, onChange, options, label = 'Show' }: { value: T; onChange: (v: T) => void; options: { id: T; label: string; n?: number; hint?: string }[]; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useSlider(ref, 'button.on', value);
  return (
    <div ref={ref} className="seg" role="group" aria-label={label}>
      {options.map(o => (
        <button key={o.id} type="button" aria-pressed={value === o.id} className={value === o.id ? 'on' : ''} aria-label={o.hint ? `${o.label}: ${o.hint}` : undefined} onClick={() => onChange(o.id)}>
          {o.label}{o.n !== undefined && <span className="n">{o.n}</span>}
        </button>
      ))}
    </div>
  );
}
