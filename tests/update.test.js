import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { listAvailable as listAvailableAgents } from '../src/agents.js';
import { init } from '../src/init.js';
import { update } from '../src/update.js';

test('update returns failure when not initialized', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'borai-test-'));

  try {
    const result = await update(tempDir);
    assert.equal(result.success, false);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('update overwrites system files', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'borai-test-'));

  try {
    await init(tempDir, { _skipPrompts: true });
    await writeFile(join(tempDir, 'CLAUDE.md'), 'garbage content', 'utf-8');

    await update(tempDir);

    const content = await readFile(join(tempDir, 'CLAUDE.md'), 'utf-8');
    assert.ok(content.includes('Borai'));
    assert.ok(!content.includes('garbage content'));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('update preserves _memory contents', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'borai-test-'));

  try {
    await init(tempDir, { _skipPrompts: true });
    await writeFile(
      join(tempDir, '_borai', '_memory', 'company.md'),
      'My Company Info',
      'utf-8'
    );

    await update(tempDir);

    const content = await readFile(
      join(tempDir, '_borai', '_memory', 'company.md'),
      'utf-8'
    );
    assert.equal(content, 'My Company Info');
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('update preserves _investigations contents', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'borai-test-'));

  try {
    await init(tempDir, { _skipPrompts: true });
    await writeFile(
      join(tempDir, '_borai', '_investigations', 'profile-analysis.md'),
      'investigation data',
      'utf-8'
    );

    await update(tempDir);

    const content = await readFile(
      join(tempDir, '_borai', '_investigations', 'profile-analysis.md'),
      'utf-8'
    );
    assert.equal(content, 'investigation data');
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('update preserves squads contents', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'borai-test-'));

  try {
    await init(tempDir, { _skipPrompts: true });
    await mkdir(join(tempDir, 'squads', 'my-squad'), { recursive: true });
    await writeFile(
      join(tempDir, 'squads', 'my-squad', 'custom.md'),
      'user squad content',
      'utf-8'
    );

    await update(tempDir);

    const content = await readFile(
      join(tempDir, 'squads', 'my-squad', 'custom.md'),
      'utf-8'
    );
    assert.equal(content, 'user squad content');
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('update writes new version to .borai-version', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'borai-test-'));

  try {
    await init(tempDir, { _skipPrompts: true });

    await update(tempDir);

    const version = await readFile(
      join(tempDir, '_borai', '.borai-version'),
      'utf-8'
    );
    assert.ok(version.trim().length > 0);
    assert.match(version.trim(), /^\d+\.\d+\.\d+$/);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('update succeeds without existing .borai-version (legacy install)', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'borai-test-'));

  try {
    await init(tempDir, { _skipPrompts: true });
    await rm(join(tempDir, '_borai', '.borai-version'), { force: true });

    const result = await update(tempDir);
    assert.equal(result.success, true);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('update returns success when initialized', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'borai-test-'));

  try {
    await init(tempDir, { _skipPrompts: true });
    const result = await update(tempDir);
    assert.equal(result.success, true);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('update succeeds and installs every bundled agent', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    await init(tempDir, { _skipPrompts: true });
    const result = await update(tempDir);
    assert.equal(result.success, true);
    for (const id of await listAvailableAgents()) {
      await stat(join(tempDir, 'agents', `${id}.agent.md`));
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('update preserves user-created agent files', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    await init(tempDir, { _skipPrompts: true });
    // User manually created an agent
    const agentsDir = join(tempDir, 'agents');
    await mkdir(agentsDir, { recursive: true });
    await writeFile(join(agentsDir, 'custom.agent.md'), 'my agent', 'utf-8');

    await update(tempDir);

    const content = await readFile(join(agentsDir, 'custom.agent.md'), 'utf-8');
    assert.equal(content, 'my agent');
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('update auto-imports bundled skills with env requirements', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    await init(tempDir, { _skipPrompts: true });
    // image-ai-generator is the canonical non-MCP skill with env requirements (env: [OPENROUTER_API_KEY])
    // Simulate a user who installed borai before this skill was bundled
    await rm(join(tempDir, 'skills', 'image-ai-generator'), { recursive: true, force: true });

    await update(tempDir);

    // image-ai-generator has `env: [OPENROUTER_API_KEY]` and should be re-installed by update
    const skillMd = join(tempDir, 'skills', 'image-ai-generator', 'SKILL.md');
    const content = await readFile(skillMd, 'utf-8');
    assert.ok(content.includes('OPENROUTER_API_KEY'));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
