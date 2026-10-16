import { Link, Stack } from 'expo-router';

import { AppText, Screen } from '@/components';
import { useAppTheme } from '@/theme';

export default function NotFoundRoute() {
  const { colors, spacing } = useAppTheme();
  return (
    <Screen style={{ alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
      <Stack.Screen options={{ title: 'Not found' }} />
      <AppText variant="heading">This screen does not exist.</AppText>
      <Link href="/" style={{ color: colors.primary }}>
        Go to home
      </Link>
    </Screen>
  );
}
