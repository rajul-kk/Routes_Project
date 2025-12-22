// Loading overlay component

import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = ({ 
  visible = true, 
  message = 'Loading...', 
  fullScreen = true,
  color = '#64D2FF' 
}) => {
  if (!visible) return null;

  if (fullScreen) {
    return (
      <div className="loading-overlay-fullscreen">
        <div className="loading-spinner" style={{ borderTopColor: color }}></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="loading-overlay">
      <div className="loading-spinner" style={{ borderTopColor: color }}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingOverlay;

