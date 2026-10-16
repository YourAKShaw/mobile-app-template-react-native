import { useColorScheme } from 'react-native';

import { usePreferences } from '@/state/preferences';

import { palettes, radius, spacing, typography, type ColorScheme } from './tokens';

/** Resolves the user's theme preference against the OS setting and returns the active tokens. */
export function useAppTheme() {
  const preference = usePreferences((state) => state.themePreference);
  const system = useColorScheme();
  const scheme: ColorScheme =
    preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  return { scheme, colors: palettes[scheme], spacing, radius, typography };
}

export type AppTheme = ReturnType<typeof useAppTheme>;
