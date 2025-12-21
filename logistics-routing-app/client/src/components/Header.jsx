// Header component with user greeting and logout

import React from 'react';
import './Header.css';

const Header = ({ title = 'RouteKL', userName, onLogout, showLogout = true }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {userName && (
          <p className="header-subtitle">Hi, {userName}</p>
        )}
      </div>
      {showLogout && onLogout && (
        <button 
          className="header-logout-button"
          onClick={onLogout}
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;

