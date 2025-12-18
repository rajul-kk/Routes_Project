// Logic for handling route requests using Google Routes API

const distributionCentres = require('../data/distributionCentres.json');

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

    // TODO: Call Google Routes API here
    // const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
    //     'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline,routes.legs.steps'
    //   },
    //   body: JSON.stringify(routeRequest)
    // });

    // Placeholder response
    res.json({
      success: true,
      route: {
        centre: centre,
        destination: destination,
        preference: preference,
        vehicleType: vehicleType,
        request: routeRequest
      }
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

