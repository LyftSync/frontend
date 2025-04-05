import { create } from "zustand";
import { apiRequest } from "../utils/api";
import { showMessage } from "react-native-flash-message";

const withLoading = async (set, fn, loadingKey, errorKey) => {
  set({ [loadingKey]: true, [errorKey]: null });
  try {
    const result = await fn();
    set({ [loadingKey]: false });
    return result;
  } catch (err) {
    const errorMessage = err.message || "An error occurred";
    set({ [loadingKey]: false, [errorKey]: errorMessage });
    showMessage({
      message: "Operation Failed",
      description: errorMessage,
      type: "danger",
    });
    return false;
  }
};

const useRideStore = create((set, get) => ({
  isRequestingRide: false,
  rideDetails: null,
  rideError: null,
  currentRequestRoute: [],

  isOfferingRide: false,
  offerDetails: null,
  offerError: null,
  currentOfferRoute: [],

  requestRide: async (selectedPoints) => {
    if (selectedPoints.length < 2) {
      showMessage({
        message: "Please select pickup and dropoff points.",
        type: "warning",
      });
      return false;
    }

    return withLoading(
      set,
      async () => {
        const routeData = {
          points: selectedPoints.map((p) => ({
            latitude: p.latitude,
            longitude: p.longitude,
            name: p.name || null,
          })),
          startTime: new Date().toISOString(),
        };

        set({ currentRequestRoute: selectedPoints });

        const response = await apiRequest(
          "/api/rides/request",
          "POST",
          routeData,
          true,
        );

        console.log("Ride request response:", response);

        if (
          response &&
          (response.success ||
            response.message?.includes("requested successfully"))
        ) {
          showMessage({
            message: "Ride requested!",
            description: "Searching for nearby drivers...",
            type: "success",
          });
          set({
            rideDetails: {
              status: "SEARCHING",
              requestId: response.rideId,
              ...(response.details || {}),
            },
          });
          return true;
        } else {
          throw new Error(
            response?.message || "Backend did not confirm ride request.",
          );
        }
      },
      "isRequestingRide",
      "rideError",
    );
  },

  offerRide: async (selectedPoints, route) => {
    if (selectedPoints.length < 2) {
      showMessage({
        message: "Please define your route (start and end).",
        type: "warning",
      });
      return false;
    }

    return withLoading(
      set,
      async () => {
        const routeData = {
          selectedPoints,
          departureTime: new Date().toISOString(),
          route,
        };

        set({ currentOfferRoute: selectedPoints });

        const response = await apiRequest(
          "/api/rides",
          "POST",
          routeData,
          true,
        );

        console.log("Ride offer response:", response);

        if (
          response &&
          (response.success || response.message?.includes("Offer created"))
        ) {
          showMessage({
            message: "Ride offered!",
            description: "Waiting for rider requests...",
            type: "success",
          });
          set({
            offerDetails: {
              status: "ACTIVE",
              offerId: response.offerId,
              ...(response.details || {}),
            },
          });
          return true;
        } else {
          throw new Error(
            response?.message || "Backend did not confirm ride offer.",
          );
        }
      },
      "isOfferingRide",
      "offerError",
    );
  },

  clearRideState: () => {
    set({
      isRequestingRide: false,
      rideDetails: null,
      rideError: null,
      currentRequestRoute: [],
      isOfferingRide: false,
      offerDetails: null,
      offerError: null,
      currentOfferRoute: [],
    });
  },
}));

export default useRideStore;
