// Sign Up Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { signup } from '../services/api';
import { InputField, Button } from '../components';
import { validateEmail, validatePassword, validateName, validatePasswordMatch } from '../utils/validation';

const SignUpScreen = ({ onSignUp, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  const validateForm = () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validatePasswordMatch(password, confirmPassword);

    setErrors({
      name: nameError || '',
      email: emailError || '',
      password: passwordError || '',
      confirmPassword: confirmPasswordError || '',
      general: '',
    });

    return !nameError && !emailError && !passwordError && !confirmPasswordError;
  };

  const handleNameChange = (text) => {
    setName(text);
    if (errors.name) {
      setErrors({ ...errors, name: '' });
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (errors.email) {
      setErrors({ ...errors, email: '' });
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
    // Re-validate confirm password if it has a value
    if (confirmPassword && errors.confirmPassword) {
      const confirmError = validatePasswordMatch(text, confirmPassword);
      setErrors({ ...errors, password: '', confirmPassword: confirmError || '' });
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const handleSignUp = async () => {
    // Clear previous errors
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await signup(email.trim(), password, name.trim());
      if (response.success) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => onSignUp(response.user) }
        ]);
      } else {
        // Show server error
        setErrors({
          ...errors,
          general: response.error || 'Sign up failed',
        });
      }
    } catch (error) {
      // Handle network errors
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        setErrors({
          ...errors,
          general: 'Cannot connect to server. Please check your connection.',
        });
      } else {
        setErrors({
          ...errors,
          general: error.message || 'Something went wrong',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.backgroundOverlay}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>RouteKL</Text>
            <Text style={styles.subtitle}>Join the Smart Logistics Network</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.instructionText}>Fill in your details to get started</Text>

            {errors.general ? (
              <View style={styles.generalErrorContainer}>
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            ) : null}

            <InputField
              label="Full Name"
              value={name}
              onChangeText={handleNameChange}
              placeholder="Enter your full name"
              autoCapitalize="words"
              error={errors.name}
            />

            <InputField
              label="Email"
              value={email}
              onChangeText={handleEmailChange}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={errors.email}
            />

            <InputField
              label="Password"
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="Create a password (min 6 chars)"
              secureTextEntry
              showPasswordToggle
              error={errors.password}
            />

            <InputField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              placeholder="Confirm your password"
              secureTextEntry
              showPasswordToggle
              error={errors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              variant="success"
              style={styles.signUpButton}
            />

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Pressable 
                onPress={onNavigateToLogin}
                style={({ pressed }) => [
                  pressed && styles.loginLinkPressed
                ]}
              >
                <Text style={styles.loginLink}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  scrollContent: {
    flexGrow: 1,
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: '#0A1628',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#64D2FF',
    marginTop: 8,
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: '#1C2A3A',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 24,
  },
  generalErrorContainer: {
    backgroundColor: '#FF375F20',
    borderWidth: 1,
    borderColor: '#FF375F',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  generalErrorText: {
    fontSize: 14,
    color: '#FF375F',
    textAlign: 'center',
  },
  signUpButton: {
    marginTop: 8,
  },
  termsContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#64D2FF',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2C3E50',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  loginLink: {
    fontSize: 16,
    color: '#64D2FF',
    fontWeight: '700',
  },
  loginLinkPressed: {
    opacity: 0.7,
    transform: [{ translateY: 1 }],
  },
});

export default SignUpScreen;
