import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

const stack: symbol[] = [];
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** A dialog (becomes a bottom sheet on a phone). `dirty` names what would be lost if it closed by accident ("the queued files"):
 *  then a click on the backdrop does nothing and Escape asks "Discard the queued files?" inside the dialog (Keep Editing / Discard).
 *  Tab stays inside, Escape closes only the top dialog, and focus returns to where it was on close. A dropdown or menu inside
 *  that handles Escape itself calls preventDefault, so the dialog leaves it alone. */
export function Modal({ title, onClose, children, footer, wide, dirty }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean; dirty?: string | false }) {
  const [ask, setAsk] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dirtyRef = useRef(dirty); dirtyRef.current = dirty;
  const closeRef = useRef(onClose); closeRef.current = onClose;
  useEffect(() => {
    const id = Symbol('modal'); stack.push(id);
    const back = document.activeElement as HTMLElement | null;
    const h = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === 'Escape') { if (e.defaultPrevented) return; if (dirtyRef.current) setAsk(a => !a); else closeRef.current(); return; }
      if (e.key !== 'Tab' || !ref.current) return;
      const els = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(x => x.offsetParent !== null || x === document.activeElement);
      if (!els.length) { e.preventDefault(); return; }
      const first = els[0], last = els[els.length - 1], cur = document.activeElement;
      if (!ref.current.contains(cur)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && cur === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && cur === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', h);
    if (ref.current && !ref.current.contains(document.activeElement)) (ref.current.querySelector<HTMLElement>('.body input,.body textarea,.body select,.body .drop') ?? ref.current.querySelector<HTMLElement>('footer .primary,footer button'))?.focus();
    return () => { window.removeEventListener('keydown', h); const i = stack.indexOf(id); if (i >= 0) stack.splice(i, 1); if (back && document.contains(back)) back.focus(); };
  }, []);
  return (
    <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget && !dirty) onClose(); }}>
      <div ref={ref} className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="grab" />
        <header><h2>{title}</h2><button type="button" className="btn icon subtle" onClick={onClose} aria-label="Close"><Icon name="close-circle" /></button></header>
        <div className="body">{children}</div>
        {ask && <div className="ask" role="alertdialog" aria-label="Discard changes?"><span>Discard {dirty}?</span>
          <span className="row"><button type="button" className="btn" autoFocus onClick={() => setAsk(false)}>Keep Editing</button><button type="button" className="btn danger-fill" onClick={onClose}>Discard</button></span></div>}
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}
