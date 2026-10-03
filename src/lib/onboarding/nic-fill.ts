import { NIC_CLASSES, NIC_DIVISIONS, NIC_SUBCLASSES } from "./nic-master";

const SUB = new Map(NIC_SUBCLASSES);

/** "46 — Description" style label for a 5-digit code at the requested level. */
export function nicLabel(code5: string, digits: 2 | 4 | 5): string | null {
  const c = code5.slice(0, digits);
  const desc = digits === 2 ? NIC_DIVISIONS[c] : digits === 4 ? NIC_CLASSES[c] : SUB.get(c);
  return desc ? `${c} — ${desc}` : null;
}
