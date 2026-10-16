@AGENTS.md

# Claude Code notes

The import above loads the shared project instructions. This section covers Claude Code only.

## Repository tooling

- `.claude/settings.json`: shared permissions and hooks. Check commands (`npm run check` and its
  parts) run without prompts; installs, EAS commands and `git push` ask first; secrets are
  unreadable.
- A PostToolUse hook runs Prettier on each file Claude edits. Do not reformat files by hand.
- `.claude/rules/`: path-scoped rules that load when you work on routes, tests, or native config.
- Skills (invoke with `/name`): `/new-feature <name>`, `/verify`, `/rename-app`.
- Subagents: `code-reviewer` (read-only review of the current diff), `test-writer` (adds or fixes
  tests for a file or feature).

## Working style for this repo

- Before adding a dependency, check whether an Expo module already covers it, then ask the user.
  New dependencies are a user decision.
- When a change touches `app.config.ts`, `eas.json`, or a native-code library, say that a new
  development build is required.
- Report which checks you ran and their result. Do not claim the app runs on a device or simulator
  unless you ran it.
- Personal, uncommitted instructions belong in `CLAUDE.local.md` (gitignored).
