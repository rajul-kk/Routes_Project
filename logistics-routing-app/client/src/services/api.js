// API calls (e.g., api.js calling your local backend)

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Sign up user
 * @param {string} email 
 * @param {string} password 
 * @param {string} name 
 */
export const signup = async (email, password, name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

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
