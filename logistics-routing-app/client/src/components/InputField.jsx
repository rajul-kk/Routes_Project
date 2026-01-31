// Reusable input field component

import React, { useState } from 'react';
import './InputField.css';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'text',
  autoCapitalize = 'none',
  autoCorrect = false,
  error,
  showPasswordToggle = false,
  style,
  inputStyle,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry || showPasswordToggle;
  const inputType = isPassword && !showPassword ? 'password' : keyboardType === 'email-address' ? 'email' : 'text';

  return (
    <div className="input-field" style={style}>
      {label && <label className="input-label">{label}</label>}
      
      <div className={`input-wrapper ${error ? 'input-error' : ''}`}>
        <input
          className={`input ${isPassword ? 'input-password' : ''}`}
          type={inputType}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          style={inputStyle}
        />
        
        {isPassword && (
          <button
            type="button"
            className="input-eye-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span className="input-eye-icon">
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </button>
        )}
      </div>
      
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export default InputField;

