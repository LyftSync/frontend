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
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "LyftSync needs your location to set it as the trip origin or to find nearby places."
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/circlelogo.png",
        backgroundColor: "#ffffff"
      },
      package: "com.cat.lyftsync",
      permissions: [
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      favicon: "./assets/images/circlelogo.png"
    },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    },
    plugins: [
      "expo-location"
    ]
  }
};
