import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppProviders } from '@/providers/AppProviders';
import { usePreferences } from '@/state/preferences';
import { useAppTheme } from '@/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrated = usePreferences((state) => state.hydrated);

  useEffect(() => {
    if (hydrated) void SplashScreen.hideAsync();
  }, [hydrated]);

  // Keep the native splash visible until persisted preferences are loaded,
  // so the first frame uses the correct theme.
  if (!hydrated) return null;

  return (
    <AppProviders>
      <ThemedNavigation />
    </AppProviders>
  );
}

function ThemedNavigation() {
  const { scheme, colors } = useAppTheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="posts/[id]" options={{ title: 'Post' }} />
      </Stack>
    </ThemeProvider>
  );
}
