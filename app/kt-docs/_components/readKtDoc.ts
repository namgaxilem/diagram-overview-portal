import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Reads a KT page's markdown from its colocated `_components/doc.md`.
 * Server-only (uses node:fs) — called from each route's page.tsx (a Server Component).
 */
export function readKtDoc(slug: string): string {
  const path = join(process.cwd(), 'app', 'kt-docs', slug, '_components', 'doc.md');
  return readFileSync(path, 'utf8');
}
