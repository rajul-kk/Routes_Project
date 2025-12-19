// Reusable input field component

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  error,
  showPasswordToggle = false,
  style,
  inputStyle,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry || showPasswordToggle;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <TextInput
          style={[styles.input, isPassword && styles.passwordInput, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
        
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeIcon}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#0A1628',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  inputError: {
    borderColor: '#FF375F',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#FF375F',
    marginTop: 6,
  },
});

export default InputField;

