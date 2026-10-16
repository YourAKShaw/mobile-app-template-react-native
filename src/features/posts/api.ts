import { z } from 'zod';

import { request } from '@/lib/api/client';

// Example feature backed by the public JSONPlaceholder demo API.
// Replace the schema and paths with your backend's contract.
export const postSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  title: z.string(),
  body: z.string(),
});

export type Post = z.infer<typeof postSchema>;

export function fetchPosts(signal?: AbortSignal): Promise<Post[]> {
  return request('/posts', z.array(postSchema), { signal });
}

export function fetchPost(id: number, signal?: AbortSignal): Promise<Post> {
  return request(`/posts/${id}`, postSchema, { signal });
}
