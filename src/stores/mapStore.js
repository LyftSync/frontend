
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useMapStore = create(
  persist(
    (set) => ({
      origin: null,
      destination: null,

      setOrigin: (latitude, longitude) => set({ origin: { latitude, longitude } }),
      setDestination: (latitude, longitude) => set({ destination: { latitude, longitude } }),
      resetLocations: () => set({ origin: null, destination: null }),
    }),
    {
      name: 'mapStore', 
      storage: createJSONStorage(() => AsyncStorage),
		}
  )
);

export default useMapStore;
