import { z } from 'zod';

import { jsonResponse } from '@/test/render';

import { request } from '../client';
import { ApiError } from '../errors';

const schema = z.object({ id: z.number() });
const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  jest.useRealTimers();
});

it('returns parsed data and calls the configured base URL', async () => {
  fetchMock.mockResolvedValue(jsonResponse({ id: 1 }));

  await expect(request('/things/1', schema)).resolves.toEqual({ id: 1 });
  expect(fetchMock).toHaveBeenCalledWith(
    'https://api.test.invalid/things/1',
    expect.objectContaining({ method: 'GET' }),
  );
});

it('serializes a JSON body and sets Content-Type', async () => {
  fetchMock.mockResolvedValue(jsonResponse({ id: 2 }, 201));

  await request('/things', schema, { method: 'POST', body: { name: 'a' } });

  const init = fetchMock.mock.calls[0]?.[1];
  expect(init?.body).toBe('{"name":"a"}');
  expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
});

it('throws an http ApiError with the status for non-2xx responses', async () => {
  fetchMock.mockResolvedValue(jsonResponse({ message: 'nope' }, 404));

  await expect(request('/things/9', schema)).rejects.toMatchObject({
    name: 'ApiError',
    kind: 'http',
    status: 404,
  });
});

it('throws a parse ApiError when the response does not match the schema', async () => {
  fetchMock.mockResolvedValue(jsonResponse({ id: 'not-a-number' }));

  await expect(request('/things/1', schema)).rejects.toMatchObject({ kind: 'parse' });
});

it('throws a network ApiError when fetch rejects', async () => {
  fetchMock.mockRejectedValue(new TypeError('Network request failed'));

  const error = await request('/things/1', schema).catch((e: unknown) => e);
  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({ kind: 'network' });
});

it('aborts and throws a timeout ApiError when the server is too slow', async () => {
  jest.useFakeTimers();
  fetchMock.mockImplementation(
    (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
      }),
  );

  const pending = request('/slow', schema, { timeoutMs: 1_000 });
  jest.advanceTimersByTime(1_000);

  await expect(pending).rejects.toMatchObject({ kind: 'timeout' });
});
