import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/** Hover a cut-off text (anything matching `selector`, default .trunc) to see all of it in a tooltip: a main line and a quieter sub line (a <small> or .sub inside).
 *  Only shows when the text really is cut off, after a short delay, and flips above near the bottom. Mount once, near the root. */
export function DescTip({ selector = '.trunc, [data-tip-full]' }: { selector?: string }) {
  const [tip, setTip] = useState<{ main: string; sub?: string; x: number; y: number; up: boolean } | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined; let cur: HTMLElement | null = null;
    const hide = () => { clearTimeout(timer); cur = null; setTip(null); };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest?.(selector) as HTMLElement | null;
      if (el === cur) return;
      hide(); if (!el || el.scrollWidth <= el.clientWidth + 1) return;
      cur = el;
      timer = setTimeout(() => {
        if (cur !== el || !el.isConnected) return;
        const subEl = el.querySelector('small, .sub'); let sub = subEl?.textContent?.trim() || undefined;
        const all = el.textContent ?? '';
        const main = (subEl ? all.replace(subEl.textContent ?? '', '') : all).trim();
        if (sub && sub.toLowerCase() === main.toLowerCase()) sub = undefined;
        const r = el.getBoundingClientRect(); const up = r.bottom + 90 > innerHeight;
        setTip({ main, sub, x: Math.max(8, Math.min(r.left - 9, innerWidth - 488)), y: up ? r.top - 6 : r.bottom + 6, up });
      }, 280);
    };
    document.addEventListener('mouseover', over); document.addEventListener('scroll', hide, true); addEventListener('blur', hide); document.addEventListener('mousedown', hide);
    return () => { clearTimeout(timer); document.removeEventListener('mouseover', over); document.removeEventListener('scroll', hide, true); removeEventListener('blur', hide); document.removeEventListener('mousedown', hide); };
  }, [selector]);
  if (!tip) return null;
  return createPortal(
    <div className="tip" role="tooltip" style={{ left: tip.x, ...(tip.up ? { bottom: innerHeight - tip.y } : { top: tip.y }) }}><div>{tip.main}</div>{tip.sub && <small>{tip.sub}</small>}</div>, document.body);
}
