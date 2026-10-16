import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.center} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { spacing } = useAppTheme();
  return (
    <View style={[styles.center, { gap: spacing.md, padding: spacing.lg }]}>
      <AppText variant="heading" accessibilityRole="alert" style={styles.text}>
        {message}
      </AppText>
      {onRetry ? <Button title="Try again" onPress={onRetry} /> : null}
    </View>
  );
}

export function EmptyState({ message }: { message: string }) {
  const { spacing } = useAppTheme();
  return (
    <View style={[styles.center, { padding: spacing.lg }]}>
      <AppText muted style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { textAlign: 'center' },
});
