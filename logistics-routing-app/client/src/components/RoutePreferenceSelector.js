// Route preference selector component (Shortest/Least Traffic/Eco-Friendly)

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

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
        <Pressable
          key={pref.id}
          style={({ pressed }) => [
            styles.option,
            selected === pref.id && styles.optionActive,
            pressed && styles.optionPressed,
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
        </Pressable>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  optionActive: {
    backgroundColor: '#64D2FF',
    borderColor: '#64D2FF',
  },
  optionPressed: {
    transform: [{ translateY: 1 }],
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
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

