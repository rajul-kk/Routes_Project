// API service for backend communication

const API_BASE_URL = '/api';

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
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      return { success: false, error: errorData.error || 'Login failed' };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error('Cannot connect to server. Please check your connection.');
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
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      return { success: false, error: errorData.error || 'Signup failed' };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw new Error('Cannot connect to server. Please check your connection.');
  }
};

/**
 * Get all distribution centres
 */
export const getDistributionCentres = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/distribution-centres`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch distribution centres: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching distribution centres:', error);
    throw new Error('Cannot connect to server. Check your network connection and ensure the backend is running.');
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
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      return { success: false, error: errorData.error || 'Route calculation failed' };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching route:', error);
    throw new Error('Cannot connect to server. Check your network connection and ensure the backend is running.');
  }
};
