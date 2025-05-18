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

export default function HomeScreen() {
  const [apiStatus, setApiStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated, logout } = useAuthStore();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setApiStatus(null);

    try {
      const response = await fetch(process.env.EXPO_PUBLIC_API_BASE_URL, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setApiStatus(responseData.message);
    } catch (err) {
      setError(`Failed to fetch data. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFetchUser = async () => {
    setIsFetchingUser(true);
    await useAuthStore.getState().fetchUser(); // fetchUser in store now handles its own loading and messages
    setIsFetchingUser(false);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    logout();
    setApiStatus(null);
  };

  let content;
  if (isLoading) {
    content = <ActivityIndicator size="large" color="#0000ff" />;
  } else if (error) {
    content = <Text style={styles.errorText}>{error}</Text>;
  } else if (apiStatus) {
    content = (
      <>
        <Text style={styles.successText}>API Status:</Text>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.dataText}>{apiStatus}</Text>
        </ScrollView>
      </>
    );
  } else {
    content = <Text>No API status loaded yet.</Text>;
  }

  const user = useAuthStore((state) => state.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.authStatus}>
        Authentication Status: {isAuthenticated ? "Logged In" : "Logged Out"}
      </Text>

      {isAuthenticated && user && (
        <View style={styles.userInfoBox}>
          <Text style={styles.userInfoTitle}>User Info (from Store):</Text>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Role: {user.role}</Text>
          {isFetchingUser && <ActivityIndicator size="small" color="#007bff" />}
          <Button
            title="Refresh User Data"
            onPress={handleFetchUser}
            disabled={isFetchingUser}
          />
        </View>
      )}

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
    borderColor: "#ddd",
    padding: 15,
    width: "100%",
    minHeight: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  userInfoBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    width: "100%",
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 5,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
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
    maxHeight: 100,
  },
});
