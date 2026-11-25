#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { init } from '../src/init.js';
import { update } from '../src/update.js';
import { skillsCli } from '../src/skills-cli.js';
import { agentsCli } from '../src/agents-cli.js';
import { listRuns, printRuns } from '../src/runs.js';
import { openGallery } from '../src/gallery.js';

const { positionals } = parseArgs({
  allowPositionals: true,
  strict: false,
});

const command = positionals[0];

if (command === 'init') {
  await init(process.cwd());
} else if (command === 'install') {
  // npx github:Resp94/borai install <name>
  const result = await skillsCli('install', positionals.slice(1), process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'uninstall') {
  // npx github:Resp94/borai uninstall <name>
  const result = await skillsCli('remove', positionals.slice(1), process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'update') {
  const target = positionals[1];
  if (target) {
    // npx github:Resp94/borai update <name> → update specific skill
    const result = await skillsCli('update-one', [target], process.cwd());
    if (!result.success) process.exitCode = 1;
  } else {
    // npx github:Resp94/borai update → update core
    const result = await update(process.cwd());
    if (!result.success) process.exitCode = 1;
  }
} else if (command === 'skills') {
  // Backward compat: npx github:Resp94/borai skills list|install|remove|update
  const subcommand = positionals[1];
  const args = positionals.slice(2);
  const result = await skillsCli(subcommand, args, process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'agents') {
  const subcommand = positionals[1];
  const args = positionals.slice(2);
  const result = await agentsCli(subcommand, args, process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'galeria' || command === 'gallery') {
  // npx github:Resp94/borai galeria → opens the video-styles gallery (optional skill)
  const result = await openGallery(process.cwd(), process.argv.slice(process.argv.indexOf(command) + 1));
  if (!result.success) process.exitCode = 1;
} else if (command === 'runs') {
  const squadName = positionals[1] || null;
  const runs = await listRuns(squadName, process.cwd());
  printRuns(runs);
} else {
  console.log(`
  Borai — Multi-agent orchestration for Claude Code

  Usage:
    npx github:Resp94/borai init                    Initialize Borai
    npx github:Resp94/borai update                  Update Borai core
    npx github:Resp94/borai install <name>          Install a skill
    npx github:Resp94/borai uninstall <name>        Remove a skill
    npx github:Resp94/borai update <name>           Update a specific skill
    npx github:Resp94/borai skills                  List installed skills
    npx github:Resp94/borai agents                  List installed agents
    npx github:Resp94/borai agents install <name>   Install a predefined agent
    npx github:Resp94/borai agents remove <name>    Remove an agent
    npx github:Resp94/borai agents update           Update all agents
    npx github:Resp94/borai runs [squad-name]       View execution history
    npx github:Resp94/borai galeria                 Open the video styles gallery

  Learn more: https://github.com/Resp94/borai
  `);
  if (command) process.exitCode = 1;
}
