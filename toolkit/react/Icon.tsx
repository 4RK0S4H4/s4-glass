import { useMemo } from 'react';

/** Icon bodies by name: the S4_ICONS object from toolkit/icons.js (Solar Bold Duotone). Pass your own with setS4Icons(), or leave icons.js on the page. */
let registry: Record<string, string> | undefined;
export const setS4Icons = (icons: Record<string, string>) => { registry = icons; };
const lookup = (name: string): string => {
  const all = registry ?? (globalThis as { S4_ICONS?: Record<string, string> }).S4_ICONS ?? {};
  return all[name] ?? '';
};

/** <Icon name="copy" />: an inline Solar icon that takes the text colour. Decorative (aria-hidden); label the button it sits in. */
export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const body = useMemo(() => lookup(name), [name]);
  return <svg className="ic" width={size} height={size} viewBox="0 0 24 24" aria-hidden dangerouslySetInnerHTML={{ __html: body }} />;
}
