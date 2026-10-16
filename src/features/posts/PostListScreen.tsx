import { router } from 'expo-router';
import { FlatList, RefreshControl } from 'react-native';

import { EmptyState, ErrorState, LoadingState, Screen } from '@/components';
import { toUserMessage } from '@/lib/api/errors';
import { useAppTheme } from '@/theme';

import type { Post } from './api';
import { PostListItem } from './components/PostListItem';
import { usePosts } from './queries';

export function PostListScreen() {
  const { colors } = useAppTheme();
  const { data, error, isPending, isRefetching, refetch } = usePosts();

  const openPost = (post: Post) =>
    router.push({ pathname: '/posts/[id]', params: { id: String(post.id) } });

  if (isPending) return <LoadingState />;
  if (error) return <ErrorState message={toUserMessage(error)} onRetry={() => void refetch()} />;

  return (
    <Screen padded={false}>
      <FlatList
        data={data}
        keyExtractor={(post) => String(post.id)}
        renderItem={({ item }) => <PostListItem post={item} onPress={openPost} />}
        ListEmptyComponent={<EmptyState message="No posts yet." />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            tintColor={colors.primary}
          />
        }
      />
    </Screen>
  );
}
