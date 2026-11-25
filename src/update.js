import { cp, mkdir, readFile, stat } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLocale, t, getLocaleCode } from './i18n.js';
import { getTemplateEntries, loadSavedLocale, copyCanonicalSources, mergeVsCodeSettings, mergeQwenSettings, mergeGeminiSettings } from './init.js';
import { listAvailable as listAvailableSkills, listInstalled as listInstalledSkills, installSkill, getSkillMeta, getLocalizedDescription, installSkillDependencies, readDeclinedSkills, recordDeclinedSkills } from './skills.js';
import { createPrompt } from './prompt.js';
import { installBundledAgents } from './agents.js';
import { logEvent } from './logger.js';
import { migrateLegacyProject, printMigration, findLeftovers, printLeftovers } from './migrate.js';

async function loadSavedIdes(targetDir) {
  try {
    const prefsPath = join(targetDir, '_borai', '_memory', 'preferences.md');
    const content = await readFile(prefsPath, 'utf-8');
    const match = content.match(/\*\*IDEs:\*\*\s*(.+)/);
    if (match) {
      return match[1].trim().split(/,\s*/);
    }
  } catch {
    // No preferences file
  }
  return ['claude-code'];
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '..', 'templates');

const MERGED_SETTINGS = new Set([
  'vscode-copilot:.vscode/settings.json',
  'qwen-code:.qwen/settings.json',
  'gemini-cli:.gemini/settings.json',
]);

const PROTECTED_PATHS = [
  '_borai/_memory',
  'agents',
  'squads',
];

function isProtected(relativePath) {
  const normalized = relativePath.replaceAll('\\', '/');
  return PROTECTED_PATHS.some(
    (p) => normalized === p || normalized.startsWith(p + '/')
  );
}

async function backupIfExists(destPath) {
  try {
    await stat(destPath);
    const backupPath = destPath + '.bak';
    await cp(destPath, backupPath);
    return true;
  } catch {
    return false;
  }
}

export async function update(targetDir, options = {}) {
  console.log('\n  🔄 Borai — Update\n');

  // 0. Projects created with the old name are migrated first (see migrate.js).
  const migration = await migrateLegacyProject(targetDir);
  printMigration(migration);
  if (migration.status === 'conflict' || migration.status === 'error') return { success: false };

  // 1. Check initialized
  try {
    await stat(join(targetDir, '_borai'));
  } catch {
    await loadLocale('English');
    console.log(`  ${t('updateNotInitialized')}`);
    return { success: false };
  }

  // 2. Load user's locale
  await loadSavedLocale(targetDir);

  // 3. Read versions
  let currentVersion = null;
  try {
    currentVersion = (
      await readFile(join(targetDir, '_borai', '.borai-version'), 'utf-8')
    ).trim();
  } catch {
    // Legacy install — no version file
  }

  const newVersion = (
    await readFile(join(TEMPLATES_DIR, '_borai', '.borai-version'), 'utf-8')
  ).trim();

  // 4. Announce
  if (currentVersion) {
    console.log(
      `  ${t('updateStarting', { old: `v${currentVersion}`, new: `v${newVersion}` })}`
    );
  } else {
    console.log(`  ${t('updateStartingUnknown', { new: `v${newVersion}` })}`);
  }

  // 5. Copy common templates, skipping protected paths and ide-templates/
  const entries = await getTemplateEntries(TEMPLATES_DIR);
  let count = 0;

  for (const entry of entries) {
    const relativePath = relative(TEMPLATES_DIR, entry);
    if (isProtected(relativePath)) continue;
    // Skip ide-templates — handled separately below
    if (relativePath.replaceAll('\\', '/').startsWith('ide-templates/')) continue;

    const destPath = join(targetDir, relativePath);
    await mkdir(dirname(destPath), { recursive: true });
    const backed = await backupIfExists(destPath);
    await cp(entry, destPath);
    const displayPath = relativePath.replaceAll('\\', '/');
    if (backed) {
      console.log(`  ${t('updatedFile', { path: displayPath })} (backup: ${displayPath}.bak)`);
    } else {
      console.log(`  ${t('updatedFile', { path: displayPath })}`);
    }
    count++;
  }

  // 6. Copy IDE-specific templates based on saved preferences
  const ides = await loadSavedIdes(targetDir);
  for (const ide of ides) {
    const ideSrcDir = join(TEMPLATES_DIR, 'ide-templates', ide);
    let ideEntries;
    try {
      ideEntries = await getTemplateEntries(ideSrcDir);
    } catch {
      continue; // no template dir for this IDE
    }
    for (const entry of ideEntries) {
      const relPath = relative(ideSrcDir, entry);
      if (isProtected(relPath)) continue;
      // Settings files the user also edits are merged below, never overwritten.
      if (MERGED_SETTINGS.has(`${ide}:${relPath.replaceAll('\\', '/')}`)) continue;

      const destPath = join(targetDir, relPath);
      await mkdir(dirname(destPath), { recursive: true });
      const backed = await backupIfExists(destPath);
      await cp(entry, destPath);
      const displayPath = relPath.replaceAll('\\', '/');
      if (backed) {
        console.log(`  ${t('updatedFile', { path: displayPath })} (backup: ${displayPath}.bak)`);
      } else {
        console.log(`  ${t('updatedFile', { path: displayPath })}`);
      }
      count++;
    }
  }
  if (ides.includes('vscode-copilot')) await mergeVsCodeSettings(targetDir);
  if (ides.includes('qwen-code')) await mergeQwenSettings(targetDir);
  if (ides.includes('gemini-cli')) await mergeGeminiSettings(targetDir);

  // 6a. Copy canonical sources (core, config, dashboard)
  count += await copyCanonicalSources(targetDir, {
    overwrite: true,
    backupFn: backupIfExists,
    protectedFn: isProtected,
  });

  // 6b. Install new non-MCP, non-hybrid bundled skills not already present
  const availableSkills = await listAvailableSkills();
  const installedSkills = await listInstalledSkills(targetDir);
  for (const id of availableSkills) {
    if (id === 'borai-skill-creator') continue;
    if (installedSkills.includes(id)) continue;
    const meta = await getSkillMeta(id);
    if (!meta) continue;
    if (meta.type === 'mcp' || meta.type === 'hybrid') continue;
    if (meta.optional) continue;
    await installSkill(id, targetDir);
    console.log(`  ${t('createdFile', { path: `skills/${id}/SKILL.md` })}`);
    count++;
  }

  // 6b'. Optional skills (heavy): ask once, only in an interactive terminal; a "no" is remembered
  count += await offerOptionalSkills(targetDir, availableSkills, installedSkills, options);

  // 6c. Install bundled agents not already present (installed ones keep user edits)
  for (const id of await installBundledAgents(targetDir, { skipExisting: true })) {
    console.log(`  ${t('createdFile', { path: `agents/${id}.agent.md` })}`);
    count++;
  }

  // 7. Summary
  console.log(`\n  ${t('updateFileCount', { count })}`);
  console.log(`  ${t('updatePreserved')}`);
  console.log(`  ${t('updateSuccess', { version: `v${newVersion}` })}`);
  console.log(`\n  ${t('updateLatestHint')}\n`);

  await logEvent('update', { from: currentVersion || 'unknown', to: newVersion }, targetDir);

  // Only now, after templates were rewritten, list user files still citing the old folder.
  const leftovers = migration.status === 'migrated' ? await findLeftovers(targetDir) : [];
  printLeftovers(leftovers);

  return { success: true, leftovers };
}

async function offerOptionalSkills(targetDir, available, installed, options) {
  const interactive = options._optionalAnswers ? true : (process.stdin.isTTY && !options._skipPrompts);
  if (!interactive) return 0;
  const declined = await readDeclinedSkills(targetDir);
  let count = 0;
  for (const id of available) {
    if (installed.includes(id) || declined.includes(id)) continue;
    const meta = await getSkillMeta(id);
    if (!meta?.optional) continue;
    let yes;
    if (options._optionalAnswers) {
      yes = options._optionalAnswers[id] === true;
    } else {
      const prompt = createPrompt();
      try {
        const answer = await prompt.choose(
          t('askOptionalSkill', { name: id, size: meta.size || '?', description: getLocalizedDescription(meta, getLocaleCode()) }),
          [{ label: t('optionalSkillYes'), value: true }, { label: t('optionalSkillNo', { name: id }), value: false }],
        );
        yes = answer.value;
      } finally {
        prompt.close();
      }
    }
    if (yes) {
      await installSkill(id, targetDir);
      console.log(`  ${t('createdFile', { path: `skills/${id}/SKILL.md` })}`);
      if (!options._optionalAnswers) installSkillDependencies(id, targetDir);
      count++;
    } else {
      await recordDeclinedSkills(targetDir, [id]);
    }
  }
  return count;
}
