# Project instructions

Expo (React Native) app for iOS and Android. TypeScript strict. This file is the tool-neutral
source of truth for coding agents; `CLAUDE.md` imports it.

## Versions

- Expo SDK 58, React Native 0.88, React 19.3, TypeScript 6.0, Node 22 (`.nvmrc`).
- Expo changes APIs between SDKs. Before using an Expo, Expo Router, or React Native API, read the
  `expo` major version in `package.json` and check the matching docs at
  `https://docs.expo.dev/versions/v<major>.0.0/` or the index at https://docs.expo.dev/llms.txt.
  Do not rely on memory for API names.

## Commands

```bash
npm start                     # Metro dev server (use with a development build)
npm run ios | android         # build and run a development build locally (needs Xcode / Android SDK)
npm run prebuild              # regenerate ios/ and android/ from app.config.ts
npm run typecheck             # tsc --noEmit
npm run lint                  # eslint, zero warnings allowed
npm run format                # prettier --write
npm test                      # jest; single file: npm test -- path/to/file.test.tsx
npm run check                 # typecheck + lint + format:check + test (same as CI)
npm run doctor                # expo-doctor dependency/config checks
npx expo install <pkg>        # add a dependency; resolves SDK-compatible versions
```

Run `npm run check` before declaring a task done. Never add packages with `npm install <pkg>`;
use `npx expo install <pkg>` so versions match the SDK.

## Layout

```
src/app/            Expo Router routes only. Each file is a screen; _layout.tsx defines navigators.
                    Route files stay thin: parse params, render a screen from src/features.
src/features/<x>/   One folder per feature: api.ts (requests + zod schemas), queries.ts
                    (TanStack Query hooks), <Name>Screen.tsx, components/, __tests__/.
src/components/     Shared, feature-agnostic UI (AppText, Button, Screen, state views).
src/lib/api/        HTTP client (request()) and ApiError. No feature code here.
src/config/env.ts   Runtime env (EXPO_PUBLIC_*), validated with zod at startup.
src/state/          Client state that is not server data (zustand, persisted).
src/theme/          Design tokens and useAppTheme().
src/providers/      App-wide React providers.
src/test/           Jest setup and render helpers.
app.config.ts       App identity, icons, splash, plugins, build variants.
assets/images/      Icon and splash artwork (see assets/images/README.md).
```

## Conventions

- Imports use the `@/` alias for `src/` (`@/components`, `@/theme`). Relative imports only within
  a feature folder.
- Server data: fetch through `request(path, zodSchema, { signal })` in a feature's `api.ts`, expose
  via a TanStack Query hook in `queries.ts`. Never call `fetch` directly from components.
- Validate everything that crosses a trust boundary: API responses (zod schema), route params
  (parse to a typed value, render not-found on failure), env vars (`src/config/env.ts`).
- Client state goes in a zustand store in `src/state/`. Do not copy server data into it.
- Styling: `StyleSheet` plus tokens from `useAppTheme()`. No hard-coded colors outside
  `src/theme/tokens.ts`. Every screen must work in light and dark mode.
- Screens handle loading, error (with retry), and empty states using `src/components/StateViews`.
- Show users `toUserMessage(error)`; never render raw error messages or response bodies.
- Accessibility: interactive elements set `accessibilityRole`; touch targets at least 44pt.
- Components are function components with named exports. Route files use default exports
  (required by Expo Router).
- File names: `PascalCase.tsx` for components and screens, `camelCase.ts` otherwise.

## Testing

- Jest with `jest-expo` and `@testing-library/react-native` 14. `render`, `fireEvent.press` are
  async in v14: always `await` them.
- Render through `renderWithProviders` from `@/test/render`. Mock `globalThis.fetch` with
  `jsonResponse()`, not the API module, so the client and schemas are exercised.
- Query by role or visible text, not test IDs, unless there is no accessible alternative.
- New features need tests for the success, error, and empty paths.

## Native code and configuration

- `ios/` and `android/` are generated (Continuous Native Generation) and gitignored. Do not edit
  them; change `app.config.ts` or add a config plugin, then `npm run prebuild`.
- Libraries with native code need a new development build; they do not work in Expo Go.
- Build variants come from `APP_VARIANT` (development | preview | production). Non-production
  variants append `.dev` / `.preview` to the bundle ID.
- Builds and store submission use EAS (`eas.json`). Run EAS as `npx eas-cli@latest <command>`.

## Security

- `EXPO_PUBLIC_*` values are embedded in the app bundle and readable by anyone. Never put API
  secrets, private keys, or signing credentials in them, in source, or in tests.
- Never read or print `.env`, keystores, `.p8`/`.p12` files, or provisioning profiles.
- Do not log tokens, personal data, or full API responses.
