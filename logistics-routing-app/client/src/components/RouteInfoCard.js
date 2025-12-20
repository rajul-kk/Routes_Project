// Route information card component

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { formatDuration, formatDistance } from '../utils/formatTime';

const RouteInfoCard = ({ 
  routeInfo, 
  onClear,
  showFuelConsumption = false 
}) => {
  if (!routeInfo) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Route Details</Text>
        {onClear && (
          <Pressable 
            onPress={onClear}
            style={({ pressed }) => [
              pressed && styles.clearButtonPressed
            ]}
          >
            <Text style={styles.clearButton}>Clear</Text>
          </Pressable>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.item}>
          <Text style={styles.label}>Distance</Text>
          <Text style={styles.value}>{formatDistance(routeInfo.distance)}</Text>
        </View>
        
        <View style={styles.item}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>{formatDuration(routeInfo.duration)}</Text>
        </View>
        
        <View style={styles.item}>
          <Text style={styles.label}>From</Text>
          <Text style={styles.value} numberOfLines={1}>
            {routeInfo.centre?.name || '--'}
          </Text>
        </View>
      </View>

      {showFuelConsumption && routeInfo.fuelConsumption && (
        <View style={styles.fuelSection}>
          <Text style={styles.label}>Est. Fuel</Text>
          <Text style={styles.fuelValue}>
            {routeInfo.fuelConsumption.toFixed(2)} L
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C2A3A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2C3E50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clearButton: {
    color: '#FF375F',
    fontWeight: '600',
  },
  clearButtonPressed: {
    opacity: 0.7,
    transform: [{ translateY: 1 }],
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fuelSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2C3E50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fuelValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#30D158',
  },
});

export default RouteInfoCard;

