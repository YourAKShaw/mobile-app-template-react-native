import { useQuery } from '@tanstack/react-query';

import { fetchPost, fetchPosts } from './api';

export const postKeys = {
  all: ['posts'] as const,
  detail: (id: number) => ['posts', id] as const,
};

export function usePosts() {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: ({ signal }) => fetchPosts(signal),
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: ({ signal }) => fetchPost(id, signal),
  });
}
