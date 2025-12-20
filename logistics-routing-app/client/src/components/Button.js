// Reusable button component with 3D press effect

import React, { useState } from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'success', 'danger', 'outline'
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const [pressed, setPressed] = useState(false);

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

  const getPressedStyle = () => {
    if (pressed && !disabled && !loading) {
      return {
        transform: [{ translateY: 2 }],
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      };
    }
    return {};
  };

  return (
    <Pressable
      style={({ pressed: isPressed }) => [
        styles.button,
        getVariantStyle(),
        (loading || disabled) && styles.disabled,
        isPressed && !disabled && !loading && getPressedStyle(),
        style,
      ]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#64D2FF' : '#FFFFFF'} 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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

