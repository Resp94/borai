import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { init } from '../src/init.js';
import { update } from '../src/update.js';
import { getSkillMeta, readDeclinedSkills, recordDeclinedSkills } from '../src/skills.js';

const exists = (p) => stat(p).then(() => true, () => false);

test('video-styles is marked optional with a size in its SKILL.md', async () => {
  const meta = await getSkillMeta('video-styles');
  assert.equal(meta.optional, true);
  assert.equal(meta.size, '28 MB');
  assert.equal((await getSkillMeta('image-creator')).optional, false);
});

test('init does not install optional skills unless chosen, and records the "no"', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    await init(dir, { _skipPrompts: true });
    const skills = await readdir(join(dir, 'skills'));
    assert.ok(!skills.includes('video-styles'), 'video-styles must not be auto-installed');
    assert.ok(skills.includes('image-creator'), 'regular skills are still installed');
    assert.deepEqual(await readDeclinedSkills(dir), ['video-styles']);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('init installs an optional skill when the user says yes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    await init(dir, { _skipPrompts: true, _optionalSkills: ['video-styles'] });
    const base = join(dir, 'skills', 'video-styles');
    assert.ok(await exists(join(base, 'SKILL.md')));
    assert.ok(await exists(join(base, 'gallery', 'index.html')));
    assert.ok(await exists(join(base, 'core', 'render', 'video.mjs')));
    assert.deepEqual(await readDeclinedSkills(dir), []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('update offers an optional skill once: "no" is remembered, "yes" installs', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    await init(dir, { _skipPrompts: true });
    // simulate a project created before the skill existed: no decision recorded
    const prefs = join(dir, '_borai', '_memory', 'preferences.md');
    await writeFile(prefs, (await readFile(prefs, 'utf-8')).replace(/^- \*\*Declined Skills:\*\*.*\n/m, ''), 'utf-8');

    await update(dir, { _optionalAnswers: { 'video-styles': false } });
    assert.ok(!(await exists(join(dir, 'skills', 'video-styles'))));
    assert.deepEqual(await readDeclinedSkills(dir), ['video-styles']);

    // declined: a second update does not install it even if answers say yes
    await update(dir, { _optionalAnswers: { 'video-styles': true } });
    assert.ok(!(await exists(join(dir, 'skills', 'video-styles'))));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('update installs the optional skill when the user says yes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    await init(dir, { _skipPrompts: true });
    const prefs = join(dir, '_borai', '_memory', 'preferences.md');
    await writeFile(prefs, (await readFile(prefs, 'utf-8')).replace(/^- \*\*Declined Skills:\*\*.*\n/m, ''), 'utf-8');

    await update(dir, { _optionalAnswers: { 'video-styles': true } });
    assert.ok(await exists(join(dir, 'skills', 'video-styles', 'SKILL.md')));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('recordDeclinedSkills merges without duplicates and keeps other preferences', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'borai-test-'));
  try {
    await init(dir, { _skipPrompts: true });
    await recordDeclinedSkills(dir, ['video-styles', 'other-skill']);
    const content = await readFile(join(dir, '_borai', '_memory', 'preferences.md'), 'utf-8');
    assert.match(content, /\*\*Output Language:\*\*/);
    assert.equal((content.match(/Declined Skills/g) || []).length, 1);
    assert.deepEqual(await readDeclinedSkills(dir), ['video-styles', 'other-skill']);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
