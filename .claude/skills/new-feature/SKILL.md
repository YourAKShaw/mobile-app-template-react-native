---
name: new-feature
description: Scaffold a new feature folder (api, queries, screen, tests) and its route following this repo's conventions. Use when the user asks to add a new screen or feature backed by an API.
argument-hint: '[feature-name] [short description]'
---

Create a feature named from `$ARGUMENTS` (kebab-case folder name, PascalCase component names).

Use `src/features/posts/` as the reference implementation. Read it before writing anything.

1. Confirm with the user, unless already stated: the API endpoint(s) and response shape, and
   whether the feature is a tab or a pushed screen. Do not invent an endpoint.
2. Create `src/features/<name>/`:
   - `api.ts`: zod schema(s) and functions calling `request()` from `@/lib/api/client`, accepting
     an optional `AbortSignal`.
   - `queries.ts`: query key factory and TanStack Query hooks passing `signal`.
   - `<Name>Screen.tsx`: loading, error (with retry), empty and success states using
     `@/components`.
   - `__tests__/<Name>Screen.test.tsx`: success, error, and empty paths with mocked fetch.
3. Add the route under `src/app/` (thin file; parse params). For a tab, register it in
   `src/app/(tabs)/_layout.tsx`. For a pushed screen with a custom title, add it to the Stack in
   `src/app/_layout.tsx`.
4. Run `npm run check` and fix failures.
5. Summarize the files created and any decision you made that the user should confirm.
