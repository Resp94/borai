import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { t } from './i18n.js';
import { loadSavedLocale } from './init.js';

// Runs the gallery server of the optional video-styles skill installed in the project.
export async function openGallery(targetDir, args = []) {
  await loadSavedLocale(targetDir);
  const script = join(targetDir, 'skills', 'video-styles', 'scripts', 'galeria.mjs');
  if (!existsSync(script)) {
    console.log(`\n  ${t('galleryNotInstalled')}\n`);
    return { success: false };
  }
  const code = await new Promise((resolve) => {
    const child = spawn(process.execPath, [script, ...args], { stdio: 'inherit' });
    child.on('exit', (c) => resolve(c ?? 0));
  });
  return { success: code === 0 };
}
