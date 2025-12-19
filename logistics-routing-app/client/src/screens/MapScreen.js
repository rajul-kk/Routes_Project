// Main MapScreen with routing controls

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getDistributionCentres, getRoute } from '../services/api';
import {
  Header,
  VehicleSelector,
  RoutePreferenceSelector,
  RouteInfoCard,
  LoadingOverlay,
  InstructionsCard,
} from '../components';

const KL_CENTER = {
  latitude: 3.1390,
  longitude: 101.6869,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapScreen = ({ user, onLogout }) => {
  const [distributionCentres, setDistributionCentres] = useState([]);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [destination, setDestination] = useState(null);
  const [preference, setPreference] = useState('leastTraffic');
  const [vehicleType, setVehicleType] = useState('car');

  useEffect(() => {
    loadDistributionCentres();
  }, []);

  const loadDistributionCentres = async () => {
    try {
      const centres = await getDistributionCentres();
      setDistributionCentres(centres);
      setLoading(false);
    } catch (error) {
      console.error('Error loading distribution centres:', error);
      Alert.alert('Error', 'Failed to load distribution centres');
      setLoading(false);
    }
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newDestination = { lat: latitude, lng: longitude };
    setDestination(newDestination);

    if (selectedCentre) {
      await calculateRoute(selectedCentre.id, newDestination);
    }
  };

  const handleCentreSelect = (centre) => {
    setSelectedCentre(centre);
    if (destination) {
      calculateRoute(centre.id, destination);
    }
  };

  const calculateRoute = async (centreId, dest) => {
    setCalculatingRoute(true);
    try {
      const response = await getRoute({
        centreId,
        destination: dest,
        preference,
        vehicleType
      });

      if (response.success && response.route?.polyline) {
        setRoutePolyline(response.route.polyline);
        setRouteInfo(response.route);
      } else {
        Alert.alert('Route Error', response.error || 'Could not calculate route');
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      Alert.alert('Error', 'Failed to calculate route');
    } finally {
      setCalculatingRoute(false);
    }
  };

  const handlePreferenceChange = (newPreference) => {
    setPreference(newPreference);
    if (selectedCentre && destination) {
      calculateRoute(selectedCentre.id, destination);
    }
  };

  const handleVehicleChange = (newVehicle) => {
    setVehicleType(newVehicle);
    if (selectedCentre && destination) {
      calculateRoute(selectedCentre.id, destination);
    }
  };

  const clearRoute = () => {
    setRoutePolyline(null);
    setRouteInfo(null);
    setDestination(null);
    setSelectedCentre(null);
  };

  if (loading) {
    return <LoadingOverlay message="Loading map..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="RouteKL" 
        userName={user?.name || 'User'} 
        onLogout={onLogout} 
      />

      <VehicleSelector 
        selected={vehicleType} 
        onSelect={handleVehicleChange} 
      />

      <RoutePreferenceSelector 
        selected={preference} 
        onSelect={handlePreferenceChange} 
      />

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={KL_CENTER}
          onPress={handleMapPress}
        >
          {/* Distribution Centre Markers */}
          {distributionCentres.map((centre) => (
            <Marker
              key={centre.id}
              coordinate={{
                latitude: centre.location.lat,
                longitude: centre.location.lng,
              }}
              title={centre.name}
              description={selectedCentre?.id === centre.id ? 'Selected Origin' : 'Tap to select as origin'}
              pinColor={selectedCentre?.id === centre.id ? '#30D158' : '#007AFF'}
              onPress={() => handleCentreSelect(centre)}
            />
          ))}

          {/* Destination Marker */}
          {destination && (
            <Marker
              coordinate={{
                latitude: destination.lat,
                longitude: destination.lng,
              }}
              title="Destination"
              pinColor="#FF375F"
            />
          )}

          {/* Route Polyline */}
          {routePolyline && (
            <Polyline
              coordinates={routePolyline}
              strokeColor="#FF375F"
              strokeWidth={4}
            />
          )}
        </MapView>

        {/* Calculating Overlay */}
        {calculatingRoute && (
          <LoadingOverlay 
            message="Calculating route..." 
            fullScreen={false} 
          />
        )}
      </View>

      {/* Route Info Card */}
      {routeInfo && (
        <RouteInfoCard 
          routeInfo={routeInfo} 
          onClear={clearRoute}
          showFuelConsumption={preference === 'leastFuel'}
        />
      )}

      {/* Instructions */}
      <InstructionsCard visible={!routeInfo} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
