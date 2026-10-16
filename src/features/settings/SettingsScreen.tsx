import Constants from 'expo-constants';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Screen } from '@/components';
import { usePreferences, type ThemePreference } from '@/state/preferences';
import { useAppTheme } from '@/theme';

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function SettingsScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const themePreference = usePreferences((state) => state.themePreference);
  const setThemePreference = usePreferences((state) => state.setThemePreference);

  const version = Constants.expoConfig?.version ?? 'unknown';
  const variant = String(Constants.expoConfig?.extra?.variant ?? 'unknown');

  return (
    <Screen style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.sm }}>
        <AppText variant="heading">Appearance</AppText>
        <View
          accessibilityRole="radiogroup"
          style={[styles.segmented, { borderColor: colors.border, borderRadius: radius.md }]}
        >
          {OPTIONS.map((option) => {
            const selected = option.value === themePreference;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setThemePreference(option.value)}
                style={[
                  styles.segment,
                  { padding: spacing.sm + 4 },
                  selected && { backgroundColor: colors.primary },
                ]}
              >
                <AppText style={selected ? { color: colors.onPrimary } : undefined}>
                  {option.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: spacing.xs }}>
        <AppText variant="heading">About</AppText>
        <AppText muted>
          Version {version} ({variant})
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segmented: { flexDirection: 'row', borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  segment: { flex: 1, alignItems: 'center' },
});
