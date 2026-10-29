import type { ReactNode } from 'react';
import { Icon } from './Icon';

/** A card whose header folds it open and closed. For the plain-HTML version use <details class="fold"> with s4Fold(). */
export function FoldCard({ title, sub, open, onToggle, children, right }: { title: ReactNode; sub?: ReactNode; open: boolean; onToggle: () => void; children: ReactNode; right?: ReactNode }) {
  return (
    <div className={`card flush fold-card ${open ? 'open' : ''}`}>
      <div className="row jc-between">
        <button type="button" className="btn subtle" aria-expanded={open} onClick={onToggle}>
          <span style={{ display: 'inline-flex', transform: open ? 'rotate(180deg)' : undefined }}><Icon name="alt-arrow-down" size={16} /></span>
          <b>{title}</b>{sub && <span className="sec-sub">{sub}</span>}
        </button>
        {right}
      </div>
      {open && children}
    </div>
  );
}
