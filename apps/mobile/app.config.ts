import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'AmakaSole',
  slug: 'amakasole',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1A1A2E',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.amakasole.app',
    usesAppleSignIn: true,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1A1A2E',
    },
    package: 'com.amakasole.app',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-camera',
      {
        cameraPermission: 'Allow AmakaSole to access your camera for foot scanning.',
      },
    ],
  ],
  extra: {
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    eas: {
      projectId: 'your-project-id',
    },
  },
  scheme: 'amakasole',
});
