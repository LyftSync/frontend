import "dotenv/config";

export default {
  expo: {
    name: "LyftSync",
    slug: "lyftsync",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.yuja.lyftsync",
    },
    web: { favicon: "./assets/favicon.png" },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    },
  },
};
