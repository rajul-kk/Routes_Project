// Main MapScreen with routing controls

import React, { useState, useEffect, useRef } from 'react';
import { getDistributionCentres, getRoute } from '../services/api';
import {
  Header,
  VehicleSelector,
  RoutePreferenceSelector,
  RouteInfoCard,
  LoadingOverlay,
  InstructionsCard,
} from '../components';
import './MapScreen.css';

const KL_CENTER = {
  lat: 3.1390,
  lng: 101.6869,
};

const MapScreen = ({ user, onLogout }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routePolylineRef = useRef(null);
  
  const [distributionCentres, setDistributionCentres] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [destination, setDestination] = useState(null);
  const [preference, setPreference] = useState('leastTraffic');
  const [vehicleType, setVehicleType] = useState('car');
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    // Set up callbacks
    window.onGoogleMapsReady = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        loadDistributionCentres();
      }
    };
    
    window.onGoogleMapsError = () => {
      setMapError('Failed to load Google Maps. Please check your API key configuration.');
      setLoading(false);
    };
    
    // Wait for Google Maps API to load
    const checkGoogleMaps = () => {
      attempts++;
      
      if (window.googleMapsError) {
        setMapError(window.googleMapsError);
        setLoading(false);
        return;
      }
      
      if (window.google && window.google.maps) {
        initializeMap();
        loadDistributionCentres();
      } else if (attempts < maxAttempts) {
        setTimeout(checkGoogleMaps, 100);
      } else {
        setMapError('Google Maps API failed to load. Please check:\n1. Your API key is valid\n2. Maps JavaScript API is enabled\n3. API key restrictions allow localhost:3001');
        setLoading(false);
      }
    };
    
    // Start checking after a short delay to let the script load
    setTimeout(checkGoogleMaps, 200);
    
    return () => {
      window.onGoogleMapsReady = null;
      window.onGoogleMapsError = null;
    };
  }, []);

  const initializeMap = () => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API not loaded');
      setLoading(false);
      return;
    }

    const mapElement = document.getElementById('map');
    if (!mapElement) {
      setTimeout(initializeMap, 100);
      return;
    }

    const map = new window.google.maps.Map(mapElement, {
      center: KL_CENTER,
      zoom: 12,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#242f3e' }],
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#242f3e' }],
        },
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#746855' }],
        },
      ],
    });

    mapInstanceRef.current = map;

    map.addListener('click', (event) => {
      handleMapClick(event.latLng);
    });
  };

  const loadDistributionCentres = async () => {
    try {
      const centres = await getDistributionCentres();
      setDistributionCentres(centres);
      setLoading(false);
      if (mapInstanceRef.current) {
        addDistributionCentreMarkers(centres);
      }
    } catch (error) {
      console.error('Error loading distribution centres:', error);
      alert('Failed to load distribution centres');
      setLoading(false);
    }
  };

  const addDistributionCentreMarkers = (centres) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    centres.forEach((centre) => {
      const marker = new window.google.maps.Marker({
        position: { lat: centre.location.lat, lng: centre.location.lng },
        map: mapInstanceRef.current,
        title: centre.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: selectedCentre?.id === centre.id ? '#30D158' : '#007AFF',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <strong>${centre.name}</strong>
            <p style="margin: 4px 0 0 0; color: #666;">
              ${selectedCentre?.id === centre.id ? 'Selected Origin' : 'Click to select as origin'}
            </p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        handleCentreSelect(centre);
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  };

  const handleMapClick = async (latLng) => {
    const newDestination = { lat: latLng.lat(), lng: latLng.lng() };
    setDestination(newDestination);

    // Add destination marker
    if (markersRef.current.length > distributionCentres.length) {
      markersRef.current[markersRef.current.length - 1].setMap(null);
      markersRef.current.pop();
    }

    const destMarker = new window.google.maps.Marker({
      position: newDestination,
      map: mapInstanceRef.current,
      title: 'Destination',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#FF375F',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
      },
    });

    markersRef.current.push(destMarker);

    if (selectedCentre) {
      await calculateRoute(selectedCentre.id, newDestination);
    }
  };

  const handleCentreSelect = (centre) => {
    setSelectedCentre(centre);
    if (destination) {
      calculateRoute(centre.id, destination);
    }
    // Update markers
    addDistributionCentreMarkers(distributionCentres);
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
        setRouteInfo(response.route);
        drawRoute(response.route.polyline);
      } else {
        alert(response.error || 'Could not calculate route');
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Failed to calculate route');
    } finally {
      setCalculatingRoute(false);
    }
  };

  const drawRoute = (polyline) => {
    if (!mapInstanceRef.current) return;

    // Remove existing route
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
    }

    // Convert polyline coordinates to Google Maps format
    const path = polyline.map(coord => ({
      lat: coord.latitude || coord.lat,
      lng: coord.longitude || coord.lng,
    }));

    routePolylineRef.current = new window.google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF375F',
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });

    routePolylineRef.current.setMap(mapInstanceRef.current);

    // Fit bounds to show entire route
    const bounds = new window.google.maps.LatLngBounds();
    path.forEach(point => bounds.extend(point));
    mapInstanceRef.current.fitBounds(bounds);
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
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }
    setRouteInfo(null);
    setDestination(null);
    setSelectedCentre(null);
    
    // Remove destination marker
    if (markersRef.current.length > distributionCentres.length) {
      markersRef.current[markersRef.current.length - 1].setMap(null);
      markersRef.current.pop();
    }
    
    // Reset markers
    addDistributionCentreMarkers(distributionCentres);
  };

  useEffect(() => {
    if (mapInstanceRef.current && distributionCentres.length > 0) {
      addDistributionCentreMarkers(distributionCentres);
    }
  }, [selectedCentre]);

  if (loading && !mapError) {
    return <LoadingOverlay message="Loading map..." />;
  }

  if (mapError) {
    return (
      <div className="map-screen">
        <Header 
          title="RouteKL" 
          userName={user?.name || 'User'} 
          onLogout={onLogout} 
        />
        <div className="map-error-container">
          <div className="map-error">
            <h2>⚠️ Map Loading Error</h2>
            <p>{mapError}</p>
            <div className="map-error-instructions">
              <h3>To fix this:</h3>
              <ol>
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                <li>Enable "Maps JavaScript API" for your project</li>
                <li>Check API key restrictions - make sure <code>localhost:3001</code> is allowed</li>
                <li>Verify billing is enabled for your Google Cloud project</li>
                <li>Update the API key in <code>client/index.html</code> if needed</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-screen">
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

      <div className="map-container">
        <div id="map" className="map"></div>

        {calculatingRoute && (
          <LoadingOverlay 
            message="Calculating route..." 
            fullScreen={false} 
          />
        )}
      </div>

      {routeInfo && (
        <RouteInfoCard 
          routeInfo={routeInfo} 
          onClear={clearRoute}
          showFuelConsumption={preference === 'leastFuel'}
        />
      )}

      <InstructionsCard visible={!routeInfo} />
    </div>
  );
};

export default MapScreen;

