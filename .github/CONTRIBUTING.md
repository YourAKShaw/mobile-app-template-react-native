# Contributing

Thanks for helping improve this React Native template. Changes should keep it easy to start,
customize, and maintain an iOS or Android app.

## Before you start

- Read the [README](README.md) for setup and architecture.
- Follow [AGENTS.md](../AGENTS.md), the shared source of project conventions.
- Use an issue to describe substantial changes before investing in an implementation.
- Keep fixes focused and explain which template workflow they improve.

## Local development

Run commands from the repository root with Node 22 (`nvm use`) and npm:

```bash
npm ci
cp .env.example .env
npm run check
```

For device testing, use `npm run ios` or `npm run android` with the appropriate native toolchain.
The app uses development builds. After the initial build, `npm start` starts Metro.
See the [setup guide](README.md#setup) for cloud build options.

Install dependencies with `npx expo install <package>` so they match the Expo SDK. Keep the
lockfile in sync. Avoid unrelated upgrades and formatting changes.

## Implementation conventions

- Keep route files thin and feature code in `src/features/<name>/`.
- Fetch through the shared HTTP client and validate API responses with zod.
- Use theme tokens, support light and dark mode, and provide accessible touch targets.
- Cover loading, error with retry, and empty states; show safe user-facing error messages.
- Change native configuration through `app.config.ts` or config plugins. Generated `ios/` and
  `android/` directories are ignored and should not be edited or committed.
- Keep secrets and personal data out of source, fixtures, issues, and logs. `EXPO_PUBLIC_*`
  variables are public values embedded in the app bundle.

## Verification

Run `npm run check` before opening a pull request. It runs TypeScript, ESLint, Prettier, and Jest.
New features need success, error, and empty-path tests. Use `renderWithProviders` and mock the
network with `jsonResponse()` so the client and response schemas remain exercised.

For dependency or app configuration changes, also run `npm run doctor`. Validate relevant build
variants and regenerate native projects when appropriate. Native libraries require a new
development build. Report which platforms and variants you actually exercised.

Documentation-only changes still need formatting and working relative links. Commands in the
README assume the repository root, even though the README lives in `.github/`.

## Pull requests

Use the [pull request template](pull_request_template.md). Explain the problem, resulting
behavior, and verification. Include screenshots for visual changes in both themes where relevant.
Mark checks that were not run and explain why; do not imply that bundle generation proves a
native app compiles or runs.

Update affected documentation, including links relative to `.github/README.md`. Keep the
repository license at the root.
