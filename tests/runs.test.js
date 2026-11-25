import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { listRuns, formatDuration } from '../src/runs.js';

test('listRuns returns empty array when no squads exist', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'osq-runs-'));
  try {
    const runs = await listRuns(null, dir);
    assert.equal(runs.length, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('listRuns finds state.json in output directories', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'osq-runs-'));
  try {
    const runDir = join(dir, 'squads', 'my-squad', 'output', '2026-03-17-120000');
    await mkdir(runDir, { recursive: true });
    await writeFile(join(runDir, 'state.json'), JSON.stringify({
      squad: 'my-squad',
      status: 'completed',
      step: { current: 3, total: 3 },
      startedAt: '2026-03-17T12:00:00Z',
      completedAt: '2026-03-17T12:05:00Z',
    }), 'utf-8');

    const runs = await listRuns(null, dir);
    assert.equal(runs.length, 1);
    assert.equal(runs[0].squad, 'my-squad');
    assert.equal(runs[0].status, 'completed');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('listRuns filters by squad name', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'osq-runs-'));
  try {
    for (const name of ['squad-a', 'squad-b']) {
      const runDir = join(dir, 'squads', name, 'output', '2026-03-17-120000');
      await mkdir(runDir, { recursive: true });
      await writeFile(join(runDir, 'state.json'), JSON.stringify({
        squad: name, status: 'completed', step: { current: 1, total: 1 },
        startedAt: '2026-03-17T12:00:00Z', completedAt: '2026-03-17T12:01:00Z',
      }), 'utf-8');
    }

    const runs = await listRuns('squad-a', dir);
    assert.equal(runs.length, 1);
    assert.equal(runs[0].squad, 'squad-a');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('listRuns returns unknown for runs without state.json', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'osq-runs-'));
  try {
    const runDir = join(dir, 'squads', 'my-squad', 'output', '2026-03-17-120000');
    await mkdir(runDir, { recursive: true });

    const runs = await listRuns(null, dir);
    assert.equal(runs.length, 1);
    assert.equal(runs[0].status, 'unknown');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('listRuns handles malformed state.json', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'osq-runs-'));
  try {
    const runDir = join(dir, 'squads', 'my-squad', 'output', '2026-03-17-120000');
    await mkdir(runDir, { recursive: true });
    await writeFile(join(runDir, 'state.json'), 'not json', 'utf-8');

    const runs = await listRuns(null, dir);
    assert.equal(runs.length, 1);
    assert.equal(runs[0].status, 'unknown');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

async function makeRun(dir, runId, state) {
  const runDir = join(dir, 'squads', 'my-squad', 'output', runId);
  await mkdir(runDir, { recursive: true });
  if (state !== undefined) {
    await writeFile(join(runDir, 'state.json'), JSON.stringify(state), 'utf-8');
  }
}

test('listRuns sorts by startedAt descending, not by name', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'osq-runs-'));
  try {
    await makeRun(dir, 'zebra', { status: 'completed', startedAt: '2026-03-17T08:00:00Z' });
    await makeRun(dir, 'alpha', { status: 'completed', startedAt: '2026-03-17T12:00:00Z' });
    await makeRun(dir, '2026-03-17-100000', { status: 'completed', startedAt: '2026-03-17T10:00:00Z' });

    const runs = await listRuns(null, dir);
    assert.deepEqual(runs.map((r) => r.runId), ['alpha', '2026-03-17-100000', 'zebra']);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('listRuns puts runs without startedAt last', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'osq-runs-'));
  try {
    await makeRun(dir, 'dated', { status: 'completed', startedAt: '2026-03-17T12:00:00Z' });
    await makeRun(dir, 'untitled-2');
    await makeRun(dir, 'untitled-1', { status: 'running' });

    const runs = await listRuns(null, dir);
    assert.deepEqual(runs.map((r) => r.runId), ['dated', 'untitled-1', 'untitled-2']);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('listRuns limits to the 20 most recent', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'osq-runs-'));
  try {
    const letters = 'abcdefghijklmnopqrstuvwxy'.split('');
    for (const [i, letter] of letters.entries()) {
      const day = String(25 - i).padStart(2, '0');
      await makeRun(dir, `run-${letter}`, { status: 'completed', startedAt: `2026-03-${day}T12:00:00Z` });
    }

    const runs = await listRuns(null, dir);
    const ids = runs.map((r) => r.runId);
    assert.equal(runs.length, 20);
    assert.equal(ids[0], 'run-a');
    for (const gone of ['run-u', 'run-v', 'run-w', 'run-x', 'run-y']) {
      assert.ok(!ids.includes(gone), `${gone} should be cut`);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('listRuns limits to 20 results', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'osq-runs-'));
  try {
    for (let i = 0; i < 25; i++) {
      const ts = `2026-03-${String(i + 1).padStart(2, '0')}-120000`;
      const runDir = join(dir, 'squads', 'my-squad', 'output', ts);
      await mkdir(runDir, { recursive: true });
    }

    const runs = await listRuns(null, dir);
    assert.equal(runs.length, 20);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('formatDuration formats milliseconds', () => {
  assert.equal(formatDuration(150000), '2m 30s');
  assert.equal(formatDuration(3600000), '1h 0m');
  assert.equal(formatDuration(3661000), '1h 1m');
  assert.equal(formatDuration(45000), '45s');
  assert.equal(formatDuration(0), '0s');
});

test('listRuns calculates duration from timestamps', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'osq-runs-'));
  try {
    const runDir = join(dir, 'squads', 'my-squad', 'output', '2026-03-17-120000');
    await mkdir(runDir, { recursive: true });
    await writeFile(join(runDir, 'state.json'), JSON.stringify({
      squad: 'my-squad', status: 'completed',
      step: { current: 3, total: 3 },
      startedAt: '2026-03-17T12:00:00Z',
      completedAt: '2026-03-17T12:05:30Z',
    }), 'utf-8');

    const runs = await listRuns(null, dir);
    assert.equal(runs[0].duration, '5m 30s');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('listRuns ignores non-directory entries in output', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'osq-runs-'));
  try {
    const outputDir = join(dir, 'squads', 'my-squad', 'output');
    await mkdir(outputDir, { recursive: true });
    await writeFile(join(outputDir, 'random-file.txt'), 'not a run', 'utf-8');

    const runs = await listRuns(null, dir);
    assert.equal(runs.length, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
