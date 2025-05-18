import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "../utils/api";
import { showMessage } from "react-native-flash-message";

const useAuthStore = create(
  persist(
    (set, get) => {
      const withLoading = async (fn, loadingKey = "loading") => {
        set({ [loadingKey]: true });
        try {
          const result = await fn();
          return result;
        } catch (err) {
          showMessage({
            message: err.message || "An error occurred",
            type: "danger",
          });
          return false;
        } finally {
          set({ [loadingKey]: false });
        }
      };

      return {
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,

        login: async (credentials) => {
          return withLoading(async () => {
            const response = await apiRequest(
              "/api/auth/login",
              "POST",
              credentials,
              false,
            );

            if (!response || !response.token) {
              throw new Error(response?.message || "Login failed");
            }

            const { token, ...userData } = response;
            set({
              token: token,
              user: userData || null,
              isAuthenticated: true,
            });

            showMessage({ message: "Login successful!", type: "success" });
            return true;
          }, "loading");
        },

        register: async (userData) => {
          return withLoading(async () => {
            const response = await apiRequest(
              "/api/auth/register",
              "POST",
              userData,
              false,
            );

            if (!response) {
              throw new Error("Registration failed");
            }

            showMessage({
              message: "Registration successful! Please login.",
              type: "success",
            });
            return true;
          }, "loading");
        },

        fetchUser: async () => {
          return withLoading(async () => {
            const token = get().token;
            if (!token) {
              throw new Error("No authentication token found");
            }

            const userData = await apiRequest(
              "/api/auth/me",
              "GET",
              null,
              true,
            );
            if (!userData) {
              throw new Error("Failed to fetch user data");
            }

            set({ user: userData, isAuthenticated: true });
            return true;
          }, "loading");
        },

        logout: async () => {
          return withLoading(async () => {
            set({ token: null, user: null, isAuthenticated: false });
            showMessage({ message: "Logged out successfully", type: "info" });
            return true;
          }, "loading");
        },

        // Helper to handle unauthorized responses (call this when you get 401)
        handleUnauthorized: () => {
          set({ token: null, user: null, isAuthenticated: false });
          showMessage({
            message: "Session expired. Please login again.",
            type: "danger",
          });
        },
      };
    },
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to rehydrate auth store:", error);
        } else if (state) {
          state.isAuthenticated = !!state.token;
        }
      },
    },
  ),
);

export default useAuthStore;
