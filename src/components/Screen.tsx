import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/theme';

type Props = {
  children: ReactNode;
  /** Adds standard horizontal/vertical padding. Disable for edge-to-edge lists. */
  padded?: boolean;
  style?: ViewStyle;
};

/**
 * Root container for every screen. Headers from the navigator handle the top inset;
 * the tab bar handles the bottom inset.
 */
export function Screen({ children, padded = true, style }: Props) {
  const { colors, spacing } = useAppTheme();
  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background },
        padded && { padding: spacing.md },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
