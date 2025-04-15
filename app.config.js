import "dotenv/config";

export default {
  expo: {
    name: "LyftSync",
    slug: "lyftsync",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./assets/images/circlelogo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/circlelogo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/circlelogo.png",
        backgroundColor: "#ffffff",
      },
      package: "com.cat.lyftsync",
    },
    web: { favicon: "./assets/images/circlelogo.png" },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    },
  },
};
