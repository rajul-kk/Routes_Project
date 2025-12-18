// API calls (e.g., api.js calling your local backend)

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

/**
 * Get all distribution centres
 */
export const getDistributionCentres = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/distribution-centres`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching distribution centres:', error);
    throw error;
  }
};

/**
 * Get route from distribution centre to destination
 * @param {object} params - { centreId, destination, preference, vehicleType }
 */
export const getRoute = async (params) => {
  try {
    const response = await fetch(`${API_BASE_URL}/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching route:', error);
    throw error;
  }
};

