// Route preference selector component (Shortest/Least Traffic/Eco-Friendly)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    <View style={styles.container}>
      {preferences.map((pref) => (
        <TouchableOpacity
          key={pref.id}
          style={[
            styles.option,
            selected === pref.id && styles.optionActive,
          ]}
          onPress={() => onSelect(pref.id)}
        >
          <Text
            style={[
              styles.label,
              selected === pref.id && styles.labelActive,
            ]}
          >
            {pref.label}
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
    paddingBottom: 10,
    backgroundColor: '#1C2A3A',
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  optionActive: {
    backgroundColor: '#64D2FF',
    borderColor: '#64D2FF',
  },
  label: {
    color: '#8E8E93',
    fontWeight: '600',
    fontSize: 12,
  },
  labelActive: {
    color: '#0A1628',
  },
});

export default RoutePreferenceSelector;

