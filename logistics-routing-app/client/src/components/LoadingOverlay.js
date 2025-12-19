// Loading overlay component

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingOverlay = ({ 
  visible = true, 
  message = 'Loading...', 
  fullScreen = true,
  color = '#64D2FF' 
}) => {
  if (!visible) return null;

  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size="large" color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A1628',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 22, 40, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
    color: '#64D2FF',
    fontSize: 16,
  },
});

export default LoadingOverlay;

