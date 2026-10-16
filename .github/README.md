<div align="center">

# 📱 React Native App Template

**A practical starting point for iOS and Android, built with Expo and TypeScript.**

Feature-based architecture, validated API data, light and dark themes, and automated checks.

[![Expo SDK 58](https://img.shields.io/badge/Expo-SDK%2058-000020?style=flat-square&logo=expo)](https://docs.expo.dev/versions/v58.0.0/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](../tsconfig.json)
[![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android-334155?style=flat-square)](#setup)
[![License: MIT](https://img.shields.io/badge/License-MIT-2563EB?style=flat-square)](../LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-2563EB?style=flat-square)](CONTRIBUTING.md)

[Get started](#setup) · [Explore the structure](#project-structure) · [Customize your app](#rename-checklist) · [Contribute](CONTRIBUTING.md) · [Get help](SUPPORT.md)

</div>

---

## ✨ What’s included

This template brings Expo Router, TanStack Query, zustand, and zod together with strict
TypeScript, Jest, ESLint, Prettier, and GitHub Actions. Shared agent instructions and Claude Code
configuration are included for teams using coding assistants.

The example **Posts** feature includes a list and detail screen backed by JSONPlaceholder.
**Settings** persists a light, dark, or system theme. Both provide working patterns to adapt
for your product; the template app identity remains `TemplateApp` until you rename it.

## Contents

- [Stack](#stack)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Native folders](#native-folders)
- [Configuration and environments](#configuration-and-environments)
- [Builds and releases](#builds-and-releases)
- [CI](#ci)
- [Claude Code](#claude-code)
- [Rename checklist](#rename-checklist)
- [Decision points](#decision-points)
- [Known limitations](#known-limitations)
- [Contributing and support](#contributing-and-support)
- [License](#license)

## Stack

| Concern            | Choice                                                                             |
| ------------------ | ---------------------------------------------------------------------------------- |
| Framework          | Expo SDK 58 (React Native 0.88, React 19.3)                                        |
| Language           | TypeScript 6.0, `strict` + `noUncheckedIndexedAccess`                              |
| Navigation         | Expo Router (file-based, typed routes)                                             |
| Server state / API | TanStack Query 5 + `fetch` wrapper (`src/lib/api/client.ts`) + zod 4 validation    |
| Client state       | zustand 5, persisted with AsyncStorage                                             |
| Theming            | Design tokens in `src/theme/tokens.ts`, light and dark palettes                    |
| Testing            | Jest 29 (`jest-expo` preset) + `@testing-library/react-native` 14                  |
| Lint / format      | ESLint 9 (`eslint-config-expo` flat config) + Prettier 3, `eslint-config-prettier` |
| Builds             | Continuous Native Generation (`expo prebuild`) locally; EAS Build for releases     |
| CI                 | GitHub Actions: typecheck, lint, format, tests, expo-doctor, prebuild              |

**Why Expo instead of the bare React Native CLI.** The React Native docs recommend starting new
apps with a framework and name Expo
([reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)). Expo
provides file-based routing, SDK-matched dependency versions (`npx expo install`), config plugins
for native setup, and cloud builds. Native code stays fully available: `npm run prebuild`
generates standard Xcode and Gradle projects, and any React Native library with native code works
in a development build. The trade-off is that native changes go through `app.config.ts` and config
plugins rather than direct edits (see [Native folders](#native-folders)).

The dependency versions are declared in [`package.json`](../package.json) and locked in
`package-lock.json`. Use `npx expo install` for SDK-compatible additions and `npm run doctor`
to check your local dependency and configuration health.

## Prerequisites

- Node.js 22.13 or newer in the 22.x line (`.nvmrc`; `nvm use`). Expo SDK 58 supports
  `^22.13.0 || ^24.3.0 || ^26.0.0`.
- npm 10 (ships with Node 22). The lockfile is `package-lock.json`.
- iOS: macOS with Xcode and an iOS Simulator, or an EAS account for cloud builds.
- Android: Android Studio with an SDK and an emulator, or an EAS account for cloud builds.
- Full environment guide: [docs.expo.dev/get-started/set-up-your-environment](https://docs.expo.dev/get-started/set-up-your-environment/).

## Setup

1. Create your repository from this template (GitHub **Use this template**), or clone it.
2. Install dependencies and create your env file:

   ```bash
   nvm use
   npm ci
   cp .env.example .env
   ```

3. Rename the template: see [Rename checklist](#rename-checklist). You can do this later, but
   bundle IDs are hard to change after a store release.
4. Run on a simulator or device. This builds a development build (includes `expo-dev-client`):

   ```bash
   npm run ios       # macOS + Xcode
   npm run android   # Android SDK + emulator or device
   ```

   After the first build, start only the JS bundler with `npm start`.

   Without local native tooling, build the development client in the cloud instead:
   `npx eas-cli@latest build --profile development --platform ios|android`.

5. Before committing: `npm run check`.

The app fails at startup with a clear message if `EXPO_PUBLIC_API_BASE_URL` is missing or not a
valid http(s) URL.

## Scripts

| Script                 | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `npm start`            | Start Metro for a development build                                 |
| `npm run ios`          | Generate `ios/` if needed, compile, install and launch on simulator |
| `npm run android`      | Generate `android/` if needed, compile, install and launch          |
| `npm run prebuild`     | Regenerate `ios/` and `android/` from `app.config.ts` (`--clean`)   |
| `npm run typecheck`    | `tsc --noEmit`                                                      |
| `npm run lint`         | ESLint, fails on any warning                                        |
| `npm run lint:fix`     | ESLint with autofix                                                 |
| `npm run format`       | Prettier write                                                      |
| `npm run format:check` | Prettier check                                                      |
| `npm test`             | Jest. One file: `npm test -- src/features/posts`                    |
| `npm run check`        | typecheck + lint + format:check + test. Same as the CI `checks` job |
| `npm run doctor`       | `expo-doctor`: dependency versions and config problems              |
| `npm run rename`       | Rename the app identity (see [Rename checklist](#rename-checklist)) |

Add dependencies with `npx expo install <package>`, not `npm install <package>`, so versions match
the SDK.

## Project structure

```
.
├── AGENTS.md                     # Agent instructions shared by all coding tools
├── CLAUDE.md                     # Claude Code memory: imports AGENTS.md + Claude-specific notes
├── .claude/                      # Claude Code configuration (see "Claude Code")
├── .github/
│   ├── README.md                 # Repository overview and setup (this file)
│   ├── CONTRIBUTING.md           # Development workflow and review expectations
│   ├── SUPPORT.md                # Troubleshooting and where to ask for help
│   ├── ISSUE_TEMPLATE/           # Bug, improvement, and documentation forms
│   ├── pull_request_template.md  # Change summary and verification
│   ├── dependabot.yml            # GitHub Actions version updates
│   └── workflows/ci.yml          # Quality checks and native configuration validation
├── app.config.ts                 # App identity, icons, splash, plugins, build variants
├── eas.json                      # EAS Build profiles: development, preview, production
├── assets/images/                # Placeholder icon and splash artwork (+ README with sizes)
├── scripts/rename.mjs            # Rename script
├── src/
│   ├── app/                      # Expo Router routes only
│   │   ├── _layout.tsx           # Root: providers, theme, splash, Stack
│   │   ├── +not-found.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx       # Tab navigator
│   │   │   ├── index.tsx         # Posts tab
│   │   │   └── settings.tsx      # Settings tab
│   │   └── posts/[id].tsx        # Post detail
│   ├── features/
│   │   ├── posts/                # Example feature: api.ts, queries.ts, screens, components, tests
│   │   └── settings/
│   ├── components/               # Shared UI: AppText, Button, Screen, Loading/Error/Empty states
│   ├── lib/api/                  # request() and ApiError
│   ├── config/env.ts             # Validated EXPO_PUBLIC_* config
│   ├── state/                    # zustand stores
│   ├── theme/                    # Tokens + useAppTheme()
│   ├── providers/                # QueryClient and other app-wide providers
│   └── test/                     # Jest setup and render helpers
├── .env.example
├── .nvmrc
├── eslint.config.js
├── jest.config.js
├── tsconfig.json
└── package.json
```

Data flow for a screen: route file (`src/app`) → feature screen → TanStack Query hook
(`queries.ts`) → API function (`api.ts`) → `request()` → `fetch`, with the response validated by a
zod schema. Errors surface as `ApiError` and are shown with `toUserMessage()`.

### Adding a feature

1. Create `src/features/<name>/` with `api.ts`, `queries.ts`, `<Name>Screen.tsx`, `__tests__/`.
   Copy the shape of `src/features/posts/`.
2. Add a route file in `src/app/` that renders the screen.
3. `npm run check`.

In Claude Code, `/new-feature <name>` performs these steps.

## Native folders

This template uses Expo's
[Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/):
`ios/` and `android/` are generated from `app.config.ts` and its plugins by `npm run prebuild`,
`npm run ios`, `npm run android`, or EAS Build, and they are gitignored. All native build settings
the template needs (bundle IDs, icons, splash, URL scheme, variants) are declared in
`app.config.ts`. CI regenerates both projects on every push to catch config errors.

Reasons: renaming and SDK upgrades become config edits instead of Xcode/Gradle diffs, and the
generated projects cannot drift from the config.

**If you need to edit native code directly** (custom native modules without a config plugin,
vendor SDKs that require manual project edits):

1. Run `npm run prebuild`.
2. Remove `/ios` and `/android` from `.gitignore` and commit both folders.
3. From then on, `app.config.ts` changes to native settings no longer apply automatically. Make
   them in Xcode/Gradle, or re-run prebuild and re-apply your edits.
4. Update `AGENTS.md` ("Native code and configuration") and `.claude/rules/native-config.md`.

## Configuration and environments

| Where                    | What                                                            | When it is read        |
| ------------------------ | --------------------------------------------------------------- | ---------------------- |
| `app.config.ts` `APP`    | Name, slug, scheme, bundle ID, Android package, EAS IDs         | Build time             |
| `APP_VARIANT` env var    | `development` / `preview` / `production`                        | Build time             |
| `.env` (`EXPO_PUBLIC_*`) | Runtime config (API base URL), validated in `src/config/env.ts` | Inlined at bundle time |

- `EXPO_PUBLIC_*` values are compiled into the JavaScript bundle and are readable by anyone with
  the app. Do not store secrets in them. Server-side secrets belong on your backend.
- To add a variable: add it to `.env.example`, to the zod schema and the object literal in
  `src/config/env.ts` (Expo only inlines literal `process.env.EXPO_PUBLIC_X` accesses), and to
  `src/test/setup.ts` if tests need it. For EAS builds, set it as an EAS environment variable.
- Variants: `development` and `preview` append `.dev` / `.preview` to the bundle ID and
  ` (Dev)` / ` (Preview)` to the name so they install alongside production. `eas.json` sets
  `APP_VARIANT` per profile. Reference:
  [docs.expo.dev/build-reference/variants](https://docs.expo.dev/build-reference/variants/).

## Builds and releases

Release builds use EAS (`eas.json`). One-time setup:

```bash
npx eas-cli@latest login
npx eas-cli@latest init          # creates the EAS project; copy projectId and owner into app.config.ts APP
```

Then:

```bash
npx eas-cli@latest build --profile development --platform all   # dev client for testers
npx eas-cli@latest build --profile preview --platform all       # internal distribution
npx eas-cli@latest build --profile production --platform all    # store builds
npx eas-cli@latest submit --platform ios|android                # upload to stores
```

`eas.json` uses `appVersionSource: remote`, so EAS manages build numbers; `version` in
`app.config.ts` is the user-facing version. Signing credentials are managed by EAS by default and
must never be committed (`.gitignore` excludes keystores, `.p8`, `.p12` and provisioning profiles).

Local release builds without EAS are possible after `npm run prebuild` with Xcode (Archive) and
Gradle (`./gradlew bundleRelease`); you then manage signing yourself.

## CI

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`:

- `checks`: `npm ci`, typecheck, lint, format check, Jest, `expo-doctor`.
- `native-config`: `expo prebuild` and `expo export` (JS bundle for iOS and Android) for the
  `development` and `production` variants on Ubuntu. This validates `app.config.ts`, plugins, and
  Metro bundling. It does **not** compile the native apps; that needs
  macOS runners with Xcode (iOS) or the Android SDK. Add EAS builds or platform build jobs when you
  are ready to pay for them.

Permissions are `contents: read`. No secrets are used.

## Claude Code

Files Claude Code reads in this repository. Conventions were checked against the Claude Code docs
on 2026-10-16 ([.claude directory](https://code.claude.com/docs/en/claude-directory),
[memory](https://code.claude.com/docs/en/memory), [settings](https://code.claude.com/docs/en/settings),
[permissions](https://code.claude.com/docs/en/permissions), [hooks](https://code.claude.com/docs/en/hooks),
[skills](https://code.claude.com/docs/en/skills), [subagents](https://code.claude.com/docs/en/sub-agents)).

| Path                                  | Purpose                                                                                                                                                                                                   | Committed |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `AGENTS.md`                           | Project instructions in the cross-tool format: commands, layout, conventions, security rules. Edit this file for instructions every agent should follow.                                                  | yes       |
| `CLAUDE.md`                           | Loaded at the start of every Claude Code session. Imports `AGENTS.md` with `@AGENTS.md`, then adds Claude-specific notes. When both files exist Claude Code reads `CLAUDE.md`, so the import is required. | yes       |
| `CLAUDE.local.md`                     | Personal project notes. Create it yourself if needed.                                                                                                                                                     | no        |
| `.claude/settings.json`               | Shared settings: permission allow/ask/deny rules, the format hook, and the Expo plugin.                                                                                                                   | yes       |
| `.claude/settings.local.json`         | Personal overrides; takes precedence over `settings.json`.                                                                                                                                                | no        |
| `.claude/hooks/format-file.mjs`       | PostToolUse hook: runs Prettier on every file Claude edits or writes. Reports syntax errors back to Claude.                                                                                               | yes       |
| `.claude/rules/*.md`                  | Path-scoped instructions (`paths:` frontmatter) loaded only when Claude works on matching files: `routes.md`, `testing.md`, `native-config.md`.                                                           | yes       |
| `.claude/agents/code-reviewer.md`     | Subagent: read-only review of the current diff against repo conventions.                                                                                                                                  | yes       |
| `.claude/agents/test-writer.md`       | Subagent: writes or repairs Jest tests.                                                                                                                                                                   | yes       |
| `.claude/skills/new-feature/SKILL.md` | `/new-feature <name>`: scaffolds a feature folder, route and tests.                                                                                                                                       | yes       |
| `.claude/skills/verify/SKILL.md`      | `/verify`: runs all checks and reports PASS/FAIL per check.                                                                                                                                               | yes       |
| `.claude/skills/rename-app/SKILL.md`  | `/rename-app`: guided rename using `scripts/rename.mjs`. Manual-only (`disable-model-invocation`).                                                                                                        | yes       |

Notes:

- Slash commands are implemented as skills (`.claude/skills/<name>/SKILL.md`). The docs state that
  custom commands have been merged into skills; `.claude/commands/<name>.md` files still work and
  create the same `/name`, but skills are recommended for new work. Add a command file there if you
  prefer the single-file format.
- Permissions: check commands run without prompts; dependency installs, prebuild, EAS commands and
  `git push` always ask; `.env` files and signing material are unreadable by Claude's file tools.
  Deny rules on `Read` do not stop every shell form of reading a file; they are a guard, not a
  security boundary.
- `enabledPlugins` enables `expo@claude-plugins-official`, the Expo plugin that Expo's own SDK 58
  default template enables. Remove the entry if you do not want it.
- `.mcp.json` (project MCP servers) is not included. Add one if your team uses MCP servers.
- The hook needs `node` on `PATH` and `npm ci` already run; it does nothing otherwise.

## Rename checklist

Run the script first, then work through the rest. `npm run rename -- --check` exits non-zero while
template identity values remain.

```bash
npm run rename -- --name "Acme Notes" --slug acme-notes --bundle-id com.acme.notes --dry-run
npm run rename -- --name "Acme Notes" --slug acme-notes --bundle-id com.acme.notes
# optional: --android-package com.acme.notes_app --scheme acmenotes
```

The script validates the values (Android packages cannot contain hyphens or Java keywords) and
updates `app.config.ts`, `package.json` and `package-lock.json`.

- [ ] Run `npm run rename` (display name, slug, iOS bundle ID, Android package, URL scheme).
- [ ] Replace artwork in `assets/images/` (sizes in [`assets/images/README.md`](../assets/images/README.md)) and set
      `SPLASH_BACKGROUND` / `ADAPTIVE_ICON_BACKGROUND` in `app.config.ts`.
- [ ] Replace the palette in `src/theme/tokens.ts`.
- [ ] Set `EXPO_PUBLIC_API_BASE_URL` in `.env.example`, your `.env`, and EAS environment variables.
- [ ] Replace or delete the example `src/features/posts/` feature and its route `src/app/posts/`,
      and update the tabs in `src/app/(tabs)/_layout.tsx`.
- [ ] Run `npx eas-cli@latest init` and fill `easProjectId` and `owner` in `app.config.ts`.
- [ ] Set `version` in `app.config.ts`.
- [ ] Update the title and description at the top of this README.
- [ ] Choose a license and update `LICENSE` (the template's MIT license has a placeholder holder).
- [ ] Update `AGENTS.md` with your product's domain terms and any decisions from below.
- [ ] If `ios/` or `android/` exist locally: `npm run prebuild`.
- [ ] `npm run check` and `npm run doctor`.
- [ ] Mark the GitHub repo as a template only if you are publishing your own template.

## Decision points

The template makes no choice for these. Record decisions in `AGENTS.md`.

| Decision                    | Template state                                        | Notes                                                                                                 |
| --------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Backend / API               | JSONPlaceholder demo API for the example feature only | Replace `EXPO_PUBLIC_API_BASE_URL` and the `posts` schemas.                                           |
| Authentication              | None                                                  | Add auth headers in `src/lib/api/client.ts`. Store tokens with `expo-secure-store`, not AsyncStorage. |
| Client state library        | zustand (one small persisted store)                   | Replaceable; only `src/state/` and `useAppTheme` depend on it.                                        |
| Server state library        | TanStack Query                                        | Widely used with React Native; handles caching, retries, cancellation.                                |
| Committed native folders    | No (CNG)                                              | See [Native folders](#native-folders).                                                                |
| Crash reporting / analytics | None                                                  | Choose a vendor; most provide an Expo config plugin.                                                  |
| Internationalization        | None; strings are inline English                      | Options: `expo-localization` plus an i18n library.                                                    |
| Over-the-air updates        | Not configured                                        | `expo-updates` + EAS Update, if you want JS updates without store review.                             |
| End-to-end tests            | None                                                  | Maestro or Detox; both need built apps, so they belong in a separate CI job.                          |
| Web target                  | Not supported                                         | `react-dom` is installed only because Expo Router declares it as a peer dependency.                   |
| Tablet support              | iOS `supportsTablet: true`, portrait only             | Adjust `orientation` and `ios.supportsTablet` in `app.config.ts`.                                     |
| Package manager             | npm                                                   | Switching needs a new lockfile and CI cache change.                                                   |

## Known limitations

The following is the original authoring verification record (2026-10-16, Linux, Node 22.19,
npm 10.9), rather than a live CI status. Run the checks in your own environment:

- Executed and passing: `npm run typecheck` (also with Expo Router's generated typed routes),
  `npm run lint`, `npm run format:check`, `npm test` (23 tests), `npx expo-doctor` (20/20),
  `npx expo config` for each variant, `npx expo prebuild --no-install` generating both `ios/` and
  `android/` with the placeholder identifiers, icons and splash, `npx expo export` producing iOS
  and Android Hermes bundles, `scripts/rename.mjs` (dry run, validation errors, and a real run on a
  copy), and the Prettier hook (sample inputs piped to it, and triggered in a live Claude Code
  session while the template was written).
- **Not run:** compiling or launching the app on iOS or Android (no Xcode or Android SDK in the
  authoring environment), EAS builds, the GitHub Actions workflow on GitHub, the subagents and skills
  inside a Claude Code session, and the `expo@claude-plugins-official` plugin install.
- Run `npm run ios` and `npm run android` once after cloning to confirm your toolchain.

---

<a id="contributing-and-support"></a>

## 🤝 Contributing and support

Read the [contribution guide](CONTRIBUTING.md) for the development workflow, testing expectations,
and pull request checklist. The [support guide](SUPPORT.md) covers troubleshooting and choosing
the right issue form.

## License

Distributed under the **MIT License**. See [LICENSE](../LICENSE) for details.
