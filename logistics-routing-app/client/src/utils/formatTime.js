// Time and distance formatting utilities

/**
 * Format duration from Google API format (e.g., "300s") to human readable
 * @param {string} duration - Duration string from Google API
 * @returns {string} Formatted duration (e.g., "5 min", "1h 30m")
 */
export const formatDuration = (duration) => {
  if (!duration) return '--';
  // Duration comes as "XXs" string from Google API
  const seconds = parseInt(duration.replace('s', ''));
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours}h ${remainingMins}m`;
};

/**
 * Format distance from meters to human readable
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance (e.g., "500 m", "2.5 km")
 */
export const formatDistance = (meters) => {
  if (!meters) return '--';
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
};

/**
 * Format timestamp to readable time
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted time (e.g., "2:30 PM")
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '--';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Calculate ETA from duration
 * @param {string} duration - Duration string from Google API
 * @returns {string} ETA time
 */
export const calculateETA = (duration) => {
  if (!duration) return '--';
  const seconds = parseInt(duration.replace('s', ''));
  const eta = new Date(Date.now() + seconds * 1000);
  return formatTime(eta);
};

