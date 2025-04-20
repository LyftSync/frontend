//
// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';
//
// const useMapStore = create(
//   persist(
//     (set) => ({
//       origin: null,
//       destination: null,
//
//       setOrigin: (latitude, longitude) => set({ origin: { latitude, longitude } }),
//       setDestination: (latitude, longitude) => set({ destination: { latitude, longitude } }),
//       resetLocations: () => set({ origin: null, destination: null }),
//     }),
//     {
//       name: 'mapStore', 
//       storage: createJSONStorage(() => AsyncStorage),
// 		}
//   )
// );
//
// export default useMapStore;
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useMapStore = create(
  persist(
    (set) => ({
      origin: null,
      destination: null,

      setOrigin: (origin) =>
        set({
          origin: origin?.location?.lat && origin?.location?.lng
            ? {
                location: {
                  lat: origin.location.lat,
                  lng: origin.location.lng,
                },
                description: origin.description || '',
              }
            : null,
        }),
      setDestination: (destination) =>
        set({
          destination: destination?.location?.lat && destination?.location?.lng
            ? {
                location: {
                  lat: destination.location.lat,
                  lng: destination.location.lng,
                },
                description: destination.description || '',
              }
            : null,
        }),
      resetLocations: () => set({ origin: null, destination: null }),
    }),
    {
      name: 'mapStore',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useMapStore;
