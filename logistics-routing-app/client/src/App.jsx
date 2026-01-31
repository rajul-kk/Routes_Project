// Main entry point

import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import MapScreen from './screens/MapScreen';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentScreen('map');
  };

  const handleSignUp = (userData) => {
    setUser(userData);
    setCurrentScreen('map');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  const navigateToSignUp = () => {
    setCurrentScreen('signup');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  return (
    <div className="app">
      {currentScreen === 'login' && (
        <LoginScreen 
          onLogin={handleLogin} 
          onNavigateToSignUp={navigateToSignUp} 
        />
      )}
      {currentScreen === 'signup' && (
        <SignUpScreen 
          onSignUp={handleSignUp} 
          onNavigateToLogin={navigateToLogin} 
        />
      )}
      {currentScreen === 'map' && (
        <MapScreen 
          user={user} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

