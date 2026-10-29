import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

export interface ToastAction { label: string; run: () => void }
interface Msg { text: string; action?: ToastAction; anchor?: RefObject<HTMLElement | null> }

/** const { show, node } = useToast(); render {node} once near the root. show("Saved") stays ~4s; with an action ("Undo") 6.5s, time to reach it.
 *  Pass anchor (a ref to the Undo / Redo button) for an undo pop-up: it sits next to that button with a pointer to it (.toast.undo-pop). */
export function useToast() {
  const [msg, setMsg] = useState<Msg | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const show = (text: string, action?: ToastAction, anchor?: RefObject<HTMLElement | null>) => {
    setMsg({ text, action, anchor }); clearTimeout(t.current); t.current = setTimeout(() => setMsg(null), action ? 6500 : 4000);
  };
  const node = msg ? <ToastView msg={msg} done={() => setMsg(null)} /> : null;
  return { show, node };
}

function ToastView({ msg, done }: { msg: Msg; done: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<{ left: number; top: number; arrow: number; up: boolean } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current, a = msg.anchor?.current?.getBoundingClientRect(); if (!el || !a) return setPlace(null);
    const w = el.offsetWidth, h = el.offsetHeight, up = a.bottom + 12 + h > innerHeight - 8 && a.top > h + 12;
    const left = Math.min(Math.max(8, a.right - w), innerWidth - w - 8);
    setPlace({ left, top: up ? a.top - h - 10 : a.bottom + 10, arrow: Math.min(Math.max(16, a.left + a.width / 2 - left), w - 16), up });
  }, [msg]);
  const cls = `toast ${msg.anchor ? 'undo-pop' : ''} ${place?.up ? 'up' : ''}`;
  return (
    <div ref={ref} className={cls} role="status" style={place ? { left: place.left, top: place.top, ['--arrow-x' as string]: `${place.arrow}px` } : undefined}>
      <span>{msg.text}</span>
      {msg.action && <button type="button" onClick={() => { const a = msg.action!; done(); a.run(); }}>{msg.action.label}</button>}
    </div>
  );
}
