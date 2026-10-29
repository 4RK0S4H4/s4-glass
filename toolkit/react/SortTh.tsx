import type { ReactNode } from 'react';

/** A sortable column header for useSort: <SortTh k="amount" sort={sort} click={click} className="num">Amount</SortTh> */
export function SortTh({ k, sort, click, className = '', children }: { k: string; sort?: { k: string; dir: 1 | -1 }; click: (k: string) => void; className?: string; children: ReactNode }) {
  const on = sort?.k === k;
  return (
    <th className={`${className} sortable ${on ? 'sorted' : ''}`} aria-sort={on ? (sort!.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="th-sort" onClick={() => click(k)}>
        <span>{children}</span>
        <svg className="sort-ic" viewBox="0 0 24 24" aria-hidden="true" style={on && sort!.dir === 1 ? { transform: 'rotate(180deg)' } : undefined}>
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </th>
  );
}
