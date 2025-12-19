// Instructions/help card component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DEFAULT_INSTRUCTIONS = [
  'Tap a blue marker to select origin',
  'Tap anywhere on map to set destination',
  'Choose your routing preference above',
];

const InstructionsCard = ({ 
  title = 'How to use:', 
  instructions = DEFAULT_INSTRUCTIONS,
  visible = true 
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>
        {instructions.map((instruction, index) => (
          `${index + 1}. ${instruction}${index < instructions.length - 1 ? '\n' : ''}`
        )).join('')}
      </Text>
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
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64D2FF',
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 20,
  },
});

export default InstructionsCard;

