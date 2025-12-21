// Reusable button component

import React from 'react';
import './Button.css';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const handleClick = (e) => {
    if (!disabled && !loading && onPress) {
      onPress(e);
    }
  };

  return (
    <button
      className={`btn btn-${variant} ${loading || disabled ? 'btn-disabled' : ''}`}
      onClick={handleClick}
      disabled={loading || disabled}
      style={style}
    >
      {loading ? (
        <span className="btn-spinner"></span>
      ) : (
        <span className={`btn-text ${textStyle || ''}`}>{title}</span>
      )}
    </button>
  );
};

export default Button;

