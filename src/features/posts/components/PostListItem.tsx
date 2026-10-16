import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components';
import { useAppTheme } from '@/theme';

import type { Post } from '../api';

type Props = {
  post: Post;
  onPress: (post: Post) => void;
};

export function PostListItem({ post, onPress }: Props) {
  const { colors, spacing } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(post)}
      style={({ pressed }) => [
        styles.row,
        {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          borderBottomColor: colors.border,
          backgroundColor: pressed ? colors.surface : colors.background,
          gap: spacing.xs,
        },
      ]}
    >
      <AppText variant="heading" numberOfLines={2}>
        {post.title}
      </AppText>
      <AppText muted numberOfLines={2}>
        {post.body}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { borderBottomWidth: StyleSheet.hairlineWidth },
});
