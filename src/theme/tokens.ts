/**
 * Design tokens. Replace the palette with your brand colors; keep the keys so
 * components do not need to change. Light and dark must define the same keys.
 */
const light = {
  background: '#FFFFFF',
  surface: '#F2F4F7',
  text: '#101828',
  textMuted: '#475467',
  primary: '#1E3A5F',
  onPrimary: '#FFFFFF',
  border: '#D0D5DD',
  danger: '#B42318',
};

const dark: typeof light = {
  background: '#0C111D',
  surface: '#1D2939',
  text: '#F2F4F7',
  textMuted: '#98A2B3',
  primary: '#84ADDB',
  onPrimary: '#0C111D',
  border: '#344054',
  danger: '#F97066',
};

export const palettes = { light, dark };

export type ColorScheme = keyof typeof palettes;
export type Colors = typeof light;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { sm: 6, md: 10, lg: 16 } as const;

export const typography = {
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
} as const;

export type TypographyVariant = keyof typeof typography;
