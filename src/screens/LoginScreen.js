import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import useAuthStore from "../stores/authStore";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, loading } = useAuthStore();
  // console.log("LoginScreen loading state:", loading); // Keep for debugging

  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const userIdentifierInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleLoginPress = async () => {
    setLocalError("");
    if (!userIdentifier || !password) {
      setLocalError("Please enter both identifier and password.");
      return;
    }

    const loginSuccess = await login({
      "emailOrPhone": userIdentifier, // Corrected: key is a string
      password,
    });

    if (loginSuccess) {
      console.log("Login successful! Auth state updated.");
      // Successful login should trigger isAuthenticated to true,
      // which AppNavigator will use to switch to the main app.
    } else {
      console.log("Login failed (flash message should be visible).");
      // The authStore's showMessage should handle error display.
      // You could set localError here if you want more specific local feedback too.
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // "height" can sometimes work better
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled" // Helps with taps inside ScrollView
      >
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            ref={userIdentifierInputRef}
            style={styles.input}
            placeholder="Email or Phone number"
            value={userIdentifier}
            onChangeText={setUserIdentifier}
            keyboardType="default"
            autoCapitalize="none"
            editable={!loading}
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            blurOnSubmit={false}
          />
          <TextInput
            ref={passwordInputRef}
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleLoginPress}
          />

          {localError ? (
            <Text style={styles.errorText}>{localError}</Text>
          ) : null}

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loader}
            />
          ) : (
            <Button
              title="Login"
              onPress={handleLoginPress}
              disabled={loading}
            />
          )}

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("Register")}
            disabled={loading}
          >
            <Text style={styles.linkText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    // flex: 1, // Remove if scrollContainer is handling flexGrow
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  loader: {
    marginVertical: 20,
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
