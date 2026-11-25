// Migrates projects created with the old name (Opensquad) to Borai.
// Borai is a fork of Opensquad (Renato Asse); projects installed with the old
// name keep their data in `_opensquad/` and use `/opensquad` command files.
//
// Every step checks its own state, so a migration interrupted halfway (e.g. a
// file locked on Windows) is finished by simply running update again.
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
  '.opencode/commands/opensquad.md', '.trae/rules/opensquad.md',
];

// Bundled skills that only changed name: moved, so the user's copy (and any
// edits) is kept and nothing is lost or duplicated.
const RENAMED_SKILLS = [
  ['skills/opensquad-skill-creator', 'skills/borai-skill-creator'],
  ['skills/opensquad-agent-creator', 'skills/borai-agent-creator'],
];

const SCAN_SKIP_DIRS = new Set(['.git', 'node_modules', NEW_DIR, OLD_DIR, '.venv', '__pycache__']);
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
  if (text === null) return false;
  const next = text.replace(OLD_PATH_RE, NEW_DIR);
  if (next === text) return false;
  await writeFile(file, next, 'utf-8');
  return true;
}

/**
 * Files outside the framework folders that still mention the old folder.
 * Reported to the user, never changed. Run it after templates are rewritten.
 */
export async function findLeftovers(targetDir) {
  const frameworkRoots = new Set(FRAMEWORK_DIRS.map((d) => join(targetDir, d)));
  const ideConfigs = new Set(IDE_CONFIGS.map((c) => join(targetDir, c)));
  const skip = (p, e) => (e.isDirectory() && SCAN_SKIP_DIRS.has(e.name)) || frameworkRoots.has(p);
  const leftovers = [];
  for await (const f of walk(targetDir, skip)) {
    if (ideConfigs.has(f) || f.endsWith('.bak')) continue;
    const text = await readText(f).catch(() => null);
    if (text !== null && text.includes(OLD_DIR)) leftovers.push(relative(targetDir, f));
  }
  return leftovers.sort();
}

/**
 * @returns {Promise<{status: 'none'|'migrated'|'conflict'|'error', actions: string[], leftovers: string[], error?: string}>}
 */
export async function migrateLegacyProject(targetDir) {
  const result = { status: 'none', actions: [], leftovers: [] };
  const oldDir = join(targetDir, OLD_DIR);
  const newDir = join(targetDir, NEW_DIR);

  try {
    // 1. Folder.
    if (await exists(oldDir)) {
      if (await exists(newDir)) {
        result.status = 'conflict';
        return result;
      }
      await rename(oldDir, newDir);
      result.actions.push(`${OLD_DIR}/ → ${NEW_DIR}/`);
    }
    if (!(await exists(newDir))) return result; // not a Borai project (yet)

    // 2. Version file.
    if ((await exists(join(newDir, OLD_VERSION))) && !(await exists(join(newDir, NEW_VERSION)))) {
      await rename(join(newDir, OLD_VERSION), join(newDir, NEW_VERSION));
      result.actions.push(`${OLD_VERSION} → ${NEW_VERSION}`);
    }

    // 3. Old command files (the update/init that follows installs the new ones).
    for (const rel of OLD_COMMAND_FILES) {
      const p = join(targetDir, rel);
      if (await exists(p)) {
        await rm(p, { recursive: true, force: true });
        result.actions.push(`removido ${rel}`);
      }
    }

    // 4. Renamed bundled skills.
    for (const [from, to] of RENAMED_SKILLS) {
      const src = join(targetDir, from);
      if (!(await exists(src))) continue;
      if (await exists(join(targetDir, to))) {
        await rm(src, { recursive: true, force: true });
      } else {
        await rename(src, join(targetDir, to));
      }
      result.actions.push(`${from} → ${to}`);
    }

    // 5. Old path inside framework folders and IDE configs.
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
  } catch (err) {
    result.status = 'error';
    result.error = err.message;
    return result;
  }

  if (result.actions.length) {
    result.status = 'migrated';
    result.leftovers = await findLeftovers(targetDir);
  }
  return result;
}

export function printMigration(result, log = console.log) {
  if (result.status === 'conflict') {
    log(`\n  ⚠️  Este projeto tem as pastas ${OLD_DIR}/ e ${NEW_DIR}/ ao mesmo tempo.`);
    log('  Nada foi alterado. Se a IDE ainda estava aberta com o navegador antigo, ela pode ter');
    log(`  recriado ${OLD_DIR}/_browser_profile/. Feche a IDE, mantenha só a pasta com os seus dados e rode de novo.\n`);
    return;
  }
  if (result.status === 'error') {
    log(`\n  ⚠️  A migração para Borai parou no meio: ${result.error}`);
    log('  Feche a IDE e o navegador (algum arquivo pode estar em uso) e rode o update de novo:');
    log('  ele continua de onde parou.\n');
    return;
  }
  if (result.status !== 'migrated') return;
  log('\n  🔁 Projeto criado com o nome antigo (Opensquad) migrado para Borai:');
  for (const a of result.actions) log(`     - ${a}`);
  log('  O comando agora é /borai. Reinicie a IDE para ela carregar o comando e o navegador novos.\n');
}

export function printLeftovers(leftovers, log = console.log) {
  if (!leftovers.length) return;
  log(`\n  Estes arquivos seus ainda citam ${OLD_DIR}/ e não foram alterados:`);
  for (const f of leftovers) log(`     - ${f}`);
  log(`  Troque por ${NEW_DIR}/ se eles usam a pasta do Borai.\n`);
}
