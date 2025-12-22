// Route information card component

import React from 'react';
import { formatDuration, formatDistance } from '../utils/formatTime';
import './RouteInfoCard.css';

const RouteInfoCard = ({ 
  routeInfo, 
  onClear,
  showFuelConsumption = false 
}) => {
  if (!routeInfo) return null;

  return (
    <div className="route-info-card">
      <div className="route-info-header">
        <h3 className="route-info-title">Route Details</h3>
        {onClear && (
          <button 
            className="route-info-clear-button"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="route-info-content">
        <div className="route-info-item">
          <span className="route-info-label">Distance</span>
          <span className="route-info-value">{formatDistance(routeInfo.distance)}</span>
        </div>
        
        <div className="route-info-item">
          <span className="route-info-label">Duration</span>
          <span className="route-info-value">{formatDuration(routeInfo.duration)}</span>
        </div>
        
        <div className="route-info-item">
          <span className="route-info-label">From</span>
          <span className="route-info-value" title={routeInfo.centre?.name || '--'}>
            {routeInfo.centre?.name || '--'}
          </span>
        </div>
      </div>

      {showFuelConsumption && routeInfo.fuelConsumption && (
        <div className="route-info-fuel">
          <span className="route-info-label">Est. Fuel</span>
          <span className="route-info-fuel-value">
            {routeInfo.fuelConsumption.toFixed(2)} L
          </span>
        </div>
      )}
    </div>
  );
};

export default RouteInfoCard;

