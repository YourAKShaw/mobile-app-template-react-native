---
name: rename-app
description: Rename the template to a real app (display name, slug, bundle ID, Android package, scheme) and walk through the rest of the rename checklist.
disable-model-invocation: true
argument-hint: '[display name]'
---

Rename this template. Display name hint: $ARGUMENTS

1. Ask the user for any value not yet given: display name, slug (kebab-case), iOS bundle ID,
   Android package (defaults to the bundle ID; no hyphens or Java keywords), URL scheme.
   Do not invent a company domain.
2. Run `npm run rename -- --name "<name>" --slug <slug> --bundle-id <id> --dry-run` (add
   `--android-package` / `--scheme` if they differ) and show the output.
3. After the user confirms, run it without `--dry-run`, then `npm run rename -- --check` and
   `npm run check`.
4. Walk through the remaining unchecked items in the README "Rename checklist" section, listing
   which ones need the user (icons, splash, colors, API URL, EAS project, license).
5. If `ios/` or `android/` exist, tell the user to run `npm run prebuild`.
