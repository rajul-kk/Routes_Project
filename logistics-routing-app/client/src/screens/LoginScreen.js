// Login Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { login } from '../services/api';
import { InputField, Button } from '../components';
import { validateEmail, validatePassword } from '../utils/validation';

const LoginScreen = ({ onLogin, onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError || '',
      password: passwordError || '',
      general: '',
    });

    return !emailError && !passwordError;
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    // Clear email error when user starts typing
    if (errors.email) {
      setErrors({ ...errors, email: '' });
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    // Clear password error when user starts typing
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
  };

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({ email: '', password: '', general: '' });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await login(email.trim(), password);
      if (response.success) {
        onLogin(response.user);
      } else {
        // Show server error
        setErrors({
          ...errors,
          general: response.error || 'Login failed',
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
      <View style={styles.backgroundOverlay}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>RouteKL</Text>
          <Text style={styles.subtitle}>Logistics Routing for Kuala Lumpur</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.instructionText}>Sign in to continue</Text>

          {errors.general ? (
            <View style={styles.generalErrorContainer}>
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

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
            placeholder="Enter your password"
            secureTextEntry
            showPasswordToggle
            error={errors.password}
          />

          <Pressable 
            style={({ pressed }) => [
              styles.forgotPassword,
              pressed && styles.forgotPasswordPressed
            ]}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <Pressable 
              onPress={onNavigateToSignUp}
              style={({ pressed }) => [
                pressed && styles.signUpLinkPressed
              ]}
            >
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: '#0A1628',
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 28,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -12,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#64D2FF',
    fontWeight: '600',
  },
  forgotPasswordPressed: {
    opacity: 0.7,
    transform: [{ translateY: 1 }],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  signUpLink: {
    fontSize: 16,
    color: '#64D2FF',
    fontWeight: '700',
  },
  signUpLinkPressed: {
    opacity: 0.7,
    transform: [{ translateY: 1 }],
  },
});

export default LoginScreen;
