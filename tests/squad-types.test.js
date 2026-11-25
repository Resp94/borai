import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = join(ROOT, '_opensquad', 'core', 'squad-types.yaml');
const IDS = [
  'instagram-carrossel-noticias', 'instagram-reels', 'instagram-semana', 'youtube-para-instagram',
  'lancamento-infoproduto', 'linkedin-posts', 'tutoriais-com-prints', 'monitor-concorrentes',
];
const DOMAINS = ['content', 'research', 'automation', 'analysis', 'mixed'];

// Minimal parser for the catalog's YAML subset: entries start with "  - id:",
// one "key: value" per line, inline lists [a, b] and inline maps { k: "v", k2: "v2" }.
function unquote(v) {
  return v.trim().replace(/^"(.*)"$/, '$1');
}

function parseValue(raw) {
  const v = raw.trim();
  if (v.startsWith('[')) {
    const inner = v.slice(1, -1).trim();
    return inner ? inner.split(',').map(unquote) : [];
  }
  if (v.startsWith('{')) {
    const out = {};
    for (const m of v.slice(1, -1).matchAll(/([\w-]+):\s*"([^"]*)"/g)) out[m[1]] = m[2];
    return out;
  }
  return unquote(v);
}

async function loadTypes() {
  const text = (await readFile(CATALOG, 'utf-8')).replace(/\r\n/g, '\n');
  const chunks = text.split(/^ {2}- (?=id:)/m).slice(1);
  return chunks.map((chunk) => {
    const entry = {};
    for (const line of chunk.split('\n')) {
      const m = line.match(/^\s*([\w-]+):\s*(.+)$/);
      if (m) entry[m[1]] = parseValue(m[2]);
    }
    return entry;
  });
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

test('squad types catalog lists the 8 types in order', async () => {
  const types = await loadTypes();
  assert.deepEqual(types.map((t) => t.id), IDS);
});

test('every type has all fields', async () => {
  for (const t of await loadTypes()) {
    assert.ok(t.icon, `${t.id}: icon`);
    for (const lang of ['pt-BR', 'en']) {
      assert.ok(t.name?.[lang], `${t.id}: name.${lang}`);
      assert.ok(t.description?.[lang], `${t.id}: description.${lang}`);
    }
    assert.ok(DOMAINS.includes(t.domain), `${t.id}: domain ${t.domain}`);
    assert.ok(Array.isArray(t.target_formats), `${t.id}: target_formats`);
    assert.ok(Array.isArray(t.suggested_agents), `${t.id}: suggested_agents`);
    assert.ok(t.purpose && t.purpose.length > 20, `${t.id}: purpose`);
  }
});

test('every target format exists', async () => {
  for (const t of await loadTypes()) {
    for (const f of t.target_formats) {
      assert.ok(await exists(join(ROOT, '_opensquad', 'core', 'best-practices', `${f}.md`)), `${t.id}: ${f}`);
    }
  }
});

test('every suggested agent exists', async () => {
  for (const t of await loadTypes()) {
    for (const a of t.suggested_agents) {
      assert.ok(await exists(join(ROOT, 'agents', a, 'AGENT.md')), `${t.id}: ${a}`);
    }
  }
});

test('discovery prompt keeps the squad type rules wired', async () => {
  const p = await readFile(join(ROOT, '_opensquad', 'core', 'prompts', 'discovery.prompt.md'), 'utf-8');
  assert.match(p, /squad-types\.yaml/, 'catalog is read');
  assert.match(p, /no longer matches the type/, 'changed purpose drops the type');
  assert.match(p, /merge the extra detail/, 'detail after the type name is kept');
  assert.match(p, /skip question 2 when `squad_type` is set/i, 'Step 3 does not re-ask formats');
  assert.match(p, /Step 6b still applies/, 'Instagram profile is still asked');
  assert.match(p, /selected or pre-filled/, 'Step 6b triggers on pre-filled formats');
});
