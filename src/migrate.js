// Migrates projects created with the old name (Opensquad) to Borai.
// Borai is a fork of Opensquad (Renato Asse); projects installed with the old
// name keep their data in `_opensquad/` and use `/opensquad` command files.
import { readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const OLD_DIR = '_opensquad';
const NEW_DIR = '_borai';
const OLD_VERSION = '.opensquad-version';
const NEW_VERSION = '.borai-version';

// `_opensquad` used as a folder name: followed by a path separator, a quote,
// whitespace or end of line. Rewritten to `_borai`.
const OLD_PATH_RE = /_opensquad(?=[/\\"'\s]|$)/gm;

// Folders owned by the framework: paths inside their files are rewritten.
const FRAMEWORK_DIRS = ['squads', join(NEW_DIR, '_memory'), 'skills', 'agents'];

// IDE config files the framework writes; only the old path inside them changes.
const IDE_CONFIGS = [
  '.mcp.json', '.cursor/mcp.json', '.vscode/mcp.json', '.vscode/settings.json',
  '.qwen/settings.json', '.gemini/settings.json', '.trae/mcp.json',
];

// Command files the old framework installed for each IDE. Replaced by the
// `borai` versions on update/init.
const OLD_COMMAND_FILES = [
  '.claude/skills/opensquad', '.agents/skills/opensquad', '.qwen/skills/opensquad',
  '.gemini/skills/opensquad', '.cursor/commands/opensquad.md', '.cursor/rules/opensquad.mdc',
  '.github/prompts/opensquad.prompt.md', '.agent/workflows/opensquad.md', '.agent/rules/opensquad.md',
  '.opencode/commands/opensquad.md', '.trae/rules/opensquad.md', 'skills/opensquad-skill-creator',
];

const SCAN_SKIP = new Set(['.git', 'node_modules']);
const MAX_SCAN_BYTES = 1024 * 1024;

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function* walk(dir, skip = () => false) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (skip(p, e)) continue;
    if (e.isDirectory()) yield* walk(p, skip);
    else if (e.isFile()) yield p;
  }
}

async function readText(p) {
  const info = await stat(p);
  if (info.size > MAX_SCAN_BYTES) return null;
  const buf = await readFile(p);
  if (buf.includes(0)) return null; // binary
  return buf.toString('utf-8');
}

async function rewritePaths(file) {
  const text = await readText(file).catch(() => null);
  if (text === null || !OLD_PATH_RE.test(text)) return false;
  OLD_PATH_RE.lastIndex = 0;
  await writeFile(file, text.replace(OLD_PATH_RE, NEW_DIR), 'utf-8');
  return true;
}

/**
 * @returns {Promise<{status: 'none'|'migrated'|'conflict', actions: string[], leftovers: string[]}>}
 */
export async function migrateLegacyProject(targetDir) {
  const result = { status: 'none', actions: [], leftovers: [] };
  const oldDir = join(targetDir, OLD_DIR);
  const newDir = join(targetDir, NEW_DIR);
  if (!(await exists(oldDir))) return result;
  if (await exists(newDir)) {
    result.status = 'conflict';
    return result;
  }

  // 1. Folder and version file.
  await rename(oldDir, newDir);
  result.actions.push(`${OLD_DIR}/ → ${NEW_DIR}/`);
  if (await exists(join(newDir, OLD_VERSION))) {
    await rename(join(newDir, OLD_VERSION), join(newDir, NEW_VERSION));
  }

  // 2. Old command files (the update/init that follows installs the new ones).
  for (const rel of OLD_COMMAND_FILES) {
    const p = join(targetDir, rel);
    if (await exists(p)) {
      await rm(p, { recursive: true, force: true });
      result.actions.push(`removido ${rel}`);
    }
  }

  // 3. Old path inside framework folders and IDE configs.
  const browserProfile = join(newDir, '_browser_profile');
  let rewritten = 0;
  for (const rel of FRAMEWORK_DIRS) {
    for await (const f of walk(join(targetDir, rel), (p) => p === browserProfile)) {
      if (await rewritePaths(f)) rewritten++;
    }
  }
  for (const rel of IDE_CONFIGS) {
    const p = join(targetDir, rel);
    if ((await exists(p)) && (await rewritePaths(p))) rewritten++;
  }
  if (rewritten) result.actions.push(`caminho ${OLD_DIR}/ trocado por ${NEW_DIR}/ em ${rewritten} arquivo(s)`);

  // 4. Report (without changing) the old path anywhere else in the project.
  const frameworkRoots = FRAMEWORK_DIRS.map((d) => join(targetDir, d));
  const ideConfigs = new Set(IDE_CONFIGS.map((c) => join(targetDir, c)));
  const skip = (p, e) => (e.isDirectory() && (SCAN_SKIP.has(e.name) || p === browserProfile))
    || frameworkRoots.includes(p);
  for await (const f of walk(targetDir, skip)) {
    if (ideConfigs.has(f)) continue;
    const text = await readText(f).catch(() => null);
    if (text !== null && text.includes(OLD_DIR)) result.leftovers.push(relative(targetDir, f));
  }

  result.status = 'migrated';
  return result;
}

export function printMigration(result, log = console.log) {
  if (result.status === 'conflict') {
    log(`\n  ⚠️  Este projeto tem as pastas ${OLD_DIR}/ e ${NEW_DIR}/ ao mesmo tempo.`);
    log(`  Nada foi alterado. Mantenha só uma delas (a com os seus dados) e rode de novo.\n`);
    return;
  }
  if (result.status !== 'migrated') return;
  log('\n  🔁 Projeto criado com o nome antigo (Opensquad) migrado para Borai:');
  for (const a of result.actions) log(`     - ${a}`);
  if (result.leftovers.length) {
    log(`  Estes arquivos fora das pastas do Borai ainda citam ${OLD_DIR}/ (não foram alterados):`);
    for (const f of result.leftovers) log(`     - ${f}`);
  }
  log('  O comando agora é /borai.\n');
}
