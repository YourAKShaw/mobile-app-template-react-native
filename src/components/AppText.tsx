import { Text, type TextProps } from 'react-native';

import { useAppTheme, type TypographyVariant } from '@/theme';

type Props = TextProps & {
  variant?: TypographyVariant;
  muted?: boolean;
};

export function AppText({ variant = 'body', muted = false, style, ...rest }: Props) {
  const { colors, typography } = useAppTheme();
  return (
    <Text
      style={[typography[variant], { color: muted ? colors.textMuted : colors.text }, style]}
      {...rest}
    />
  );
}
