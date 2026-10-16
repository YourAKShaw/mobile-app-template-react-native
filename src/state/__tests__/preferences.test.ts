import AsyncStorage from '@react-native-async-storage/async-storage';

import { usePreferences } from '../preferences';

beforeEach(() => {
  usePreferences.setState({ themePreference: 'system' });
});

it('defaults to the system theme', () => {
  expect(usePreferences.getState().themePreference).toBe('system');
});

it('persists a changed preference without persisting runtime flags', async () => {
  usePreferences.getState().setThemePreference('dark');

  expect(usePreferences.getState().themePreference).toBe('dark');
  const stored = JSON.parse((await AsyncStorage.getItem('preferences')) ?? '{}');
  expect(stored).toMatchObject({ state: { themePreference: 'dark' } });
  expect(stored.state).not.toHaveProperty('hydrated');
});

it('marks the store hydrated even when storage fails, so the app can start', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.mocked(AsyncStorage.getItem).mockRejectedValueOnce(new Error('disk error'));
  usePreferences.setState({ hydrated: false });

  await usePreferences.persist.rehydrate();

  expect(usePreferences.getState().hydrated).toBe(true);
  expect(usePreferences.getState().themePreference).toBe('system');
  expect(warn).toHaveBeenCalled();
  warn.mockRestore();
});
