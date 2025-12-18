// Main MapScreen with routing controls

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getDistributionCentres, getRoute } from '../services/api';

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

  const formatDuration = (duration) => {
    if (!duration) return '--';
    // Duration comes as "XXs" string from Google API
    const seconds = parseInt(duration.replace('s', ''));
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const formatDistance = (meters) => {
    if (!meters) return '--';
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#64D2FF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>RouteKL</Text>
          <Text style={styles.headerSubtitle}>Hi, {user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Vehicle Type Selector */}
      <View style={styles.vehicleSelector}>
        <TouchableOpacity
          style={[styles.vehicleOption, vehicleType === 'car' && styles.vehicleOptionActive]}
          onPress={() => handleVehicleChange('car')}
        >
          <Text style={styles.vehicleIcon}>🚗</Text>
          <Text style={[styles.vehicleText, vehicleType === 'car' && styles.vehicleTextActive]}>Car</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.vehicleOption, vehicleType === 'bike' && styles.vehicleOptionActive]}
          onPress={() => handleVehicleChange('bike')}
        >
          <Text style={styles.vehicleIcon}>🏍️</Text>
          <Text style={[styles.vehicleText, vehicleType === 'bike' && styles.vehicleTextActive]}>Bike</Text>
        </TouchableOpacity>
      </View>

      {/* Route Preference Selector */}
      <View style={styles.preferenceSelector}>
        <TouchableOpacity
          style={[styles.preferenceOption, preference === 'shortest' && styles.preferenceOptionActive]}
          onPress={() => handlePreferenceChange('shortest')}
        >
          <Text style={[styles.preferenceText, preference === 'shortest' && styles.preferenceTextActive]}>Shortest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.preferenceOption, preference === 'leastTraffic' && styles.preferenceOptionActive]}
          onPress={() => handlePreferenceChange('leastTraffic')}
        >
          <Text style={[styles.preferenceText, preference === 'leastTraffic' && styles.preferenceTextActive]}>Least Traffic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.preferenceOption, preference === 'leastFuel' && styles.preferenceOptionActive]}
          onPress={() => handlePreferenceChange('leastFuel')}
        >
          <Text style={[styles.preferenceText, preference === 'leastFuel' && styles.preferenceTextActive]}>Eco-Friendly</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
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
          <View style={styles.calculatingOverlay}>
            <ActivityIndicator size="large" color="#64D2FF" />
            <Text style={styles.calculatingText}>Calculating route...</Text>
          </View>
        )}
      </View>

      {/* Route Info Card */}
      {routeInfo && (
        <View style={styles.routeInfoCard}>
          <View style={styles.routeInfoHeader}>
            <Text style={styles.routeInfoTitle}>Route Details</Text>
            <TouchableOpacity onPress={clearRoute}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.routeInfoContent}>
            <View style={styles.routeInfoItem}>
              <Text style={styles.routeInfoLabel}>Distance</Text>
              <Text style={styles.routeInfoValue}>{formatDistance(routeInfo.distance)}</Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Text style={styles.routeInfoLabel}>Duration</Text>
              <Text style={styles.routeInfoValue}>{formatDuration(routeInfo.duration)}</Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Text style={styles.routeInfoLabel}>From</Text>
              <Text style={styles.routeInfoValue} numberOfLines={1}>{routeInfo.centre?.name || '--'}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Instructions */}
      {!routeInfo && (
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to use:</Text>
          <Text style={styles.instructionsText}>
            1. Tap a blue marker to select origin{'\n'}
            2. Tap anywhere on map to set destination{'\n'}
            3. Choose your routing preference above
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A1628',
  },
  loadingText: {
    marginTop: 12,
    color: '#64D2FF',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1C2A3A',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#FF375F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  vehicleSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1C2A3A',
    gap: 10,
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0A1628',
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  vehicleOptionActive: {
    backgroundColor: '#30D158',
    borderColor: '#30D158',
  },
  vehicleIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  vehicleText: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  vehicleTextActive: {
    color: '#FFFFFF',
  },
  preferenceSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#1C2A3A',
    gap: 8,
  },
  preferenceOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  preferenceOptionActive: {
    backgroundColor: '#64D2FF',
    borderColor: '#64D2FF',
  },
  preferenceText: {
    color: '#8E8E93',
    fontWeight: '600',
    fontSize: 12,
  },
  preferenceTextActive: {
    color: '#0A1628',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  calculatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 22, 40, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatingText: {
    marginTop: 12,
    color: '#64D2FF',
    fontSize: 16,
  },
  routeInfoCard: {
    backgroundColor: '#1C2A3A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2C3E50',
  },
  routeInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clearButton: {
    color: '#FF375F',
    fontWeight: '600',
  },
  routeInfoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeInfoItem: {
    flex: 1,
  },
  routeInfoLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  routeInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  instructionsCard: {
    backgroundColor: '#1C2A3A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2C3E50',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64D2FF',
    marginBottom: 6,
  },
  instructionsText: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 20,
  },
});

export default MapScreen;
