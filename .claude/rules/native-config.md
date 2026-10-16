---
paths:
  - 'app.config.ts'
  - 'eas.json'
  - 'assets/images/**'
---

# Native configuration

- `ios/` and `android/` are generated from `app.config.ts`. Configure native behavior here or in a
  config plugin, never by editing generated folders.
- Identity values in the `APP` block are changed with `npm run rename`, not by hand.
- After editing this file, check the resolved config with `npx expo config --type public` and tell
  the user a new development build (`npm run ios` / `npm run android` or an EAS build) is needed.
- Permissions: add only the iOS `infoPlist` usage strings and Android permissions the feature
  needs, with user-facing explanations.
- Icon and splash files are referenced by path; replacements must keep the same file names and
  sizes listed in `assets/images/README.md`.
