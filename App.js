import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import 'react-native-get-random-values';
import ErrorBoundary from "./src/components/ErrorBoundary";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="default" />

        <ErrorBoundary>
          <AppNavigator />
        </ErrorBoundary>

        <FlashMessage position="top" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
