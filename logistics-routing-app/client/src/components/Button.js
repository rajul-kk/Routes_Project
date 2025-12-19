// Reusable button component

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'success', 'danger', 'outline'
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'success':
        return styles.success;
      case 'danger':
        return styles.danger;
      case 'outline':
        return styles.outline;
      default:
        return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      default:
        return styles.text;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        (loading || disabled) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#64D2FF' : '#FFFFFF'} 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#FF375F',
  },
  secondary: {
    backgroundColor: '#64D2FF',
  },
  success: {
    backgroundColor: '#30D158',
  },
  danger: {
    backgroundColor: '#FF375F',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#64D2FF',
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  outlineText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64D2FF',
  },
});

export default Button;

