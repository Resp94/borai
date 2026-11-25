import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, mkdir, writeFile, readFile, rename, stat, chmod } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { migrateLegacyProject, printMigration } from '../src/migrate.js';
import { init } from '../src/init.js';
import { update } from '../src/update.js';

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function put(root, rel, content) {
  const p = join(root, rel);
  await mkdir(dirname(p), { recursive: true });
  await writeFile(p, content, 'utf-8');
}

// A project as the old Opensquad installed it.
async function legacyProject() {
  const dir = await mkdtemp(join(tmpdir(), 'borai-migrate-'));
  await put(dir, '_opensquad/_memory/company.md', '# Empresa X\n');
  await put(dir, '_opensquad/_memory/instagram/navalhado-io/voice.md', 'voz do navalhado\n');
  await put(dir, '_opensquad/_browser_profile/Default/Cookies', 'cookie\n');
  await put(dir, '_opensquad/.opensquad-version', '0.1.15\n');
  await put(dir, 'squads/s1/squad.yaml', 'company: "_opensquad/_memory/company.md"\n');
  await put(dir, 'skills/template-designer/SKILL.md', 'Leia _opensquad/core/x.md\nMinha edição\n');
  await put(dir, 'skills/opensquad-skill-creator/SKILL.md', 'old creator\n');
  await put(dir, 'skills/opensquad-agent-creator/SKILL.md', 'old agent creator\n');
  await put(dir, 'agents/ig-reel.agent.md', 'memória em _opensquad/_memory/instagram/{perfil}/\n');
  await put(dir, '.claude/skills/opensquad/SKILL.md', 'old command\n');
  await put(dir, '.cursor/commands/opensquad.md', 'old command\n');
  await put(dir, '.mcp.json', '{"args": ["--config", "_opensquad/config/playwright.config.json"]}\n');
  await put(dir, '.vscode/settings.json', '{"editor.fontSize": 14, "x": "_opensquad/config/playwright.config.json"}\n');
  await put(dir, 'estilos/_tools/x.mjs', "const p = '_opensquad/_memory/company.md';\n");
  return dir;
}

test('migra pasta e versão', async () => {
  const dir = await legacyProject();
  try {
    const r = await migrateLegacyProject(dir);
    assert.equal(r.status, 'migrated');
    assert.equal(await readFile(join(dir, '_borai/_memory/company.md'), 'utf-8'), '# Empresa X\n');
    assert.equal(await readFile(join(dir, '_borai/_memory/instagram/navalhado-io/voice.md'), 'utf-8'), 'voz do navalhado\n');
    assert.equal(await readFile(join(dir, '_borai/_browser_profile/Default/Cookies'), 'utf-8'), 'cookie\n');
    assert.equal(await readFile(join(dir, '_borai/.borai-version'), 'utf-8'), '0.1.15\n');
    assert.equal(await exists(join(dir, '_opensquad')), false);
    assert.equal(await exists(join(dir, '_borai/.opensquad-version')), false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('reescreve caminhos nas pastas do framework', async () => {
  const dir = await legacyProject();
  try {
    await migrateLegacyProject(dir);
    for (const f of ['squads/s1/squad.yaml', 'skills/template-designer/SKILL.md', 'agents/ig-reel.agent.md',
      '.mcp.json', '.vscode/settings.json']) {
      const text = await readFile(join(dir, f), 'utf-8');
      assert.doesNotMatch(text, /_opensquad/, f);
      assert.match(text, /_borai\//, f);
    }
    assert.match(await readFile(join(dir, 'skills/template-designer/SKILL.md'), 'utf-8'), /Minha edição/);
    assert.match(await readFile(join(dir, '.vscode/settings.json'), 'utf-8'), /"editor\.fontSize": 14/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('remove arquivos de comando antigos', async () => {
  const dir = await legacyProject();
  try {
    await migrateLegacyProject(dir);
    assert.equal(await exists(join(dir, '.claude/skills/opensquad')), false);
    assert.equal(await exists(join(dir, '.cursor/commands/opensquad.md')), false);
    assert.equal(await exists(join(dir, 'skills/opensquad-skill-creator')), false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('lista sem alterar fora das pastas do framework', async () => {
  const dir = await legacyProject();
  try {
    const r = await migrateLegacyProject(dir);
    assert.equal(await readFile(join(dir, 'estilos/_tools/x.mjs'), 'utf-8'), "const p = '_opensquad/_memory/company.md';\n");
    assert.ok(r.leftovers.includes(join('estilos', '_tools', 'x.mjs')), JSON.stringify(r.leftovers));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('idempotente', async () => {
  const dir = await legacyProject();
  try {
    await migrateLegacyProject(dir);
    const r = await migrateLegacyProject(dir);
    assert.equal(r.status, 'none');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('conflito quando existem as duas pastas', async () => {
  const dir = await legacyProject();
  try {
    await put(dir, '_borai/_memory/company.md', 'nova\n');
    const r = await migrateLegacyProject(dir);
    assert.equal(r.status, 'conflict');
    assert.equal(await readFile(join(dir, '_opensquad/_memory/company.md'), 'utf-8'), '# Empresa X\n');
    assert.equal(await readFile(join(dir, '_borai/_memory/company.md'), 'utf-8'), 'nova\n');
    assert.match(await readFile(join(dir, 'squads/s1/squad.yaml'), 'utf-8'), /_opensquad/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('update migra um projeto antigo e instala o comando novo', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'borai-migrate-'));
  try {
    await init(dir, { _skipPrompts: true });
    // Turn the fresh install into the old layout.
    await rename(join(dir, '_borai'), join(dir, '_opensquad'));
    await rename(join(dir, '_opensquad/.borai-version'), join(dir, '_opensquad/.opensquad-version'));
    await rename(join(dir, '.claude/skills/borai'), join(dir, '.claude/skills/opensquad'));
    const mcp = await readFile(join(dir, '.mcp.json'), 'utf-8');
    await writeFile(join(dir, '.mcp.json'), mcp.replaceAll('_borai/', '_opensquad/'), 'utf-8');

    const result = await update(dir);
    assert.equal(result.success, true);
    assert.ok(await exists(join(dir, '_borai/_memory/preferences.md')));
    assert.ok(await exists(join(dir, '.claude/skills/borai/SKILL.md')));
    assert.equal(await exists(join(dir, '.claude/skills/opensquad')), false);
    assert.doesNotMatch(await readFile(join(dir, '.mcp.json'), 'utf-8'), /_opensquad/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('update para em conflito', async () => {
  const dir = await legacyProject();
  try {
    await put(dir, '_borai/_memory/company.md', 'nova\n');
    const result = await update(dir);
    assert.equal(result.success, false);
    assert.ok(await exists(join(dir, '_opensquad/_memory/company.md')));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});


test('renomeia as skills criadoras em vez de perder ou duplicar', async () => {
  const dir = await legacyProject();
  try {
    await migrateLegacyProject(dir);
    assert.equal(await readFile(join(dir, 'skills/borai-skill-creator/SKILL.md'), 'utf-8'), 'old creator\n');
    assert.equal(await readFile(join(dir, 'skills/borai-agent-creator/SKILL.md'), 'utf-8'), 'old agent creator\n');
    assert.equal(await exists(join(dir, 'skills/opensquad-agent-creator')), false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('update lista só arquivos do usuário que ainda citam o nome antigo', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'borai-migrate-'));
  try {
    await init(dir, { _skipPrompts: true });
    await rename(join(dir, '_borai'), join(dir, '_opensquad'));
    await put(dir, 'CLAUDE.md', 'Use _opensquad/_memory\n');
    await put(dir, 'estilos/_tools/x.mjs', "const p = '_opensquad/_memory/company.md';\n");
    const result = await update(dir);
    assert.equal(result.success, true);
    assert.deepEqual(result.leftovers, [join('estilos', '_tools', 'x.mjs')]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('update preserva chaves do usuário no settings do VS Code', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'borai-migrate-'));
  try {
    await init(dir, { _skipPrompts: true, _ides: ['vscode-copilot'] });
    const settingsPath = join(dir, '.vscode/settings.json');
    const settings = JSON.parse(await readFile(settingsPath, 'utf-8'));
    settings['editor.fontSize'] = 14;
    await writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    await rename(join(dir, '_borai'), join(dir, '_opensquad'));
    await update(dir);
    const after = JSON.parse(await readFile(settingsPath, 'utf-8'));
    assert.equal(after['editor.fontSize'], 14);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('migração interrompida termina ao rodar de novo', async () => {
  const dir = await legacyProject();
  try {
    // Folder already renamed, but the rest never happened.
    await rename(join(dir, '_opensquad'), join(dir, '_borai'));
    const r = await migrateLegacyProject(dir);
    assert.equal(r.status, 'migrated');
    assert.equal(await exists(join(dir, '.claude/skills/opensquad')), false);
    assert.doesNotMatch(await readFile(join(dir, 'squads/s1/squad.yaml'), 'utf-8'), /_opensquad/);
    assert.ok(await exists(join(dir, 'skills/borai-skill-creator')));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('erro ao renomear vira mensagem, não stack trace', { skip: process.platform === 'win32' || process.getuid?.() === 0 }, async () => {
  const dir = await legacyProject();
  try {
    await chmod(dir, 0o555);
    const r = await migrateLegacyProject(dir);
    assert.equal(r.status, 'error');
    assert.ok(r.error);
    assert.ok(await exists(join(dir, '_opensquad/_memory/company.md')));
  } finally {
    await chmod(dir, 0o755);
    await rm(dir, { recursive: true, force: true });
  }
});

test('mensagem pede para reiniciar a IDE', async () => {
  const lines = [];
  printMigration({ status: 'migrated', actions: ['x'], leftovers: [] }, (l) => lines.push(l));
  assert.match(lines.join('\n'), /[Rr]einicie/);
});
