#!/usr/bin/env node
/**
 * Renames the template's identity in app.config.ts, package.json and package-lock.json.
 *
 *   npm run rename -- --name "Acme Notes" --slug acme-notes --bundle-id com.acme.notes
 *   npm run rename -- ... --android-package com.acme.notes --scheme acmenotes --dry-run
 *   npm run rename -- --check     # exit 1 if template placeholder values remain
 *
 * Uses only Node built-ins. Does not touch ios/ or android/: regenerate them afterwards
 * with `npm run prebuild`.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP_CONFIG = join(root, 'app.config.ts');
const PACKAGE_JSON = join(root, 'package.json');
const PACKAGE_LOCK = join(root, 'package-lock.json');

/** Template defaults. `--check` fails while any of these are still in app.config.ts. */
const PLACEHOLDERS = {
  name: 'TemplateApp',
  slug: 'template-app',
  scheme: 'templateapp',
  iosBundleIdentifier: 'com.example.templateapp',
  androidPackage: 'com.example.templateapp',
};

const JAVA_KEYWORDS = new Set(
  'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null'.split(
    ' ',
  ),
);

function fail(message) {
  console.error(`rename: ${message}`);
  process.exit(1);
}

const { values: args } = parseArgs({
  options: {
    name: { type: 'string' },
    slug: { type: 'string' },
    'bundle-id': { type: 'string' },
    'android-package': { type: 'string' },
    scheme: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
    check: { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
  strict: true,
});

if (args.help) {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0]);
  process.exit(0);
}

const KEY_PATTERN = (key) => new RegExp(`^(  ${key}: )'([^'\\n]*)',$`, 'm');

function readAppValues(source) {
  const result = {};
  for (const key of Object.keys(PLACEHOLDERS)) {
    const match = source.match(KEY_PATTERN(key));
    if (!match) fail(`could not find "${key}" in the APP block of app.config.ts`);
    result[key] = match[2];
  }
  return result;
}

const appConfigSource = readFileSync(APP_CONFIG, 'utf8');
const current = readAppValues(appConfigSource);

if (args.check) {
  const remaining = Object.entries(PLACEHOLDERS).filter(([key, value]) => current[key] === value);
  if (remaining.length > 0) {
    console.error('Template placeholders still set in app.config.ts:');
    for (const [key, value] of remaining) console.error(`  ${key}: ${value}`);
    process.exit(1);
  }
  console.log('No template placeholders remain in app.config.ts.');
  process.exit(0);
}

if (!args.name || !args.slug || !args['bundle-id']) {
  fail('--name, --slug and --bundle-id are required. Run with --help for usage.');
}

const next = {
  name: args.name.trim(),
  slug: args.slug,
  iosBundleIdentifier: args['bundle-id'],
  androidPackage: args['android-package'] ?? args['bundle-id'],
  scheme: args.scheme ?? args.slug.replace(/-/g, ''),
};

// Validate before writing anything.
if (!next.name || /['\\`\n]/.test(next.name)) {
  fail('--name must be non-empty and must not contain quotes, backticks, backslashes or newlines');
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(next.slug)) {
  fail('--slug must be lowercase letters, digits and single hyphens, e.g. acme-notes');
}
if (!/^[A-Za-z][A-Za-z0-9-]*(\.[A-Za-z][A-Za-z0-9-]*)+$/.test(next.iosBundleIdentifier)) {
  fail('--bundle-id must be reverse-DNS with at least two segments, e.g. com.acme.notes');
}
const androidSegments = next.androidPackage.split('.');
if (
  androidSegments.length < 2 ||
  androidSegments.some((s) => !/^[a-z][a-z0-9_]*$/.test(s) || JAVA_KEYWORDS.has(s))
) {
  fail(
    '--android-package must be lowercase reverse-DNS segments of [a-z0-9_] starting with a letter, ' +
      'none a Java keyword, e.g. com.acme.notes (hyphens are not allowed on Android)',
  );
}
if (!/^[a-z][a-z0-9+.-]*$/.test(next.scheme)) {
  fail('--scheme must start with a lowercase letter and contain only a-z, 0-9, +, . or -');
}

// Compute new file contents.
let nextAppConfig = appConfigSource;
for (const [key, value] of Object.entries(next)) {
  nextAppConfig = nextAppConfig.replace(KEY_PATTERN(key), `$1'${value}',`);
}

const pkg = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8'));
pkg.name = next.slug;

let lock = null;
if (existsSync(PACKAGE_LOCK)) {
  lock = JSON.parse(readFileSync(PACKAGE_LOCK, 'utf8'));
  lock.name = next.slug;
  if (lock.packages?.['']) lock.packages[''].name = next.slug;
}

console.log('Renaming:');
for (const key of Object.keys(next)) {
  console.log(`  ${key.padEnd(20)} ${current[key]}  ->  ${next[key]}`);
}

if (args['dry-run']) {
  console.log('\nDry run: no files written.');
  process.exit(0);
}

writeFileSync(APP_CONFIG, nextAppConfig);
writeFileSync(PACKAGE_JSON, `${JSON.stringify(pkg, null, 2)}\n`);
if (lock) writeFileSync(PACKAGE_LOCK, `${JSON.stringify(lock, null, 2)}\n`);

console.log('\nUpdated app.config.ts, package.json' + (lock ? ', package-lock.json' : '') + '.');
if (existsSync(join(root, 'ios')) || existsSync(join(root, 'android'))) {
  console.log(
    'Native folders exist: run `npm run prebuild` to regenerate them with the new identity.',
  );
}
console.log('Continue with the remaining items in README "Rename checklist".');
