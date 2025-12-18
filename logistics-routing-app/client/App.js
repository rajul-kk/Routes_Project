// Main entry point

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MapScreen from './src/screens/MapScreen';

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
    <SafeAreaProvider>
      <StatusBar style="light" />
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
    </SafeAreaProvider>
  );
}
