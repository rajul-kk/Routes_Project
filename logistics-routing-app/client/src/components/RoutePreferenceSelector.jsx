// Route preference selector component (Shortest/Least Traffic/Eco-Friendly)

import React from 'react';
import './RoutePreferenceSelector.css';

const PREFERENCES = [
  { id: 'shortest', label: 'Shortest' },
  { id: 'leastTraffic', label: 'Least Traffic' },
  { id: 'leastFuel', label: 'Eco-Friendly' },
];

const RoutePreferenceSelector = ({ 
  selected, 
  onSelect, 
  preferences = PREFERENCES 
}) => {
  return (
    <div className="route-preference-selector">
      {preferences.map((pref) => (
        <button
          key={pref.id}
          className={`route-preference-option ${selected === pref.id ? 'route-preference-option-active' : ''}`}
          onClick={() => onSelect(pref.id)}
        >
          <span className={`route-preference-label ${selected === pref.id ? 'route-preference-label-active' : ''}`}>
            {pref.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default RoutePreferenceSelector;

