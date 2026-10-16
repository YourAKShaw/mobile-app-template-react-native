# App artwork

All files here are placeholder artwork. Replace them with files of the same name, size and
format; `app.config.ts` references them by path. Run `npm run prebuild` (or start a new EAS build)
afterwards: native projects copy the images at generation time.

| File                          | Used for                                  | Size        | Requirements                                                                                              |
| ----------------------------- | ----------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| `icon.png`                    | iOS app icon; fallback icon               | 1024 × 1024 | PNG, no transparency, square corners (iOS applies the mask)                                               |
| `android-icon-foreground.png` | Android adaptive icon foreground          | 1024 × 1024 | PNG with transparency. Keep artwork inside the central 66% circle; outer area may be cropped by launchers |
| `android-icon-monochrome.png` | Android 13+ themed icon                   | 1024 × 1024 | Single-color silhouette on transparency, same safe zone                                                   |
| `splash-icon.png`             | Splash screen image (iOS and Android 12+) | 1024 × 1024 | PNG with transparency, centered on the splash background color                                            |

Colors that go with the artwork live in `app.config.ts`:

- `ADAPTIVE_ICON_BACKGROUND`: Android adaptive icon background.
- `SPLASH_BACKGROUND`: splash screen background.

Android 12+ shows the splash image inside a circular mask; keep the important part of
`splash-icon.png` in the center. Expo's guide: https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/
