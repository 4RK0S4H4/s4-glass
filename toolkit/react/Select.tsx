import { Children, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/** Drop-in for <select> with <option> children, drawn by S4 Glass (button.sel + .sel-list in s4.css).
 *  Keys: arrows, Home, End, type-ahead, Enter or Space picks, Escape closes (a closed one leaves Escape to the dialog around it).
 *  Opens upward near the bottom of the window; a tick marks the current option. Touch screens (pointer: coarse) get the native <select>,
 *  because the phone's own picker is the better experience there. */
interface SelectProps { value: string | number; onChange: (e: { target: { value: string } }) => void; children?: ReactNode; 'aria-label'?: string; className?: string; disabled?: boolean }

const useCoarse = () => {
  const q = typeof matchMedia === 'function' ? matchMedia('(pointer: coarse)') : null;
  const [c, setC] = useState(!!q?.matches);
  useEffect(() => { if (!q) return; const f = () => setC(q.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f); }, [q]);
  return c;
};

export function Select(props: SelectProps) {
  const coarse = useCoarse();
  const opts = Children.toArray(props.children).filter((c): c is ReactElement<{ value?: string; children?: ReactNode }> => isValidElement(c)).map(c => {
    const label = Children.toArray(c.props.children).join('');
    return { value: c.props.value !== undefined ? String(c.props.value) : label, label };
  });
  if (coarse) return <select className={props.className} value={props.value} disabled={props.disabled} aria-label={props['aria-label']} onChange={props.onChange as never}>{props.children}</select>;
  return <ThemedSelect {...props} opts={opts} />;
}

function ThemedSelect({ value, onChange, opts, ...rest }: SelectProps & { opts: { value: string; label: string }[] }) {
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null); const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false); const [act, setAct] = useState(0);
  const [pos, setPos] = useState({ left: 0, top: 0, width: 0, maxH: 300, up: false });
  const type = useRef({ s: '', t: 0 });
  const cur = Math.max(0, opts.findIndex(o => o.value === String(value)));
  const show = () => { setAct(cur); setOpen(true); };
  const pick = (i: number) => { setOpen(false); btn.current?.focus(); if (opts[i] && opts[i].value !== String(value)) onChange({ target: { value: opts[i].value } }); };

  useLayoutEffect(() => {
    if (!open || !btn.current) return;
    const r = btn.current.getBoundingClientRect(); const below = innerHeight - r.bottom - 12; const above = r.top - 12; const up = below < 180 && above > below;
    setPos({ left: r.left, top: up ? r.top : r.bottom, width: Math.max(r.width, 160), maxH: Math.min(320, up ? above : below), up });
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!btn.current?.contains(e.target as Node) && !list.current?.contains(e.target as Node)) setOpen(false); };
    const close = () => setOpen(false);
    document.addEventListener('mousedown', away); addEventListener('resize', close); addEventListener('blur', close);
    return () => { document.removeEventListener('mousedown', away); removeEventListener('resize', close); removeEventListener('blur', close); };
  }, [open]);
  useEffect(() => { if (open) list.current?.children[act]?.scrollIntoView({ block: 'nearest' }); }, [act, open, pos]);

  const key = (e: React.KeyboardEvent) => {
    const n = opts.length; if (!n) return;
    if (e.key === 'Escape' && !open) return;
    const typing = e.key.length === 1 && !e.ctrlKey && !e.metaKey && e.key !== ' ';
    if (e.key === 'Tab') { setOpen(false); return; }
    if (!(['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape'].includes(e.key) || typing)) return;
    e.preventDefault();
    if (!open && !typing) { show(); return; }
    if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); return; }
    if (e.key === 'ArrowDown') setAct(a => Math.min(n - 1, a + 1));
    else if (e.key === 'ArrowUp') setAct(a => Math.max(0, a - 1));
    else if (e.key === 'Home') setAct(0); else if (e.key === 'End') setAct(n - 1);
    else if (e.key === 'Enter' || e.key === ' ') pick(act);
    else {
      const now = Date.now(); type.current.s = (now - type.current.t > 700 ? '' : type.current.s) + e.key.toLowerCase(); type.current.t = now;
      const from = open ? act : cur;
      const hit = [...opts.keys()].map(k => (k + from + (type.current.s.length === 1 ? 1 : 0)) % n).find(k => opts[k].label.toLowerCase().startsWith(type.current.s));
      if (hit !== undefined) { if (open) setAct(hit); else if (opts[hit].value !== String(value)) onChange({ target: { value: opts[hit].value } }); }
    }
  };

  return (
    <>
      <button ref={btn} type="button" className={`sel ${rest.className ?? ''}`} role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={id} aria-label={rest['aria-label']}
        aria-activedescendant={open ? `${id}-${act}` : undefined} disabled={rest.disabled} onClick={() => (open ? setOpen(false) : show())} onKeyDown={key}>
        <span className="sel-v">{opts[cur]?.label ?? ''}</span>
        <svg className="sel-c" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && createPortal(
        <ul ref={list} id={id} role="listbox" aria-label={rest['aria-label']} className={`sel-list ${pos.up ? 'up' : ''}`}
          style={{ left: pos.left, minWidth: pos.width, maxHeight: pos.maxH, ...(pos.up ? { bottom: innerHeight - pos.top + 4 } : { top: pos.top + 4 }) }}>
          {opts.map((o, i) => (
            <li key={o.value + i} id={`${id}-${i}`} role="option" aria-selected={o.value === String(value)} className={`${i === act ? 'act' : ''} ${o.value === String(value) ? 'on' : ''}`}
              onMouseMove={() => setAct(i)} onMouseDown={e => e.preventDefault()} onClick={() => pick(i)}>{o.label}{o.value === String(value) && <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.3l2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}</li>
          ))}
        </ul>, document.body)}
    </>
  );
}
