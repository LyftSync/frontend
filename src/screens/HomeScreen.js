import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
  ScrollView,
} from "react-native";
import useAuthStore from "../stores/authStore";
import { showMessage } from "react-native-flash-message";

export default function HomeScreen() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated, logout } = useAuthStore();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(process.env.EXPO_PUBLIC_API_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData.message);
    } catch (err) {
      setError(`Failed to fetch data. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    logout();
    setData(null);
    showMessage({ message: "Logged Out", type: "info" });
  };

  let content;
  if (isLoading) {
    content = <ActivityIndicator size="large" color="#0000ff" />;
  } else if (error) {
    content = <Text style={styles.errorText}>{error}</Text>;
  } else if (data) {
    content = (
      <>
        <Text style={styles.successText}>Data from Backend:</Text>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.dataText}>{JSON.stringify(data, null, 2)}</Text>
        </ScrollView>
      </>
    );
  } else {
    content = <Text>No data loaded yet.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.authStatus}>
        Authentication Status: {isAuthenticated ? "Logged In" : "Logged Out"}
      </Text>

      <View style={styles.contentBox}>{content}</View>

      <View style={styles.buttonContainer}>
        <Button title="Reload Data" onPress={fetchData} disabled={isLoading} />
        {isAuthenticated && (
          <Button title="Logout" onPress={handleLogout} color="red" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  authStatus: {
    fontSize: 16,
    marginBottom: 20,
    fontStyle: "italic",
  },
  contentBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    width: "100%",
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  successText: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  dataText: {
    fontFamily: "monospace",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  scrollView: {
    width: "100%",
  },
});
