# S4 Glass React kit

Small, plain TSX files for React apps. No build step for the toolkit itself: copy this folder into your app (or import it) and load `toolkit/s4.css` and `toolkit/icons.js` as usual. The kit only renders the markup `s4.css` already styles, so the look is the same as the plain-JS version in `s4.js`.

| Component | What it is | Plain-JS twin |
|---|---|---|
| `Select` | themed dropdown, native on touch | `s4Select` |
| `Modal` (`dirty`) | dialog; Escape asks "Discard …?" when something would be lost | `s4Dialog` + `data-dirty` |
| `useToast` | toast, 4s (6.5s with an action); `anchor` makes an undo pop-up | `s4Toast` |
| `CopyCell`, `DateCopy`, `Money` | copy chips: text, icon only, block, date, "–" empty | `s4Copy` + `.copy` |
| `useSort`, `SortTh` | click-to-sort headers, blanks always last | `s4Sort` |
| `SegFilter`, `useSlider` | segmented filter with a sliding pill | `s4Slider` |
| `FoldCard` | a card folded by its header | `s4Fold` |
| `DescTip` | tooltip for cut-off text, main line + quieter sub line | `s4Tips` |

```tsx
import { Select, Modal, useToast, CopyCell, useSort, SortTh } from './s4-react';
```

Icons: `Icon` reads names from `S4_ICONS` (the global `icons.js` defines) or from `setS4Icons(map)` if you bundle your own.

Rules: tokens only (no colours or sizes in the components), class names from `s4.css`, Title Case labels. When an app improves one of these, the improvement goes back here in the same batch.
