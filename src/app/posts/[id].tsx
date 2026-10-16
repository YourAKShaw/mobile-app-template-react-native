import { useLocalSearchParams } from 'expo-router';

import { ErrorState } from '@/components';
import { parsePostId, PostDetailScreen } from '@/features/posts/PostDetailScreen';

export default function PostDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = parsePostId(id);
  if (postId === null) return <ErrorState message="Not found." />;
  return <PostDetailScreen id={postId} />;
}
