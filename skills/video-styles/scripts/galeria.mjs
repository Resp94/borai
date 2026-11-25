#!/usr/bin/env node
// Abre a galeria de estilos: instala as dependências na primeira vez, sobe um servidor local
// (só 127.0.0.1) na pasta da skill e abre o navegador. Uso: node galeria.mjs [--port 8765] [--no-open]
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync, spawn } from 'node:child_process';
import { createServer } from 'node:net';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const portArg = args.indexOf('--port');
const port = portArg >= 0 ? Number(args[portArg + 1]) : 8765;
const abrir = !args.includes('--no-open');

if (!existsSync(join(ROOT, 'node_modules', 'three'))) {
  console.log('\n  Instalando dependências da galeria (three, playwright-core)…\n');
  execSync('npm install --no-audit --no-fund', { cwd: ROOT, stdio: 'inherit' });
}

const { serve } = await import(pathToFileURL(join(ROOT, 'core', 'render', 'serve.mjs')).href);

// porta ocupada: usa uma livre
const livre = (p) => new Promise((ok) => {
  const t = createServer().once('error', () => ok(false)).once('listening', () => t.close(() => ok(true)));
  t.listen(p, '127.0.0.1');
});
const { port: porta } = await serve(ROOT, (await livre(port)) ? port : 0);
const url = `http://127.0.0.1:${porta}/gallery/index.html`;

console.log(`\n  Galeria de estilos: ${url}`);
console.log('  Ctrl+C para fechar.\n');

if (abrir) {
  const [cmd, cmdArgs] = process.platform === 'darwin' ? ['open', [url]]
    : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : ['xdg-open', [url]];
  try { spawn(cmd, cmdArgs, { stdio: 'ignore', detached: true }).unref(); }
  catch { /* sem navegador: o endereço já foi mostrado */ }
}
