// Logic for handling route requests using Google Routes API

const distributionCentres = require('../data/distributionCentres.json');

/**
 * Decode Google's encoded polyline string to array of coordinates
 * @param {string} encoded - Encoded polyline string
 * @returns {Array} Array of {latitude, longitude} objects
 */
function decodePolyline(encoded) {
  const coordinates = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) !== 0) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) !== 0) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    coordinates.push({
      latitude: lat * 1e-5,
      longitude: lng * 1e-5
    });
  }

  return coordinates;
}

/**
 * Get route from a distribution centre to a destination
 * @param {string} preference - 'shortest', 'leastTraffic', or 'leastFuel'
 * @param {string} vehicleType - 'car' or 'bike'
 * @param {number} centreId - ID of the distribution centre
 * @param {object} destination - { lat, lng } coordinates
 */
async function getRoute(req, res) {
  try {
    const { preference, vehicleType, centreId, destination } = req.body;

    // Find the distribution centre
    const centre = distributionCentres.find(c => c.id === parseInt(centreId));
    if (!centre) {
      return res.status(404).json({ error: 'Distribution centre not found' });
    }

    // Determine routing preference
    let routingPreference;
    let extraComputations = [];
    let emissionType = null;

    switch (preference) {
      case 'shortest':
        routingPreference = 'TRAFFIC_UNAWARE'; // Pure distance
        break;
      case 'leastTraffic':
        routingPreference = 'TRAFFIC_AWARE';
        break;
      case 'leastFuel':
        routingPreference = 'TRAFFIC_AWARE';
        extraComputations = ['FUEL_CONSUMPTION'];
        emissionType = 'GASOLINE'; // Common in KL, or 'ELECTRIC'
        break;
      default:
        routingPreference = 'TRAFFIC_AWARE';
    }

    // Determine travel mode based on vehicle type
    const travelMode = vehicleType === 'bike' ? 'TWO_WHEELER' : 'DRIVE';

    // Prepare Google Routes API request
    const routeRequest = {
      origin: {
        location: {
          latLng: {
            latitude: centre.location.lat,
            longitude: centre.location.lng
          }
        }
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.lat,
            longitude: destination.lng
          }
        }
      },
      travelMode: travelMode,
      routingPreference: routingPreference,
      extraComputations: extraComputations,
      ...(emissionType && {
        vehicleInfo: {
          emissionType: emissionType
        }
      })
    };

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ 
        error: 'Google API key not configured. Please set GOOGLE_API_KEY in your .env file' 
      });
    }

    // Call Google Routes API
    const apiUrl = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const fieldMask = 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.steps,routes.routeLabels,routes.travelAdvisory';
    
    // Add fuel consumption fields if requested
    if (preference === 'leastFuel') {
      fieldMask += ',routes.legs.steps.travelAdvisory.fuelConsumption';
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
        'X-Goog-FieldMask': fieldMask
      },
      body: JSON.stringify(routeRequest)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Google Routes API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to calculate route from Google API',
        details: errorData 
      });
    }

    const data = await response.json();

    // Check if routes were found
    if (!data.routes || data.routes.length === 0) {
      return res.status(404).json({ error: 'No route found between the specified locations' });
    }

    const route = data.routes[0];
    const encodedPolyline = route.polyline?.encodedPolyline;

    // Decode polyline to coordinates for frontend
    const polylineCoordinates = encodedPolyline 
      ? decodePolyline(encodedPolyline)
      : [];

    // Extract route information
    const routeInfo = {
      distance: route.distanceMeters,
      duration: route.duration,
      polyline: polylineCoordinates,
      encodedPolyline: encodedPolyline,
      preference: preference,
      vehicleType: vehicleType,
      centre: centre,
      destination: destination
    };

    // Add fuel consumption if available
    if (preference === 'leastFuel' && route.legs) {
      const fuelConsumption = route.legs
        .flatMap(leg => leg.steps || [])
        .map(step => step.travelAdvisory?.fuelConsumption)
        .filter(Boolean);
      
      if (fuelConsumption.length > 0) {
        routeInfo.fuelConsumption = fuelConsumption;
      }
    }

    res.json({
      success: true,
      route: routeInfo
    });

  } catch (error) {
    console.error('Error calculating route:', error);
    res.status(500).json({ error: 'Failed to calculate route' });
  }
}

/**
 * Get all available distribution centres
 */
function getDistributionCentres(req, res) {
  res.json(distributionCentres);
}

module.exports = {
  getRoute,
  getDistributionCentres
};

