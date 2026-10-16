---
paths:
  - '**/__tests__/**'
  - '**/*.test.ts'
  - '**/*.test.tsx'
---

# Tests

- Place tests in `__tests__/` next to the code under test.
- `render`, `fireEvent.*` and `renderWithProviders` return promises in
  @testing-library/react-native 14: `await` every call.
- Mock the network at `globalThis.fetch` with `jsonResponse()` from `@/test/render`. Do not mock
  `@/lib/api/client` or feature `api.ts` modules in screen tests.
- Mock `expo-router` only for the members the component uses, e.g.
  `jest.mock('expo-router', () => ({ router: { push: jest.fn() } }))`.
- Prefer `getByRole` / `getByText`. Assert user-visible outcomes, not internal state.
- Cover success, error, and empty states for every screen that loads data.
