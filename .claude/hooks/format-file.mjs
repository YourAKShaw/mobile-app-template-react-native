#!/usr/bin/env node
// PostToolUse hook: formats the file Claude just edited with the project's Prettier.
// Reads the hook payload (JSON) from stdin. Exit 0 = done; exit 2 = show stderr to Claude.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const prettierBin = join(projectDir, 'node_modules', '.bin', 'prettier');

let filePath;
try {
  filePath = JSON.parse(readFileSync(0, 'utf8'))?.tool_input?.file_path;
} catch {
  process.exit(0);
}

if (typeof filePath !== 'string' || !existsSync(prettierBin)) process.exit(0);

// Only format files inside the project, never node_modules or generated native code.
const rel = relative(projectDir, resolve(projectDir, filePath));
if (rel.startsWith('..') || /^(node_modules|ios|android)[\\/]/.test(rel)) process.exit(0);

const result = spawnSync(prettierBin, ['--write', '--ignore-unknown', '--log-level', 'warn', rel], {
  cwd: projectDir,
  encoding: 'utf8',
  timeout: 25_000,
});

if (result.status !== 0) {
  const message = (result.stderr || result.stdout || 'unknown error')
    .split('\n')
    .slice(0, 5)
    .join('\n');
  console.error(`Prettier could not format ${rel}:\n${message}`);
  process.exit(2);
}
