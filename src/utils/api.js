import useAuthStore from "../stores/authStore";
import { showMessage } from "react-native-flash-message";
import { Alert } from "react-native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    "FATAL ERROR: you human always so forgetful, check the env fag",
  );
  Alert.alert(
    "Application Configuration Error",
    "API Base URL is missing. The app cannot function correctly. Please check the setup.",
  );
}

const handleApiResponse = async (response) => {
  const data = await response.json().catch(() => ({
    success: false,
    message: `HTTP error! Status: ${response.status} (${response.url})`,
  }));

  if (response.status === 500) {
    console.error("Internal server error:", {
      url: response.url,
      status: response.status,
      message: data.message || "Unknown server error",
    });
    throw new Error("Internal Server Error");
  }

  if (response.status === 401) {
    console.warn("API request received 401 Unauthorized. Triggering logout.");
    useAuthStore.getState().handleUnauthorized(); // Trigger logout and message
    throw new Error(data.message || "Unauthorized - Session may have expired.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed unexpectedly.");
  }

  return data;
};

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  requiresAuth = true,
) => {
  const { token } = useAuthStore.getState();
  const url = endpoint.startsWith("/api")
    ? `${API_BASE_URL}${endpoint.slice(4)}`
    : endpoint;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (requiresAuth) {
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn(
        `Attempted authenticated API request to ${endpoint} without a token.`,
      );
    }
  }

  const config = {
    method: method.toUpperCase(),
    headers: headers,
  };

  if (body && ["POST", "PUT", "PATCH", "DELETE"].includes(config.method)) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await handleApiResponse(response);
    return data;
  } catch (err) {
    console.error("API request failed:", { url, method, error: err.message });
    if (
      err.message !== "Unauthorized - Session may have expired." &&
      !err.message.startsWith("HTTP error! Status:")
    ) {
      showMessage({
        message: "Request failed!",
        description:
          err.message ||
          "Could not connect to the server or process the request.",
        type: "danger",
        duration: 4000,
      });
    }
    throw err;
  }
};
