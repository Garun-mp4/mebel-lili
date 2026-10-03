import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { legalPage } from '../src/legal-documents.mjs';
export async function buildLegal() {
  for (const key of ['privacy', 'consent', 'cookies']) {
    await fs.writeFile(new URL(`../public/${key}.html`, import.meta.url), legalPage(key), 'utf8');
  }
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await buildLegal();
