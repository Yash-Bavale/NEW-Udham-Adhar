import { NIC_CLASSES, NIC_DIVISIONS, NIC_SUBCLASSES } from "./nic-master";

const SUB = new Map(NIC_SUBCLASSES);

export type NicOption = {
  code: string;
  description: string;
  level: 2 | 4 | 5;
  label: string;
};

/** Extracts numeric code (2, 4, or 5 digits) from stored value like "62 — Computer..." or "62". */
export function extractNicCode(val?: string | null): string {
  if (!val) return "";
  const m = val.trim().match(/^(\d{2,5})/);
  return m ? m[1] : "";
}

/** "46 — Description" style label for a code at the requested level. */
export function nicLabel(code: string, digits: 2 | 4 | 5, fallbackDesc?: string): string | null {
  const c = extractNicCode(code).slice(0, digits);
  if (!c) return null;
  const desc = digits === 2 ? NIC_DIVISIONS[c] : digits === 4 ? NIC_CLASSES[c] : (SUB.get(c) || fallbackDesc);
  return desc ? `${c} — ${desc}` : null;
}

/** All 2-digit NIC divisions sorted by code. */
export function getNicDivisions(): Array<{ code: string; label: string }> {
  return Object.entries(NIC_DIVISIONS)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([code, description]) => ({ code, label: `${code} — ${description}` }));
}

/** Valid 4-digit NIC classes belonging to the specified 2-digit division. */
export function getNicClasses(divisionCode?: string | null): Array<{ code: string; label: string }> {
  const prefix = extractNicCode(divisionCode).slice(0, 2);
  if (!prefix) return [];
  return Object.entries(NIC_CLASSES)
    .filter(([code]) => code.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([code, description]) => ({ code, label: `${code} — ${description}` }));
}

/** Valid 5-digit NIC subclasses belonging to the specified 4-digit class. */
export function getNicSubclasses(classCode?: string | null): Array<{ code: string; label: string }> {
  const prefix = extractNicCode(classCode).slice(0, 4);
  if (!prefix) return [];
  return NIC_SUBCLASSES
    .filter(([code]) => code.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([code, description]) => ({ code, label: `${code} — ${description}` }));
}

/**
 * Intelligent unified NIC search across all 2, 4, and 5-digit codes.
 * Returns a combined, ranked list without artificial section divisions.
 */
export function searchNicUnified(query: string, limit = 35): NicOption[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const isNumeric = /^\d+$/.test(needle);

  const subMatches = NIC_SUBCLASSES.filter(([c, d]) =>
    c.startsWith(needle) || (isNumeric ? false : d.toLowerCase().includes(needle))
  );

  const classMatches = Object.entries(NIC_CLASSES).filter(([c, d]) =>
    c.startsWith(needle) ||
    (isNumeric && needle.startsWith(c)) ||
    (!isNumeric && (d.toLowerCase().includes(needle) || subMatches.some(([sc]) => sc.startsWith(c))))
  );

  const divMatches = Object.entries(NIC_DIVISIONS).filter(([c, d]) =>
    c.startsWith(needle) ||
    (isNumeric && needle.startsWith(c)) ||
    (!isNumeric && (d.toLowerCase().includes(needle) || classMatches.some(([cc]) => cc.startsWith(c))))
  );

  const all: NicOption[] = [
    ...divMatches.map(([code, description]): NicOption => ({
      code,
      description,
      level: 2,
      label: `${code} — ${description}`,
    })),
    ...classMatches.map(([code, description]): NicOption => ({
      code,
      description,
      level: 4,
      label: `${code} — ${description}`,
    })),
    ...subMatches.map(([code, description]): NicOption => ({
      code,
      description,
      level: 5,
      label: `${code} — ${description}`,
    })),
  ];

  all.sort((a, b) => {
    // 1. Exact code match gets highest priority
    const aExact = a.code === needle ? 1 : 0;
    const bExact = b.code === needle ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;

    // 2. If numeric search, code prefix matches come next
    if (isNumeric) {
      const aPrefix = a.code.startsWith(needle) ? 1 : 0;
      const bPrefix = b.code.startsWith(needle) ? 1 : 0;
      if (aPrefix !== bPrefix) return bPrefix - aPrefix;
    }

    // 3. Level hierarchy: 2 -> 4 -> 5
    if (a.level !== b.level) return a.level - b.level;

    return a.code.localeCompare(b.code);
  });

  return all.slice(0, limit);
}

