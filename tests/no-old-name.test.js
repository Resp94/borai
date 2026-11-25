import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Places where the old name is allowed on purpose: history, license/authorship,
// and the migration code that has to recognize old projects.
const EXEMPT_PREFIXES = ['docs/'];
const EXEMPT_FILES = new Set([
  'CHANGELOG.md', 'LICENSE', 'src/migrate.js', 'tests/migrate.test.js', 'tests/no-old-name.test.js',
]);
const ATTRIBUTION = /renatoasse|Renato Asse/;

function trackedFiles() {
  return execSync('git ls-files', { cwd: ROOT, encoding: 'utf-8' }).split('\n').filter(Boolean);
}

function isExempt(path) {
  return EXEMPT_FILES.has(path) || EXEMPT_PREFIXES.some((p) => path.startsWith(p));
}

test('no tracked path carries the old name', () => {
  const hits = trackedFiles().filter((f) => !isExempt(f) && /opensquad/i.test(f));
  assert.deepEqual(hits.slice(0, 20), [], `${hits.length} paths still named opensquad`);
});

test('no tracked file mentions the old name outside attribution', () => {
  const hits = [];
  for (const f of trackedFiles()) {
    if (isExempt(f)) continue;
    let buf;
    try {
      buf = readFileSync(join(ROOT, f));
    } catch {
      continue; // deleted in the working tree
    }
    if (buf.includes(0)) continue; // binary
    buf.toString('utf-8').split('\n').forEach((line, i) => {
      if (/opensquad/i.test(line) && !ATTRIBUTION.test(line)) hits.push(`${f}:${i + 1}`);
    });
  }
  assert.deepEqual(hits.slice(0, 20), [], `${hits.length} lines still mention opensquad`);
});
