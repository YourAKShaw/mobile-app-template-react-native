import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';

import { AppText, ErrorState, LoadingState, Screen } from '@/components';
import { toUserMessage } from '@/lib/api/errors';
import { useAppTheme } from '@/theme';

import { usePost } from './queries';

/** Route params are untrusted strings; parse before use. */
export function parsePostId(raw: string | string[] | undefined): number | null {
  if (typeof raw !== 'string' || !/^[1-9]\d{0,9}$/.test(raw)) return null;
  return Number(raw);
}

export function PostDetailScreen({ id }: { id: number }) {
  const { spacing } = useAppTheme();
  const { data, error, isPending, refetch } = usePost(id);

  if (isPending) return <LoadingState />;
  if (error) return <ErrorState message={toUserMessage(error)} onRetry={() => void refetch()} />;

  return (
    <Screen padded={false}>
      <Stack.Screen options={{ title: `Post ${data.id}` }} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        <AppText variant="title">{data.title}</AppText>
        <AppText>{data.body}</AppText>
      </ScrollView>
    </Screen>
  );
}
