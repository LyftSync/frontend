import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.message}>
            We encountered an error rendering this part of the app.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.details}>{this.state.error.toString()}</Text>
          )}
          <Button title="Try Again" onPress={this.resetError} color="#FF6347" />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D8000C",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  details: {
    fontSize: 12,
    color: "#555",
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "monospace",
  },
});

export default ErrorBoundary;
