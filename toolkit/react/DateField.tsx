import type * as React from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

/** Date and month picker (decided: an S4 calendar pop-over on desktop, the phone's own picker on touch). Values are ISO: "2026-09-30" for a date, "2026-09" for a month.
 *  Typing still works (M/D/YYYY or YYYY-MM-DD; "Sep 2026" for a month) and is read when you leave the field. Keys in the calendar: arrows (a day or a week),
 *  Page Up / Down (a month, with Shift a year), Home / End (week start / end), Enter picks, Escape closes. Weeks start on Sunday (`weekStart={1}` for Monday). */
const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MS = MON.map(m => m.slice(0, 3));
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const p2 = (n: number) => (n < 10 ? '0' : '') + n;
const iso = (y: number, m: number, d: number) => `${y}-${p2(m + 1)}-${p2(d)}`;
const dateOf = (s: string) => { const a = s.split('-'); return new Date(+a[0], +a[1] - 1, +(a[2] || 1)); };
const isoOf = (d: Date) => iso(d.getFullYear(), d.getMonth(), d.getDate());
const mkey = (y: number, m: number) => iso(y, m, 1).slice(0, 7);
const fmtDate = (s: string) => { const d = dateOf(s); return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`; };
const fmtLong = (s: string) => { const d = dateOf(s); return `${MS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; };
const fmtMonth = (s: string) => { const d = dateOf(s); return `${MS[d.getMonth()]} ${d.getFullYear()}`; };

function parseDate(t: string): string | null {
  let y: number, mo: number, d: number; let m = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/);
  if (m) { mo = +m[1] - 1; d = +m[2]; y = +m[3]; if (y < 100) y += 2000; }
  else if ((m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) { y = +m[1]; mo = +m[2] - 1; d = +m[3]; } else return null;
  const dt = new Date(y, mo, d); return dt.getMonth() === mo && dt.getDate() === d ? iso(y, mo, d) : null;
}
function parseMonth(t: string): string | null {
  let y: number, mo: number; let m = t.match(/^([A-Za-z]{3,9})\.?\s+(\d{4})$/);
  if (m) { mo = MS.indexOf(m[1].slice(0, 1).toUpperCase() + m[1].slice(1, 3).toLowerCase()); y = +m[2]; }
  else if ((m = t.match(/^(\d{1,2})[/-](\d{4})$/)) || (m = t.match(/^(\d{4})-(\d{1,2})$/))) { const a = +m[1], b = +m[2]; if (a > 31) { y = a; mo = b - 1; } else { mo = a - 1; y = b; } } else return null;
  return mo >= 0 && mo < 12 ? mkey(y, mo) : null;
}
const chev = (d: 'l' | 'r') => <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d={d === 'l' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

interface CalProps { type: 'date' | 'month'; value: string; min?: string; max?: string; weekStart?: 0 | 1; onPick: (v: string) => void }
export function Calendar({ type, value, min = '', max = '', weekStart = 0, onPick }: CalProps) {
  const month = type === 'month', today = isoOf(new Date()), tNow = month ? today.slice(0, 7) : today;
  const lo = month ? min.slice(0, 7) : min, hi = month ? max.slice(0, 7) : max;
  const ok = (k: string) => !(lo && k < lo) && !(hi && k > hi);
  const base = value || (lo && tNow < lo ? lo : hi && tNow > hi ? hi : tNow);
  const [view, setView] = useState({ y: dateOf(base).getFullYear(), m: dateOf(base).getMonth() });
  const [cur, setCur] = useState(base);
  const body = useRef<HTMLDivElement>(null);
  const focusAfter = useRef(true);
  useEffect(() => { if (focusAfter.current) body.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus(); focusAfter.current = false; });
  const go = (k: string) => { const d = dateOf(k); setCur(k); setView({ y: d.getFullYear(), m: d.getMonth() }); focusAfter.current = true; };
  const nav = (k: number) => { setCur(''); setView(v => (month ? { y: v.y + k, m: v.m } : (d => ({ y: d.getFullYear(), m: d.getMonth() }))(new Date(v.y, v.m + k, 1)))); };
  const key = (e: React.KeyboardEvent) => {
    const d = dateOf(cur || value || base); let nx: string | null = null; const k = e.key;
    if (month) {
      const st = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 } as Record<string, number>)[k];
      if (st) nx = mkey(d.getFullYear(), d.getMonth() + st); else if (k === 'PageUp' || k === 'PageDown') nx = mkey(d.getFullYear() + (k === 'PageUp' ? -1 : 1), d.getMonth());
      else if (k === 'Home') nx = mkey(d.getFullYear(), 0); else if (k === 'End') nx = mkey(d.getFullYear(), 11);
    } else {
      const dd = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 } as Record<string, number>)[k], wd = (d.getDay() - weekStart + 7) % 7;
      if (dd) nx = isoOf(new Date(d.getFullYear(), d.getMonth(), d.getDate() + dd));
      else if (k === 'PageUp' || k === 'PageDown') { const mv = (k === 'PageUp' ? -1 : 1) * (e.shiftKey ? 12 : 1), last = new Date(d.getFullYear(), d.getMonth() + mv + 1, 0).getDate(); nx = isoOf(new Date(d.getFullYear(), d.getMonth() + mv, Math.min(d.getDate(), last))); }
      else if (k === 'Home') nx = isoOf(new Date(d.getFullYear(), d.getMonth(), d.getDate() - wd)); else if (k === 'End') nx = isoOf(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 6 - wd));
    }
    if (nx) { e.preventDefault(); if (ok(nx)) go(nx); }
  };
  const cells: React.ReactElement<{ tabIndex: number; disabled: boolean; className: string }>[] = [];
  if (month) for (let i = 0; i < 12; i++) { const k = mkey(view.y, i); cells.push(<button key={k} type="button" className={`dp-m ${k === value ? 'on' : k === tNow ? 'today' : ''}`} tabIndex={k === cur ? 0 : -1} disabled={!ok(k)} aria-pressed={k === value} aria-label={`${MON[i]} ${view.y}`} onClick={() => onPick(k)}>{MS[i]}</button>); }
  else {
    const lead = (new Date(view.y, view.m, 1).getDay() - weekStart + 7) % 7;
    for (let i = 0; i < 42; i++) { const dt = new Date(view.y, view.m, 1 - lead + i), k = isoOf(dt); cells.push(<button key={k} type="button" className={`dp-d ${k === value ? 'on' : k === today ? 'today' : ''} ${dt.getMonth() !== view.m ? 'dim' : ''}`} tabIndex={k === cur ? 0 : -1} disabled={!ok(k)} aria-pressed={k === value} aria-label={fmtLong(k)} onClick={() => onPick(k)}>{dt.getDate()}</button>); }
  }
  // when nothing in view holds the keyboard (after paging), the first usable cell does
  const noTab = !cells.some(c => c.props.tabIndex === 0); if (noTab) { const i = cells.findIndex(c => !c.props.disabled && !String(c.props.className).includes('dim')); if (i >= 0) cells[i] = { ...cells[i], props: { ...cells[i].props, tabIndex: 0 } }; }
  return (
    <div className="dp" onKeyDown={key}>
      <div className="dp-head"><button type="button" className="btn icon subtle" aria-label={month ? 'Previous Year' : 'Previous Month'} onClick={() => nav(-1)}>{chev('l')}</button>
        <b className="dp-title" aria-live="polite">{month ? view.y : `${MON[view.m]} ${view.y}`}</b>
        <button type="button" className="btn icon subtle" aria-label={month ? 'Next Year' : 'Next Month'} onClick={() => nav(1)}>{chev('r')}</button></div>
      <div ref={body}>{month ? <div className="dp-months" role="group" aria-label={String(view.y)}>{cells}</div>
        : <div className="dp-grid" role="group" aria-label={`${MON[view.m]} ${view.y}`}>{[0, 1, 2, 3, 4, 5, 6].map(i => <span key={i} className="dp-dow" aria-hidden="true">{DOW[(i + weekStart) % 7]}</span>)}{cells}</div>}</div>
      <div className="dp-foot"><button type="button" className="btn subtle sm" onClick={() => onPick('')}>Clear</button>
        <button type="button" className="btn subtle sm" disabled={!ok(tNow)} onClick={() => onPick(tNow)}>{month ? 'This Month' : 'Today'}</button></div>
    </div>
  );
}

const useCoarse = () => {
  const q = typeof matchMedia === 'function' ? matchMedia('(pointer: coarse)') : null;
  const [c, setC] = useState(!!q?.matches);
  useEffect(() => { if (!q) return; const f = () => setC(q.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f); }, [q]);
  return c;
};

interface FieldProps { value: string; onChange: (v: string) => void; type?: 'date' | 'month'; min?: string; max?: string; label: string; error?: string; weekStart?: 0 | 1; className?: string; disabled?: boolean }
/** <DateField label="Posting Date" value={iso} onChange={setIso} min="2026-09-01" /> · <DateField type="month" label="Month" … /> */
export function DateField({ value, onChange, type = 'date', min = '', max = '', label, error, weekStart = 0, className = '', disabled }: FieldProps) {
  const coarse = useCoarse(), id = useId(), month = type === 'month';
  const mn = month ? min.slice(0, 7) : min, mx = month ? max.slice(0, 7) : max;
  const shown = value ? (month ? fmtMonth(value) : fmtDate(value)) : '';
  const [text, setText] = useState(shown), [msg, setMsg] = useState(''), [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null), pop = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState({ left: 0, top: 0 });
  useEffect(() => setText(shown), [shown]);
  useEffect(() => {
    if (!open || !box.current || !pop.current) return;
    const r = box.current.getBoundingClientRect(), w = pop.current.offsetWidth, h = pop.current.offsetHeight;
    setAt({ left: Math.min(Math.max(8, r.left), innerWidth - w - 8), top: r.bottom + 6 + h > innerHeight - 8 && r.top > h + 14 ? r.top - h - 6 : r.bottom + 6 });
    const away = (e: MouseEvent) => { if (!pop.current?.contains(e.target as Node) && !box.current?.contains(e.target as Node)) setOpen(false); };
    const close = () => setOpen(false);
    document.addEventListener('mousedown', away, true); addEventListener('resize', close);
    return () => { document.removeEventListener('mousedown', away, true); removeEventListener('resize', close); };
  }, [open]);
  const err = error || msg;
  const read = () => {
    const t = text.trim(); if (!t) { setMsg(''); if (value) onChange(''); return; }
    const v = (month ? parseMonth : parseDate)(t);
    if (!v) { setMsg(month ? 'Use a month and year, like Sep 2026' : 'Use M/D/YYYY, like 9/30/2026'); return; }
    if ((mn && v < mn) || (mx && v > mx)) { setMsg(`Pick a date between ${min ? fmtLong(min) : 'the start'} and ${max ? fmtLong(max) : 'any later day'}`); return; }
    setMsg(''); onChange(v); setText(month ? fmtMonth(v) : fmtDate(v));
  };
  return (
    <div className={`fld ${err ? 'bad' : ''} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div ref={box} className={`dp-field ${coarse ? 'native' : ''}`}>
        {coarse
          ? <input id={id} type={type} value={value} min={mn || undefined} max={mx || undefined} disabled={disabled} aria-invalid={!!err} onChange={e => onChange(e.target.value)} />
          : <input id={id} ref={input} type="text" inputMode={month ? undefined : 'numeric'} placeholder={month ? 'Sep 2026' : 'M/D/YYYY'} autoComplete="off" value={text} disabled={disabled} aria-invalid={!!err}
              onChange={e => setText(e.target.value)} onBlur={read} onKeyDown={e => { if (e.key === 'ArrowDown' && e.altKey) { e.preventDefault(); setOpen(true); } }} />}
        {!coarse && <button type="button" className="btn icon subtle sm dp-open" aria-label={`Choose ${label}`} aria-haspopup="dialog" aria-expanded={open} disabled={disabled} onClick={() => setOpen(o => !o)}><Icon name="calendar" /></button>}
      </div>
      {err && <span className="err" role="alert">{err}</span>}
      {open && createPortal(
        <div ref={pop} className="dp-pop" style={at} onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); input.current?.focus(); } else if (e.key === 'Tab') setOpen(false); }}>
          <Calendar type={type} value={value} min={min} max={max} weekStart={weekStart} onPick={v => { onChange(v); setMsg(''); setOpen(false); input.current?.focus(); }} />
        </div>, document.body)}
    </div>
  );
}
