import { useState } from 'react';

type SortVal = string | number | undefined | null;
const blank = (v: SortVal) => v === undefined || v === null || v === '';
const cmp = (a: SortVal, b: SortVal) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }));

/** Click-to-sort for any list. `keys` maps a column to a getter. First click sorts ascending, the second descending, the third goes back to the
 *  default order. Blank values (undefined, null, "") are always last, whichever way it sorts. Render headers with <SortTh>. */
export function useSort<T>(items: T[], keys: Record<string, (x: T) => SortVal>, initial?: { k: string; dir: 1 | -1 }) {
  const [s, setS] = useState<{ k: string; dir: 1 | -1 } | undefined>(initial);
  let sorted = items;
  if (s && keys[s.k]) {
    const f = keys[s.k];
    sorted = items.map((x, i) => ({ x, i, v: f(x) })).sort((a, b) => {
      if (blank(a.v) || blank(b.v)) return blank(a.v) && blank(b.v) ? a.i - b.i : blank(a.v) ? 1 : -1;
      return cmp(a.v, b.v) * s.dir || a.i - b.i;
    }).map(p => p.x);
  }
  const first = (k: string): 1 | -1 => (initial?.k === k ? initial.dir : 1);
  const click = (k: string) => setS(o => {
    if (!o || o.k !== k) return { k, dir: first(k) };
    if (o.dir === first(k)) return { k, dir: (o.dir * -1) as 1 | -1 };
    return initial;   // third click: back to the default order
  });
  return { sorted, sort: s, click, reset: () => setS(initial) };
}
