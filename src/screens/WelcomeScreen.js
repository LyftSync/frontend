import React from "react";
import { View, Text, StyleSheet, Button, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleRegisterPress = () => {
    navigation.navigate("Register");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to LyftSync</Text>
        <Text style={styles.subtitle}>
          Your Reliable Ride Sharing Companion
        </Text>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button title="Login" onPress={handleLoginPress} color="#007AFF" />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Register"
              onPress={handleRegisterPress}
              color="#4CD964"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 50,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  buttonWrapper: {
    marginVertical: 10,
    width: "80%",
    alignSelf: "center",
  },
});
