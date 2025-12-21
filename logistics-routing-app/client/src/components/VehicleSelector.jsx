// Vehicle type selector component (Car/Bike)

import React from 'react';
import './VehicleSelector.css';

const VEHICLES = [
  { id: 'car', label: 'Car', icon: '🚗' },
  { id: 'bike', label: 'Bike', icon: '🏍️' },
];

const VehicleSelector = ({ selected, onSelect, vehicles = VEHICLES }) => {
  return (
    <div className="vehicle-selector">
      {vehicles.map((vehicle) => (
        <button
          key={vehicle.id}
          className={`vehicle-option ${selected === vehicle.id ? 'vehicle-option-active' : ''}`}
          onClick={() => onSelect(vehicle.id)}
        >
          <span className="vehicle-icon">{vehicle.icon}</span>
          <span className={`vehicle-label ${selected === vehicle.id ? 'vehicle-label-active' : ''}`}>
            {vehicle.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default VehicleSelector;

