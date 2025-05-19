import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useMapStore = create(
  persist(
    (set) => ({
      origin: null,
      destination: null,
      setOrigin: (originData) =>
        set({
          origin: originData
            ? {
                location: originData.location,
                description: originData.description,
              }
            : null,
        }),
      setDestination: (destinationData) =>
        set({
          destination: destinationData
            ? {
                location: destinationData.location,
                description: destinationData.description,
              }
            : null,
        }),
      resetLocations: () => set({ origin: null, destination: null }),
    }),
    {
      name: 'mapStore',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating mapStore:', error);
          // Reset state to prevent crashes
          return {
            origin: null,
            destination: null,
          };
        }
      },
    }
  )
);

export default useMapStore;
