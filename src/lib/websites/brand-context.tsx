import { createContext, useContext, type ReactNode } from "react";
import type { BrandInfo } from "./current-brand.functions";

const BrandContext = createContext<BrandInfo | null>(null);

export function BrandProvider({
  value,
  children,
}: {
  value: BrandInfo;
  children: ReactNode;
}) {
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

/**
 * Access the current site's brand info. Throws if used outside BrandProvider —
 * every page under __root has one, so this should never fire in practice.
 */
export function useBrand(): BrandInfo {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error("useBrand() must be used inside <BrandProvider>");
  }
  return ctx;
}

/**
 * Non-throwing variant for optional brand access (e.g. rare edge cases where
 * a component may render before the provider mounts).
 */
export function useOptionalBrand(): BrandInfo | null {
  return useContext(BrandContext);
}
