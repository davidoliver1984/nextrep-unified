import { lazy } from "react";

// For default-export pages
export function lazyDefault(
  importer: () => Promise<{ default: React.ComponentType }>
) {
  return lazy(importer);
}
