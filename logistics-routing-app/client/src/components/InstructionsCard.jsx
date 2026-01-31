// Instructions/help card component

import React from 'react';
import './InstructionsCard.css';

const DEFAULT_INSTRUCTIONS = [
  'Click a blue marker to select origin',
  'Click anywhere on map to set destination',
  'Choose your routing preference above',
];

const InstructionsCard = ({ 
  title = 'How to use:', 
  instructions = DEFAULT_INSTRUCTIONS,
  visible = true 
}) => {
  if (!visible) return null;

  return (
    <div className="instructions-card">
      <h4 className="instructions-title">{title}</h4>
      <div className="instructions-text">
        {instructions.map((instruction, index) => (
          <p key={index}>{index + 1}. {instruction}</p>
        ))}
      </div>
    </div>
  );
};

export default InstructionsCard;

