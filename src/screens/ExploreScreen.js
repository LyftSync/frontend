import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  TouchableOpacity
} from "react-native";
import MapView, { Marker, Polyline, UrlTile, Callout } from "react-native-maps";
import * as Location from "expo-location";
import polylineDecoder from "@mapbox/polyline";
import useRideStore from "../stores/rideStore";
import { debounce } from 'lodash';
import { showMessage } from "react-native-flash-message";
import Ionicons from '@expo/vector-icons/Ionicons';

import ExploreSearchBar from '../components/explore/ExploreSearchBar';
import SearchResultsList from '../components/explore/SearchResultsList';
import RoutePointsDisplay from '../components/explore/RoutePointsDisplay';
import RideRequestButton from '../components/explore/RideRequestButton';
import DrivingModeButton from '../components/explore/DrivingModeButton';
import MapStatusIndicator from '../components/explore/MapStatusIndicator';

const OSRM_API_BASE = "http://router.project-osrm.org/route/v1/driving";
const NOMINATIM_API_BASE = "https://nominatim.openstreetmap.org";
const NOMINATIM_USER_AGENT = "LyftSync/0.1.0 (your-real-email@example.com)"; // actually yeah
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function ExploreScreen() {
  const [mode, setMode] = useState('HIKER');

  const {
      requestRide, isRequestingRide, rideError,
      offerRide, isOfferingRide, offerError,
      clearRideState
  } = useRideStore();

  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  const [userHeading, setUserHeading] = useState(0);
  const [initialRegion, setInitialRegion] = useState(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const [selectedPoints, setSelectedPoints] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isRouting, setIsRouting] = useState(false);
  const [routeErrorMsg, setRouteErrorMsg] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [inspectedPlaceDetails, setInspectedPlaceDetails] = useState(null);
  const [inspectedPlaceLocation, setInspectedPlaceLocation] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(0);

  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const locationSubscription = useRef(null);

    useEffect(() => {
      let isMounted = true;
      const startLocationTracking = async () => {
         setLocationLoading(true); setLocationErrorMsg(null);
         let { status } = await Location.requestForegroundPermissionsAsync();
         if (status !== 'granted') { if (isMounted) { setLocationErrorMsg("Permission denied."); setLocationLoading(false); } return; }
         try {
             let pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
             if (isMounted) {
                 const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                 const region = { ...coords, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA };
                 setCurrentUserLocation(coords); setInitialRegion(region); setUserHeading(pos.coords.heading ?? 0); setLocationLoading(false);
                 locationSubscription.current = await Location.watchPositionAsync(
                     { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 2000, distanceInterval: 5 },
                     (loc) => { if (isMounted) { const nc = { latitude: loc.coords.latitude, longitude: loc.coords.longitude }; setCurrentUserLocation(nc); setUserHeading(loc.coords.heading ?? userHeading); }}
                 );
             }
         } catch (error) { console.error("Loc Err:", error); if (isMounted) { setLocationErrorMsg("GPS Error."); setLocationLoading(false); } }
      };
      startLocationTracking();
      return () => { isMounted = false; locationSubscription.current?.remove(); };
    }, []);

    useEffect(() => {
       const fetchRoute = async (points) => {
           if (points.length < 2) { setRouteCoordinates([]); setRouteErrorMsg(null); return; }
           setIsRouting(true); setRouteErrorMsg(null);
           const coordStr = points.map(p => `${p.longitude},${p.latitude}`).join(";");
           const url = `${OSRM_API_BASE}/${coordStr}?overview=full&geometries=polyline`;
           try {
               const resp = await fetch(url); const data = await resp.json();
               if (resp.ok && data.code === "Ok" && data.routes?.length > 0) {
                   const mapCoords = polylineDecoder.decode(data.routes[0].geometry).map(p => ({ latitude: p[0], longitude: p[1] }));
                   setRouteCoordinates(mapCoords);
               } else { setRouteErrorMsg(data.message || "Route error."); setRouteCoordinates([]); }
           } catch (err) { setRouteErrorMsg(`Fetch route failed: ${err.message}`); setRouteCoordinates([]); }
           finally { setIsRouting(false); }
       };
      fetchRoute(selectedPoints);
    }, [selectedPoints]);

  const debouncedSearch = useCallback(debounce(async (query) => {
      if (!query || query.trim().length < 3) return;
      setIsSearching(true); setSearchError(null); setSearchResults([]); setShowSearchResults(true);
      const params = new URLSearchParams({ q: query, format: 'json', addressdetails: '1', limit: '10' });
      const url = `${NOMINATIM_API_BASE}/search?${params.toString()}`;
      try {
          const resp = await fetch(url, { headers: { 'User-Agent': NOMINATIM_USER_AGENT } });
          const data = await resp.json();
          if (resp.ok && Array.isArray(data)) {
              const results = data.map(item => ({ id: item.osm_id, osm_type: item.osm_type, name: item.display_name, latitude: parseFloat(item.lat), longitude: parseFloat(item.lon), address: item.address, type: item.type }));
              setSearchResults(results);
          } else { setSearchError("Search failed."); setSearchResults([]); }
      } catch (err) { setSearchError(`Search error: ${err.message}`); setSearchResults([]); }
      finally { setIsSearching(false); }
  }, 500), []);

  const handleSearchChange = (text) => {
      setSearchQuery(text);
      if (text.trim().length >= 3) { debouncedSearch(text); }
      else { debouncedSearch.cancel(); setSearchResults([]); setIsSearching(false); setSearchError(null); setShowSearchResults(text.trim().length > 0); }
  };

  const handleClearSearch = () => {
      debouncedSearch.cancel(); setSearchQuery(''); setSearchResults([]); setIsSearching(false); setSearchError(null); setShowSearchResults(false); Keyboard.dismiss();
  };

  const handleSelectSearchResult = (result) => {
      handleClearSearch(); setInspectedPlaceDetails(null); setInspectedPlaceLocation(null);
      const newPoint = { latitude: result.latitude, longitude: result.longitude, name: result.name.split(',')[0], osm_id: result.id, osm_type: result.type };
      if (selectedPoints.length >= 2) { setSelectedPoints(prev => [...prev.slice(0, 1), newPoint]); showMessage({ message: "Destination updated", type: 'info' }); }
      else { setSelectedPoints(prev => [...prev, newPoint]); showMessage({ message: `${newPoint.name} added`, type: 'info' }); }
      mapRef.current?.animateToRegion({ latitude: result.latitude, longitude: result.longitude, latitudeDelta: LATITUDE_DELTA / 2, longitudeDelta: LONGITUDE_DELTA / 2 }, 1000);
  };

  const handleMapPress = (e) => {
      const coord = e.nativeEvent.coordinate; const action = e.nativeEvent.action;
      if (showSearchResults || Keyboard.isVisible()) { handleClearSearch(); return; }
      if (action === 'marker-press' || action === 'callout-press') return;
      setInspectedPlaceDetails(null); setInspectedPlaceLocation(null);
      fetchPlaceDetails(coord.latitude, coord.longitude);
  };

   const fetchPlaceDetails = async (latitude, longitude) => {
       if (isFetchingDetails) return; setIsFetchingDetails(true); setInspectedPlaceLocation({ latitude, longitude }); setInspectedPlaceDetails(null);
       const params = new URLSearchParams({ lat: latitude.toString(), lon: longitude.toString(), format: 'json', zoom: '18', addressdetails: '1', extratags: '1' });
       const url = `${NOMINATIM_API_BASE}/reverse?${params.toString()}`;
       try {
           const resp = await fetch(url, { headers: { 'User-Agent': NOMINATIM_USER_AGENT } }); const data = await resp.json();
           if (resp.ok && !data.error) { setInspectedPlaceDetails(data); }
           else { setInspectedPlaceDetails({ display_name: "Unknown Location" }); showMessage({ message: "No details found.", type: "warning", duration: 2500 }); }
       } catch (err) { showMessage({ message: "Network Error fetching details.", type: "danger", duration: 3000 }); setInspectedPlaceLocation(null); }
       finally { setIsFetchingDetails(false); }
   };

   const handleAddInspectedPlaceToRoute = () => {
       if (!inspectedPlaceDetails || !inspectedPlaceLocation) return; let name = inspectedPlaceDetails.display_name?.split(',')[0] || "Selected Location";
       const newPoint = { latitude: inspectedPlaceLocation.latitude, longitude: inspectedPlaceLocation.longitude, name: name, osm_id: inspectedPlaceDetails.osm_id, osm_type: inspectedPlaceDetails.osm_type };
       if (selectedPoints.length >= 2) { setSelectedPoints(prev => [...prev.slice(0, 1), newPoint]); showMessage({ message: "Destination updated", type: 'info' }); }
       else { setSelectedPoints(prev => [...prev, newPoint]); showMessage({ message: `${name} added`, type: 'success' }); }
       setInspectedPlaceDetails(null); setInspectedPlaceLocation(null);
   };

  const removePoint = (indexToRemove) => {
      setSelectedPoints(prev => prev.filter((_, index) => index !== indexToRemove));
      if (selectedPoints.length === 1) { setInspectedPlaceDetails(null); setInspectedPlaceLocation(null); }
  };

  const clearAllPoints = () => {
    setSelectedPoints([]);
    setRouteCoordinates([]);
    setInspectedPlaceDetails(null);
    setInspectedPlaceLocation(null);
    clearRideState();
    showMessage({ message: "Route cleared", type: "info" });
  };

  const handleModeChange = (newMode) => {
    if (mode !== newMode) {
        console.log(`Switching mode to: ${newMode}`);
        setMode(newMode);
    }
  };

    const handleRideAction = async () => {
        if (selectedPoints.length < 2) {
            showMessage({ message: "Select start and end points first.", type: "warning" });
            return;
        }
        if (mode === 'HIKER') {
            await requestRide(selectedPoints);
        } else {
            const success = await offerRide(selectedPoints, routeCoordinates);
            if (success) {
                showMessage({ message: "Driving Mode Activated!", description: "Offer sent to server.", type: "info"});
            }
        }
    };

  const onHeaderLayout = (event) => { setHeaderHeight(event.nativeEvent.layout.height); };

  const renderMapContent = () => {
      if (locationLoading && !initialRegion) return <ActivityIndicator size="large" color="#0000ff" style={styles.centered} />;
      if (locationErrorMsg) return <Text style={[styles.errorText, styles.centered]}>{locationErrorMsg}</Text>;
      if (!initialRegion) return <Text style={styles.centered}>Waiting for location...</Text>;
      return ( <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion} onPress={handleMapPress} showsMyLocationButton={true} pitchEnabled={true} rotateEnabled={true} showsBuildings={true} >
          <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} zIndex={-1} userAgent={NOMINATIM_USER_AGENT}/>
          {currentUserLocation && (<Marker anchor={{ x: 0.5, y: 0.5 }} coordinate={currentUserLocation} flat={true} style={{ transform: [{ rotate: `${userHeading}deg` }] }} zIndex={20}><Ionicons name="navigate-circle" size={28} color="#007AFF" /></Marker>)}
          {selectedPoints.map((point, index) => (<Marker key={`p-${index}-${point.latitude}`} coordinate={point} pinColor={index === 0 ? "green" : "red"} zIndex={5} >
               <Callout tooltip={false}><TouchableOpacity onPress={() => removePoint(index)}>
                   <View style={styles.calloutView}><Text style={styles.calloutTitle}>{index === 0 ? "Pickup" : `Destination`}</Text>{point.name && <Text style={styles.calloutDescription} numberOfLines={2}>{point.name}</Text>}<Text style={styles.removeText}>Tap to Remove</Text></View>
               </TouchableOpacity></Callout>
          </Marker>))}
          {inspectedPlaceLocation && (<Marker key="insp-mark" coordinate={inspectedPlaceLocation} pinColor="purple" zIndex={10}>
              <Callout tooltip={false}><View style={styles.calloutView}>{isFetchingDetails ? <ActivityIndicator size="small" /> : inspectedPlaceDetails ? (<><Text style={styles.calloutTitle} numberOfLines={3}>{inspectedPlaceDetails.display_name || "Selected"}</Text><TouchableOpacity onPress={handleAddInspectedPlaceToRoute} style={styles.calloutButton}><Text style={styles.calloutButtonText}>Add to Route</Text></TouchableOpacity></>) : <Text>No details.</Text>}</View></Callout>
          </Marker>)}
+          {routeCoordinates.length > 0 && (<Polyline coordinates={routeCoordinates} strokeColor="#007AFF" strokeWidth={5} zIndex={2} />)}
       </MapView>
      );
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }} onLayout={onHeaderLayout}>
        <View style={{ flex: 1 }}>
          <ExploreSearchBar
            searchQuery={searchQuery} onSearchChange={handleSearchChange} onSearchSubmit={debouncedSearch}
            isSearching={isSearching} onClearSearch={handleClearSearch} inputRef={searchInputRef}
            onFocus={() => { setInspectedPlaceDetails(null); setInspectedPlaceLocation(null); setShowSearchResults(true); }}
          />
        </View>
              <TouchableOpacity onPress={() => handleModeChange(mode === 'HIKER' ? 'RIDER' : 'HIKER')} style={styles.modeToggleButton}>
     <Ionicons name={mode === 'HIKER' ? 'walk' : 'car-sport'} size={22} color="#007AFF" />
<Text style={styles.modeToggleText}>{mode === 'HIKER' ? 'Hiker' : 'Driver'}</Text>
        </TouchableOpacity>
      </View>
  
      {headerHeight > 0 && (
        <SearchResultsList
          searchResults={searchResults} searchError={searchError} isVisible={showSearchResults && !isSearching}
          onSelectItem={handleSelectSearchResult} headerHeight={headerHeight}
        />
      )}
  
      <RoutePointsDisplay
        points={selectedPoints}
        onRemovePoint={removePoint}
        onClearAll={clearAllPoints}
      />
  
      <MapStatusIndicator
        isRouting={isRouting}
        isFetchingDetails={isFetchingDetails}
        routeErrorMsg={routeErrorMsg}
        selectedPointsCount={selectedPoints.length}
        isInspectingPlace={!!inspectedPlaceLocation}
        searchQuery={searchQuery}
      />
  
      <View style={styles.mapContainer}>
        {renderMapContent()}
      </View>
  
            {mode === 'HIKER' && (
                <RideRequestButton
                    mode={mode}
                    isVisible={selectedPoints.length >= 2}
                    isRequesting={isRequestingRide}
                    isOffering={false}
                    isRouteCalculating={isRouting}
                    requestError={rideError}
                    offerError={null}
                    onPress={handleRideAction}
                />
            )}

            {mode === 'RIDER' && (
                <DrivingModeButton
                    isVisible={selectedPoints.length >= 2}
                    isLoading={isOfferingRide}
                    onPress={handleRideAction}
                />
            )}

             {mode === 'RIDER' && offerError && !isOfferingRide && (
                 <View style={styles.riderErrorContainer}>
                      <Text style={styles.errorText}>{offerError}</Text>
                 </View>
             )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', },
  mapContainer: { flex: 1, }, map: { ...StyleSheet.absoluteFillObject, },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
  errorText: { color: 'red', textAlign: 'center', fontSize: 14, paddingHorizontal: 10, },
  calloutView: { padding: 10, minWidth: 150, maxWidth: 250, borderRadius: 6, backgroundColor: 'white', },
  calloutTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#333', },
  calloutDescription: { fontSize: 12, color: '#555', marginBottom: 8, },
  removeText: { fontSize: 11, color: 'red', marginTop: 5, textAlign: 'center', },
  calloutButton: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, marginTop: 10, alignItems: 'center', },
  calloutButtonText: { color: '#fff', fontSize: 13, fontWeight: 'bold', },
  modeToggleButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#e7f0ff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cce0ff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeToggleText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#0056b3',
    fontWeight: '500',
  },
});

