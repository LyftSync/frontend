import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  ScrollView,
} from "react-native";
import { apiRequest } from "../utils/api";
import { showMessage } from "react-native-flash-message";
import useAuthStore from "../stores/authStore";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await apiRequest("/api", "GET", null, true);
      setData(response);
      showMessage({
        message: "Data fetched successfully!",
        type: "success",
        duration: 1500,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      showMessage({
        message: err.message || "Failed to fetch data",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Home</Text>
      {user && (
        <Text style={styles.welcome}>Welcome, {user.fullName || "User"}!</Text>
      )}

      <Button title="Refresh Data" onPress={fetchData} disabled={isLoading} />

      {isLoading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}

      {error && !isLoading && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Error:</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {data && !isLoading && !error && (
        <View style={styles.dataBox}>
          <Text style={styles.dataTitle}>Backend Response:</Text>
          <Text style={styles.dataContent}>
            {JSON.stringify(data, null, 2)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  welcome: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
  },
  loader: {
    marginVertical: 30,
  },
  errorBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e57373",
    width: "90%",
    alignItems: "center",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
    textAlign: "center",
  },
  dataBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#a5d6a7",
    width: "90%",
  },
  dataTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2e7d32",
  },
  dataContent: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#333",
  },
});
