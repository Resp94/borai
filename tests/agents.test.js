import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  listAvailable,
  installAgent,
  removeAgent,
  getAgentMeta,
  clearMetaCache,
  installBundledAgents,
} from '../src/agents.js';

// --- getAgentMeta cache ---

test('getAgentMeta returns null for nonexistent agent', async () => {
  clearMetaCache();
  const meta = await getAgentMeta('nonexistent-agent');
  assert.equal(meta, null);
});

test('getAgentMeta caches null for nonexistent agent', async () => {
  clearMetaCache();
  const first = await getAgentMeta('nonexistent-agent');
  assert.equal(first, null);
  const second = await getAgentMeta('nonexistent-agent');
  assert.equal(second, null);
});

test('clearMetaCache allows re-read from disk', async () => {
  clearMetaCache();
  // Cache a null
  await getAgentMeta('nonexistent-agent');
  // Clear and verify we can query again without error
  clearMetaCache();
  const meta = await getAgentMeta('nonexistent-agent');
  assert.equal(meta, null);
});

// Cache with real bundled agents (if they exist)
test('getAgentMeta caches result when bundled agents exist', async () => {
  clearMetaCache();
  const available = await listAvailable();
  if (available.length === 0) {
    // No bundled agents in dev environment — skip
    return;
  }
  const id = available[0];
  const first = await getAgentMeta(id);
  const second = await getAgentMeta(id);
  assert.equal(first, second); // same reference from cache
});

test('clearMetaCache forces re-read when bundled agents exist', async () => {
  clearMetaCache();
  const available = await listAvailable();
  if (available.length === 0) return;
  const id = available[0];
  const first = await getAgentMeta(id);
  clearMetaCache();
  const second = await getAgentMeta(id);
  assert.notEqual(first, second); // different reference
  assert.equal(first.name, second.name); // same content
});

// --- installAgent / removeAgent invalidation ---

test('installAgent invalidates metaCache', async () => {
  const available = await listAvailable();
  if (available.length === 0) return;
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    const id = available[0];
    clearMetaCache();
    const before = await getAgentMeta(id);
    await installAgent(id, dir);
    const after = await getAgentMeta(id);
    assert.notEqual(before, after);
  } finally {
    await rm(dir, { recursive: true });
  }
});

test('removeAgent invalidates metaCache', async () => {
  const available = await listAvailable();
  if (available.length === 0) return;
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    const id = available[0];
    await installAgent(id, dir);
    clearMetaCache();
    await getAgentMeta(id); // populate cache
    await removeAgent(id, dir);
    const meta = await getAgentMeta(id);
    assert.ok(meta); // still in bundled dir
  } finally {
    await rm(dir, { recursive: true });
  }
});

// --- full install (tasks/ and tools/) and bundled auto-install ---

async function makeBundle() {
  const bundled = await mkdtemp(join(tmpdir(), 'borai-bundle-'));
  await mkdir(join(bundled, 'fake-agent', 'tasks'), { recursive: true });
  await mkdir(join(bundled, 'fake-agent', 'tools'), { recursive: true });
  await mkdir(join(bundled, '_shared'), { recursive: true });
  await writeFile(join(bundled, 'fake-agent', 'AGENT.md'), '---\nname: Fake\n---\n# Fake\n', 'utf-8');
  await writeFile(join(bundled, 'fake-agent', 'tasks', 'a.md'), 'task', 'utf-8');
  await writeFile(join(bundled, 'fake-agent', 'tools', 'x.py'), 'print(1)', 'utf-8');
  await writeFile(join(bundled, '_shared', 'voice.template.md'), 'voz', 'utf-8');
  return bundled;
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

test('installAgent copies tasks and tools', async () => {
  const bundled = await makeBundle();
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    await installAgent('fake-agent', dir, { bundledDir: bundled });
    assert.ok(await exists(join(dir, 'agents', 'fake-agent.agent.md')));
    assert.ok(await exists(join(dir, 'agents', 'fake-agent', 'tasks', 'a.md')));
    assert.ok(await exists(join(dir, 'agents', 'fake-agent', 'tools', 'x.py')));
  } finally {
    await rm(dir, { recursive: true });
    await rm(bundled, { recursive: true });
  }
});

test('removeAgent removes agent folder', async () => {
  const bundled = await makeBundle();
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    await installAgent('fake-agent', dir, { bundledDir: bundled });
    await removeAgent('fake-agent', dir);
    assert.ok(!(await exists(join(dir, 'agents', 'fake-agent.agent.md'))));
    assert.ok(!(await exists(join(dir, 'agents', 'fake-agent'))));
  } finally {
    await rm(dir, { recursive: true });
    await rm(bundled, { recursive: true });
  }
});

test('installBundledAgents installs all and skips underscore dirs', async () => {
  const bundled = await makeBundle();
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    const installed = await installBundledAgents(dir, { bundledDir: bundled });
    assert.deepEqual(installed, ['fake-agent']);
    assert.ok(await exists(join(dir, 'agents', '_shared', 'voice.template.md')));
  } finally {
    await rm(dir, { recursive: true });
    await rm(bundled, { recursive: true });
  }
});

test('installBundledAgents skips existing', async () => {
  const bundled = await makeBundle();
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    await mkdir(join(dir, 'agents'), { recursive: true });
    await writeFile(join(dir, 'agents', 'fake-agent.agent.md'), 'EDITADO', 'utf-8');
    const installed = await installBundledAgents(dir, { skipExisting: true, bundledDir: bundled });
    assert.deepEqual(installed, []);
    assert.equal(await readFile(join(dir, 'agents', 'fake-agent.agent.md'), 'utf-8'), 'EDITADO');
  } finally {
    await rm(dir, { recursive: true });
    await rm(bundled, { recursive: true });
  }
});

test('installBundledAgents and listAvailable ignore dirs without AGENT.md', async () => {
  const bundled = await makeBundle();
  await mkdir(join(bundled, 'half-done', 'tools'), { recursive: true });
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    const installed = await installBundledAgents(dir, { bundledDir: bundled });
    assert.deepEqual(installed, ['fake-agent']);
    assert.ok(!(await listAvailable({ bundledDir: bundled })).includes('half-done'));
  } finally {
    await rm(dir, { recursive: true });
    await rm(bundled, { recursive: true });
  }
});
