export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'parse';

/** The single error type thrown by the API client. Messages are safe to log; they contain no response bodies. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | undefined;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

/** Maps any thrown value to a short message suitable for showing to users. */
export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case 'network':
        return 'Could not reach the server. Check your connection and try again.';
      case 'timeout':
        return 'The server took too long to respond. Try again.';
      case 'http':
        return error.status === 404
          ? 'Not found.'
          : 'The server returned an error. Try again later.';
      case 'parse':
        return 'The server sent an unexpected response.';
    }
  }
  return 'Something went wrong. Try again.';
}
