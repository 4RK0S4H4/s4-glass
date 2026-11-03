import { useRef, type InputHTMLAttributes } from 'react';

/** A search field with the S4 clear button (the browser's own × is hidden by s4.css). Escape clears too. */
interface SearchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> { value: string; onChange: (v: string) => void }
export function SearchInput({ value, onChange, className = '', ...rest }: SearchProps) {
  const el = useRef<HTMLInputElement>(null);
  const clear = () => { onChange(''); el.current?.focus(); };
  return (
    <span className="search-field">
      <input {...rest} ref={el} type="search" className={`input search ${className}`} value={value} onChange={e => onChange(e.target.value)} onKeyDown={e => { if (e.key === 'Escape' && value) { e.preventDefault(); e.stopPropagation(); clear(); } }} />
      <button type="button" className="search-x" aria-label="Clear Search" tabIndex={-1} hidden={!value} onMouseDown={e => e.preventDefault()} onClick={clear}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>
      </button>
    </span>
  );
}
