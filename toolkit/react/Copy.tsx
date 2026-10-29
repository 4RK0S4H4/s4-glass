import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

/** Copy text to the clipboard (also from a file:// page). */
export async function copyText(text: string): Promise<boolean> {
  try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; } } catch { /* fall back */ }
  const ta = document.createElement('textarea');
  ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch { ok = false; }
  ta.remove(); return ok;
}

/** One clock for a copy box: green with a tick for 0.6s, then the green fades (.fade) with the tick still there, so colour and icon go back together. */
const COPIED_MS = 600, FADE_MS = 140;
function useCopied(): ['' | 'done' | 'fade', () => void] {
  const [phase, setPhase] = useState<'' | 'done' | 'fade'>('');
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const start = () => { clearTimeout(t.current); setPhase('done'); t.current = setTimeout(() => { setPhase('fade'); t.current = setTimeout(() => setPhase(''), FADE_MS); }, COPIED_MS); };
  return [phase, start];
}

/** The "(1,234.56)" bracket look: the two brackets dropped a touch (.brk) so the comma doesn't stand out next to them. */
export const bracketed = (t: string): ReactNode => (/^\(.*\)$/.test(t) ? <><span className="brk">(</span>{t.slice(1, -1)}<span className="brk">)</span></> : t);

/** One look for every copyable value: in tables plain text that shows its box and icon on hover, elsewhere always a soft box.
 *  iconOnly: just the icon. block: several lines in one box (pass them as children). An empty value shows "–" (or a dimmed icon when iconOnly). */
export function CopyCell({ value, label, onCopied, children, className = '', iconOnly, block }: { value: string; label: string; onCopied?: () => void; children?: ReactNode; className?: string; iconOnly?: boolean; block?: boolean }) {
  const [phase, start] = useCopied();
  if (!value) return iconOnly ? <span className="copy icon-only disabled" aria-hidden><Icon name="copy" size={13} /></span> : <span className="copy empty">–</span>;
  const go = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
    e.preventDefault(); e.stopPropagation();
    void copyText(value).then(ok => { if (ok) { start(); onCopied?.(); } });
  };
  return (
    // a span, not a <button>, so it can sit inside rows, labels and other buttons
    <span role="button" tabIndex={0} className={`copy ${phase} ${block ? 'block' : ''} ${iconOnly ? 'icon-only' : ''} ${className}`} aria-label={`Copy ${label}: ${value}`}
      onClick={go} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') go(e); }}>
      {iconOnly ? null : <span>{children ?? value}</span>}<Icon name="copy" size={13} />
    </span>
  );
}

/** M/D/YYYY, the way SAP and most forms take a date. */
export const fmtSapDate = (iso: string) => `${+iso.slice(5, 7)}/${+iso.slice(8, 10)}/${iso.slice(0, 4)}`;
/** A date in a table: click to copy it as M/D/YYYY. `short` shows M/D only. */
export function DateCopy({ iso, short }: { iso: string; short?: boolean }) {
  return <CopyCell value={fmtSapDate(iso)} label="date" className="date">{short ? `${+iso.slice(5, 7)}/${+iso.slice(8, 10)}` : undefined}</CopyCell>;
}

/** An amount: a copy chip showing (1,234.56) for a negative, copying -1,234.56 so it pastes as a negative number. `cents` is an integer. */
export function Money({ cents, copy = true }: { cents: number | undefined; copy?: boolean }) {
  if (cents === undefined) return <span className="copy empty">–</span>;
  const abs = (Math.abs(cents) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const shown = cents < 0 ? `(${abs})` : abs;
  const body = <>{bracketed(shown)}{cents >= 0 && <span className="psp" aria-hidden="true">)</span>}</>;   // positives reserve the ")" width so columns line up
  if (!copy) return <span className={cents < 0 ? 'neg' : 'pos'}>{body}</span>;
  return <CopyCell value={(cents < 0 ? '-' : '') + abs} label="amount" className={cents < 0 ? '' : 'pos'}>{body}</CopyCell>;
}
