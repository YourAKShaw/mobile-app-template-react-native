import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Project identity. Every value here is a PLACEHOLDER.
 * Change them with `npm run rename -- ...` (see README "Rename checklist"),
 * not by hand, so package.json and docs stay in sync.
 */
const APP = {
  name: 'TemplateApp',
  slug: 'template-app',
  scheme: 'templateapp',
  iosBundleIdentifier: 'com.example.templateapp',
  androidPackage: 'com.example.templateapp',
  // EAS project ID, filled in by `npx eas-cli@latest init`. Leave empty until then.
  easProjectId: '',
  // Expo account that owns the EAS project. Leave empty until then.
  owner: '',
};

/** Brand colors used by native launch artwork. Replace with your own. */
const SPLASH_BACKGROUND = '#1E3A5F';
const ADAPTIVE_ICON_BACKGROUND = '#1E3A5F';

type Variant = 'development' | 'preview' | 'production';

function readVariant(): Variant {
  const value = process.env.APP_VARIANT ?? 'development';
  if (value === 'development' || value === 'preview' || value === 'production') {
    return value;
  }
  throw new Error(`APP_VARIANT must be development, preview or production. Received "${value}".`);
}

const variant = readVariant();

// Non-production variants get a suffixed identifier so they install side by side.
const idSuffix =
  variant === 'production' ? '' : `.${variant === 'development' ? 'dev' : 'preview'}`;
const nameSuffix =
  variant === 'production' ? '' : variant === 'development' ? ' (Dev)' : ' (Preview)';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: `${APP.name}${nameSuffix}`,
  slug: APP.slug,
  scheme: APP.scheme,
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  icon: './assets/images/icon.png',
  ios: {
    bundleIdentifier: `${APP.iosBundleIdentifier}${idSuffix}`,
    supportsTablet: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: `${APP.androidPackage}${idSuffix}`,
    adaptiveIcon: {
      foregroundImage: './assets/images/android-icon-foreground.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
      backgroundColor: ADAPTIVE_ICON_BACKGROUND,
    },
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: SPLASH_BACKGROUND,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  ...(APP.owner ? { owner: APP.owner } : {}),
  extra: {
    variant,
    ...(APP.easProjectId ? { eas: { projectId: APP.easProjectId } } : {}),
  },
});
