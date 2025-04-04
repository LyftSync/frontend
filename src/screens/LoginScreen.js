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

    let identifierType = "username";
    if (userIdentifier.includes("@")) {
      identifierType = "email";
    } else if (/^\d+$/.test(userIdentifier)) {
      identifierType = "phoneNumber";
    }

    const loginSuccess = await login({
      [identifierType]: userIdentifier,
      password,
    });

    if (loginSuccess) {
      console.log("Login successful! Auth state updated.");
    } else {
      console.log("Login failed (flash message should be visible).");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
