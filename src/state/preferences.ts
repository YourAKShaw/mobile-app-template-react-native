import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';

type PreferencesState = {
  themePreference: ThemePreference;
  /** True once stored values were loaded, or loading failed and defaults are in use. Not persisted. */
  hydrated: boolean;
  setThemePreference: (value: ThemePreference) => void;
};

/**
 * Client-side app state that survives restarts. Server data belongs in TanStack Query,
 * not here. Bump `version` and add `migrate` when the persisted shape changes.
 */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      hydrated: false,
      setThemePreference: (themePreference) => set({ themePreference }),
    }),
    {
      name: 'preferences',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themePreference: state.themePreference }),
      // Called on success and on failure. Without this, a storage error would leave
      // `hydrated` false and keep the splash screen up forever.
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn('Could not load saved preferences; using defaults.');
        usePreferences.setState({ hydrated: true });
      },
    },
  ),
);
