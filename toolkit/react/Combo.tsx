import { useEffect, useId, useRef, useState, type InputHTMLAttributes } from 'react';
import { createPortal } from 'react-dom';

/** Suggestions while typing, replacing <datalist>: `options` are the suggestions, the value is free text (nothing is forced to match).
 *  Matches contain what was typed, starting-with first, the typed part in bold. Arrows move, Enter or a click picks, Escape closes. */
interface ComboProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'list'> { value: string; onChange: (v: string) => void; options: string[] }
export function Combo({ value, onChange, options, ...rest }: ComboProps) {
  const id = useId(), el = useRef<HTMLInputElement>(null), list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false), [act, setAct] = useState(-1), [at, setAt] = useState<{ left: number; minWidth: number; maxHeight: number; top?: number; bottom?: number; up: boolean } | null>(null);
  const q = value.trim().toLowerCase();
  const hits = options.filter(v => v.toLowerCase().includes(q) && v.toLowerCase() !== q).sort((a, b) => Number(b.toLowerCase().startsWith(q)) - Number(a.toLowerCase().startsWith(q))).slice(0, 50);
  const show = open && hits.length > 0;
  useEffect(() => {
    if (!show || !el.current) return;
    const r = el.current.getBoundingClientRect(), below = innerHeight - r.bottom - 12, above = r.top - 12, up = below < 180 && above > below;
    setAt({ left: Math.min(r.left, innerWidth - 168), minWidth: Math.max(r.width, 160), maxHeight: Math.min(280, up ? above : below), ...(up ? { bottom: innerHeight - r.top + 4 } : { top: r.bottom + 4 }), up });
  }, [show, value]);
  useEffect(() => { if (show && act >= 0) list.current?.children[act]?.scrollIntoView({ block: 'nearest' }); }, [act, show]);
  const pick = (v: string) => { onChange(v); setOpen(false); setAct(-1); };
  return (
    <>
      <input {...rest} ref={el} type="text" role="combobox" aria-autocomplete="list" aria-expanded={show} aria-controls={id} aria-activedescendant={show && act >= 0 ? `${id}-${act}` : undefined} autoComplete="off" value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setAct(-1); }} onFocus={() => { if (value) setOpen(true); }} onBlur={() => setOpen(false)}
        onKeyDown={e => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { if (!hits.length) return; e.preventDefault(); setOpen(true); setAct(a => (e.key === 'ArrowDown' ? Math.min(hits.length - 1, a + 1) : Math.max(0, a - 1))); }
          else if (e.key === 'Enter' && show && act >= 0) { e.preventDefault(); pick(hits[act]); }
          else if (e.key === 'Escape' && show) { e.preventDefault(); e.stopPropagation(); setOpen(false); }
        }} />
      {show && at && createPortal(
        <ul ref={list} id={id} role="listbox" className={`sel-list ${at.up ? 'up' : ''}`} style={{ left: at.left, minWidth: at.minWidth, maxHeight: at.maxHeight, top: at.top, bottom: at.bottom }}>
          {hits.map((v, i) => { const k = q ? v.toLowerCase().indexOf(q) : -1; return (
            <li key={v} id={`${id}-${i}`} role="option" aria-selected={i === act} className={i === act ? 'act' : ''} onMouseMove={() => setAct(i)} onMouseDown={e => { e.preventDefault(); pick(v); }}>
              <span>{k >= 0 ? <>{v.slice(0, k)}<mark>{v.slice(k, k + q.length)}</mark>{v.slice(k + q.length)}</> : v}</span></li>); })}
        </ul>, document.body)}
    </>
  );
}
