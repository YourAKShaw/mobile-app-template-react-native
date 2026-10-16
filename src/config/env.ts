import { z } from 'zod';

/**
 * Runtime configuration read from EXPO_PUBLIC_* variables.
 *
 * Expo inlines these at build time and only when accessed as a literal
 * `process.env.EXPO_PUBLIC_NAME`, so list every variable explicitly below.
 * Values end up in the shipped bundle: never put secrets here.
 */
const envSchema = z.object({
  EXPO_PUBLIC_API_BASE_URL: z.url({ protocol: /^https?$/ }),
});

const parsed = envSchema.safeParse({
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment configuration. Copy .env.example to .env and set the values.\n${z.prettifyError(parsed.error)}`,
  );
}

export const env = {
  apiBaseUrl: parsed.data.EXPO_PUBLIC_API_BASE_URL.replace(/\/+$/, ''),
} as const;
