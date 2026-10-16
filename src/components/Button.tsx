import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useAppTheme } from '@/theme';

import { AppText } from './AppText';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: 'primary' | 'secondary';
};

export function Button({ title, variant = 'primary', disabled, ...rest }: Props) {
  const { colors, spacing, radius } = useAppTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          paddingVertical: spacing.sm + 4,
          paddingHorizontal: spacing.md,
          borderRadius: radius.md,
          backgroundColor: isPrimary ? colors.primary : colors.surface,
          borderColor: colors.border,
          borderWidth: isPrimary ? 0 : StyleSheet.hairlineWidth,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
      {...rest}
    >
      <AppText
        variant="heading"
        style={{ color: isPrimary ? colors.onPrimary : colors.text, fontSize: 16 }}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', minHeight: 44 },
});
