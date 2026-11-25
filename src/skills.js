import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUNDLED_SKILLS_DIR = join(__dirname, '..', 'skills');

const metaCache = new Map();

export async function listInstalled(targetDir) {
  try {
    const skillsDir = join(targetDir, 'skills');
    const entries = await readdir(skillsDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && e.name !== 'borai-skill-creator')
      .map((e) => e.name);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function listAvailable() {
  try {
    const entries = await readdir(BUNDLED_SKILLS_DIR, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

export async function getSkillMeta(id) {
  if (metaCache.has(id)) return metaCache.get(id);
  try {
    const raw = await readFile(join(BUNDLED_SKILLS_DIR, id, 'SKILL.md'), 'utf-8');
    const content = raw.replace(/\r\n/g, '\n');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return { name: id, description: '', descriptions: {}, type: '', env: [] };

    const fm = fmMatch[1];
    const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim() || id;
    const type = fm.match(/^type:\s*(.+)$/m)?.[1]?.trim() || '';

    // description may use YAML folded scalar (>)
    let description = '';
    const descBlock = fm.match(/^description:\s*>\s*\n((?:\s{2,}.+\n?)+)/m);
    if (descBlock) {
      description = descBlock[1].replace(/\n\s*/g, ' ').trim();
    } else {
      const descInline = fm.match(/^description:\s*(.+)$/m);
      if (descInline) description = descInline[1].trim();
    }

    // localized descriptions: description_pt-BR, description_es, etc.
    const descriptions = {};
    for (const code of ['pt-BR', 'es']) {
      const key = `description_${code}`;
      // folded scalar
      const blockMatch = fm.match(new RegExp(`^${key}:\\s*>\\s*\\n((?:\\s{2,}.+\\n?)+)`, 'm'));
      if (blockMatch) {
        descriptions[code] = blockMatch[1].replace(/\n\s*/g, ' ').trim();
      } else {
        // inline
        const inlineMatch = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
        if (inlineMatch) descriptions[code] = inlineMatch[1].trim();
      }
    }

    // env is a YAML list: lines starting with "  - "
    const env = [];
    const envSection = fm.match(/^env:\s*\n((?:\s+-\s+.+\n?)+)/m);
    if (envSection) {
      for (const line of envSection[1].split('\n')) {
        const item = line.match(/^\s+-\s+(.+)/);
        if (item) env.push(item[1].trim());
      }
    }

    // optional: true → never installed automatically; init/update ask the user first
    const optional = /^optional:\s*true\s*$/m.test(fm);
    const size = fm.match(/^size:\s*["']?([^"'\n]+?)["']?\s*$/m)?.[1] || '';

    const result = { name, description, descriptions, type, env, optional, size };
    metaCache.set(id, result);
    return result;
  } catch (err) {
    if (err.code === 'ENOENT') {
      metaCache.set(id, null);
      return null;
    }
    throw err;
  }
}

function validateSkillId(id) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    throw new Error(`Invalid skill id: '${id}'`);
  }
}

export async function installSkill(id, targetDir) {
  validateSkillId(id);
  const srcDir = join(BUNDLED_SKILLS_DIR, id);
  try {
    await stat(srcDir);
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error(`Skill '${id}' not found in registry`, { cause: err });
    throw err;
  }
  const destDir = join(targetDir, 'skills', id);
  const resolvedSrc = resolve(srcDir);
  const resolvedDest = resolve(destDir);
  if (resolvedSrc === resolvedDest || resolvedDest.startsWith(resolvedSrc + sep)) {
    return;
  }
  await cp(srcDir, destDir, { recursive: true });
  metaCache.delete(id);
}

export async function removeSkill(id, targetDir) {
  validateSkillId(id);
  const skillDir = join(targetDir, 'skills', id);
  await rm(skillDir, { recursive: true, force: true });
  metaCache.delete(id);
}

export function clearMetaCache() {
  metaCache.clear();
}

export async function getSkillVersion(id, targetDir) {
  try {
    const skillPath = join(targetDir, 'skills', id, 'SKILL.md');
    const content = await readFile(skillPath, 'utf-8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return null;
    const versionMatch = fmMatch[1].match(/^version:\s*(.+)$/m);
    return versionMatch ? versionMatch[1].trim() : null;
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

// Skills with their own package.json (e.g. video-styles) need `npm install` inside their folder.
export function installSkillDependencies(id, targetDir) {
  validateSkillId(id);
  const skillDir = join(targetDir, 'skills', id);
  if (!existsSync(join(skillDir, 'package.json'))) return false;
  execSync('npm install --no-audit --no-fund', { cwd: skillDir, stdio: 'inherit' });
  return true;
}

// Optional skills the user said no to are remembered in preferences.md, so update does not ask again.
const DECLINED_RE = /^- \*\*Declined Skills:\*\*\s*(.*)$/m;

export async function readDeclinedSkills(targetDir) {
  try {
    const content = await readFile(join(targetDir, '_borai', '_memory', 'preferences.md'), 'utf-8');
    const m = content.match(DECLINED_RE);
    return m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function declinedSkillsLine(ids) {
  return `- **Declined Skills:** ${ids.join(', ')}`;
}

export async function recordDeclinedSkills(targetDir, ids) {
  const prefsPath = join(targetDir, '_borai', '_memory', 'preferences.md');
  let content = '';
  try { content = await readFile(prefsPath, 'utf-8'); } catch { /* no preferences yet */ }
  const merged = [...new Set([...(await readDeclinedSkills(targetDir)), ...ids])];
  const line = declinedSkillsLine(merged);
  content = DECLINED_RE.test(content)
    ? content.replace(DECLINED_RE, line)
    : `${content.replace(/\n*$/, '\n')}${line}\n`;
  await mkdir(dirname(prefsPath), { recursive: true });
  await writeFile(prefsPath, content, 'utf-8');
}

export function getLocalizedDescription(meta, localeCode) {
  if (localeCode && localeCode !== 'en' && meta.descriptions?.[localeCode]) {
    return meta.descriptions[localeCode];
  }
  return meta.description;
}
