import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AGENTS = join(ROOT, 'agents');

const FIELDS = ['name', 'category', 'language', 'icon', 'version', 'description',
  'description_pt-BR', 'whenToUse', 'needsInput', 'reads', 'writes', 'tasks'];
// Agents with tasks follow build.prompt.md Gate 1: no Operational Framework or
// Output Examples in the agent (they live in the task files, Gate 1b).
const SECTIONS = ['## Persona', '### Role', '### Identity', '### Communication Style',
  '## Principles', '## Voice Guidance', '### Vocabulary — Always Use', '### Vocabulary — Never Use',
  '## Anti-Patterns', '### Never Do', '### Always Do', '## Quality Criteria', '## Integration'];
const FORBIDDEN = ['## Operational Framework', '## Output Examples'];
const TASK_SECTIONS = ['## Process', '## Output Format', '## Output Example', '## Quality Criteria',
  '## Veto Conditions'];
const MEMORY_FILES = ['voice.md', 'swipe.md', 'log.md', 'plan.md'];

async function igAgents() {
  const entries = await readdir(AGENTS, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && e.name.startsWith('ig-')).map((e) => e.name).sort();
}

function frontmatter(content) {
  const m = content.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(m, 'frontmatter missing');
  return m[1];
}

function listField(fm, key) {
  const inline = fm.match(new RegExp(`^${key}:\\s*\\[(.*)\\]\\s*$`, 'm'));
  if (inline) return inline[1].split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  const block = fm.match(new RegExp(`^${key}:\\s*\\n((?:\\s+-\\s+.+\\n?)+)`, 'm'));
  if (!block) return null;
  return block[1].split('\n').map((l) => l.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '')).filter(Boolean);
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function allText(id) {
  let text = await readFile(join(AGENTS, id, 'AGENT.md'), 'utf-8');
  const tasksDir = join(AGENTS, id, 'tasks');
  if (await exists(tasksDir)) {
    for (const f of await readdir(tasksDir)) text += '\n' + await readFile(join(tasksDir, f), 'utf-8');
  }
  return text;
}

test('there are exactly 13 instagram agents', async () => {
  assert.deepEqual(await igAgents(), [
    'ig-audit', 'ig-caption', 'ig-carousel', 'ig-comment', 'ig-dm', 'ig-human', 'ig-plan',
    'ig-profile', 'ig-reel', 'ig-reply', 'ig-repurpose', 'ig-story', 'ig-viral',
  ]);
});

test('every instagram agent has the required frontmatter', async () => {
  for (const id of await igAgents()) {
    const fm = frontmatter(await readFile(join(AGENTS, id, 'AGENT.md'), 'utf-8'));
    for (const key of FIELDS) assert.match(fm, new RegExp(`^${key}:`, 'm'), `${id}: ${key}`);
    assert.match(fm, /^category:\s*instagram\s*$/m, `${id}: category`);
    assert.match(fm, /^language:\s*pt-BR\s*$/m, `${id}: language`);
    for (const key of ['reads', 'writes']) {
      const values = listField(fm, key);
      assert.ok(values, `${id}: ${key} must be a list`);
      for (const v of values) assert.ok(MEMORY_FILES.includes(v), `${id}: ${key} has ${v}`);
    }
    assert.ok(listField(fm, 'needsInput'), `${id}: needsInput must be a list`);
  }
});

test('every instagram agent has all required sections', async () => {
  for (const id of await igAgents()) {
    const content = await readFile(join(AGENTS, id, 'AGENT.md'), 'utf-8');
    for (const s of SECTIONS) assert.match(content, new RegExp(`^${s}\\s*$`, 'm'), `${id}: ${s}`);
    for (const s of FORBIDDEN) assert.doesNotMatch(content, new RegExp(`^${s}\\s*$`, 'm'), `${id}: ${s}`);
    assert.ok(content.split('\n').length >= 80, `${id}: under 80 lines`);
  }
});

test('every task file follows the task format', async () => {
  for (const id of await igAgents()) {
    const fm = frontmatter(await readFile(join(AGENTS, id, 'AGENT.md'), 'utf-8'));
    for (const t of listField(fm, 'tasks') || []) {
      const content = await readFile(join(AGENTS, id, t), 'utf-8');
      const tfm = frontmatter(content);
      for (const key of ['task', 'order', 'input', 'output']) {
        assert.match(tfm, new RegExp(`^${key}:`, 'm'), `${id}/${t}: ${key}`);
      }
      for (const s of TASK_SECTIONS) assert.match(content, new RegExp(`^${s}\\s*$`, 'm'), `${id}/${t}: ${s}`);
      assert.ok(content.split('\n').length >= 50, `${id}/${t}: under 50 lines`);
    }
  }
});

test('every listed task file exists', async () => {
  for (const id of await igAgents()) {
    const fm = frontmatter(await readFile(join(AGENTS, id, 'AGENT.md'), 'utf-8'));
    const tasks = listField(fm, 'tasks');
    assert.ok(tasks && tasks.length > 0, `${id}: no tasks`);
    for (const t of tasks) assert.ok(await exists(join(AGENTS, id, t)), `${id}: ${t}`);
  }
});

test('every referenced tool exists at its installed path', async () => {
  for (const id of await igAgents()) {
    const text = await allText(id);
    for (const m of text.matchAll(/agents\/(ig-[a-z]+)\/tools\/([\w.-]+\.(?:py|json))/g)) {
      assert.ok(await exists(join(AGENTS, m[1], 'tools', m[2])), `${id}: ${m[0]}`);
    }
  }
});

test('no agent points at the original plugin paths or slash commands', async () => {
  for (const id of await igAgents()) {
    const text = await allText(id);
    assert.doesNotMatch(text, /~\/\.claude\/instagram/, `${id}: old memory path`);
    assert.doesNotMatch(text, /(?<![\w/.-])\/ig-[a-z]+/, `${id}: slash command`);
  }
});

test('agents that use profile memory name the per-profile folder', async () => {
  for (const id of await igAgents()) {
    const text = await allText(id);
    const fm = frontmatter(await readFile(join(AGENTS, id, 'AGENT.md'), 'utf-8'));
    const used = [...listField(fm, 'reads'), ...listField(fm, 'writes')];
    if (used.length) {
      assert.match(text, /_borai\/_memory\/instagram\/\{perfil\}\//, `${id}: memory path`);
    }
  }
});
