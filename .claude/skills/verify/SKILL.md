---
name: verify
description: Run every project check (typecheck, lint, format, tests, expo-doctor) and report results. Use before committing or when asked whether the project is healthy.
allowed-tools: Bash(npm run check) Bash(npm run typecheck) Bash(npm run lint) Bash(npm run format:check) Bash(npm test *) Bash(npm run doctor)
---

Run these in order and keep going after a failure so the report is complete:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run format:check`
4. `npm test -- --ci`
5. `npm run doctor` (needs network; report NOT RUN if it cannot reach the registry)

Report a table with each check and PASS / FAIL / NOT RUN. For each failure give the first
relevant error with file:line and the likely fix. Do not fix anything unless the user asks.

These checks do not build the native app. Say so if the user asks whether the app works on a
device.
