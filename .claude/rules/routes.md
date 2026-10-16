---
paths:
  - 'src/app/**'
---

# Route files

- Files under `src/app/` are routes. Do not put components, hooks, or helpers here; Expo Router
  would treat them as screens.
- Keep route files thin: read params with `useLocalSearchParams`, parse them into typed values,
  render a screen from `src/features/`. Render a not-found state when parsing fails.
- Route files need a default export. Everything else in the codebase uses named exports.
- Navigators are declared in `_layout.tsx`. Tabs import from `expo-router/js-tabs`; Stack, Link and
  `router` import from `expo-router`.
- Navigate with typed objects: `router.push({ pathname: '/posts/[id]', params: { id } })`.
