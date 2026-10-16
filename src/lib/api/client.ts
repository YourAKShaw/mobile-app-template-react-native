import type { z } from 'zod';

import { env } from '@/config/env';

import { ApiError } from './errors';

const DEFAULT_TIMEOUT_MS = 15_000;

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  /** Pass the signal TanStack Query provides so cancelled queries abort the request. */
  signal?: AbortSignal;
  timeoutMs?: number;
};

/**
 * Sends a JSON request to the configured API and validates the response with `schema`.
 *
 * Throws ApiError for network failure, timeout, non-2xx status, or a response that
 * does not match the schema. Add authentication headers here once you pick an auth
 * provider (see README "Decision points").
 */
export async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onCallerAbort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', onCallerAbort);

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (cause) {
    if (timedOut) {
      throw new ApiError('timeout', `${method} ${path} timed out after ${timeoutMs}ms`);
    }
    if (signal?.aborted) {
      throw cause; // Caller cancelled; let TanStack Query handle it.
    }
    throw new ApiError('network', `${method} ${path} failed: network error`);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onCallerAbort);
  }

  if (!response.ok) {
    throw new ApiError('http', `${method} ${path} returned ${response.status}`, response.status);
  }

  if (response.status === 204) {
    return parseOrThrow(schema, undefined, method, path);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new ApiError('parse', `${method} ${path} returned invalid JSON`);
  }
  return parseOrThrow(schema, json, method, path);
}

function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, method: string, path: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError('parse', `${method} ${path} response did not match schema`);
  }
  return result.data;
}
