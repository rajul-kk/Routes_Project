// Vehicle type selector component (Car/Bike)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const VEHICLES = [
  { id: 'car', label: 'Car', icon: '🚗' },
  { id: 'bike', label: 'Bike', icon: '🏍️' },
];

const VehicleSelector = ({ selected, onSelect, vehicles = VEHICLES }) => {
  return (
    <View style={styles.container}>
      {vehicles.map((vehicle) => (
        <TouchableOpacity
          key={vehicle.id}
          style={[
            styles.option,
            selected === vehicle.id && styles.optionActive,
          ]}
          onPress={() => onSelect(vehicle.id)}
        >
          <Text style={styles.icon}>{vehicle.icon}</Text>
          <Text
            style={[
              styles.label,
              selected === vehicle.id && styles.labelActive,
            ]}
          >
            {vehicle.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1C2A3A',
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0A1628',
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  optionActive: {
    backgroundColor: '#30D158',
    borderColor: '#30D158',
  },
  icon: {
    fontSize: 18,
    marginRight: 6,
  },
  label: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  labelActive: {
    color: '#FFFFFF',
  },
});

export default VehicleSelector;

