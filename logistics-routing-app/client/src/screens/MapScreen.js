import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getDistributionCentres, getRoute } from '../services/api';

const KL_CENTER = {
  latitude: 3.1390,
  longitude: 101.6869,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapScreen = () => {
  const [distributionCentres, setDistributionCentres] = useState([]);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [destination, setDestination] = useState(null);

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

  const calculateRoute = async (centreId, dest, preference = 'leastTraffic', vehicleType = 'car') => {
    try {
      const route = await getRoute({
        centreId,
        destination: dest,
        preference,
        vehicleType
      });

      if (route?.polyline) {
        setRoutePolyline(route.polyline);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            pinColor="blue"
            onPress={() => setSelectedCentre(centre)}
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
            pinColor="red"
          />
        )}

        {/* Route Polyline */}
        {routePolyline && (
          <Polyline
            coordinates={routePolyline}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;

