// Sign Up Screen

import React, { useState } from 'react';
import { signup } from '../services/api';
import { InputField, Button } from '../components';
import { validateEmail, validatePassword, validateName, validatePasswordMatch } from '../utils/validation';
import './SignUpScreen.css';

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
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    });

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await signup(email.trim(), password, name.trim());
      if (response.success) {
        if (window.confirm('Account created successfully!')) {
          onSignUp(response.user);
        }
      } else {
        setErrors({
          ...errors,
          general: response.error || 'Sign up failed',
        });
      }
    } catch (error) {
      setErrors({
        ...errors,
        general: error.message || 'Cannot connect to server. Please check your connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-screen">
      <div className="signup-background">
        <div className="signup-header">
          <h1 className="signup-title">RouteKL</h1>
          <p className="signup-subtitle">Join the Smart Logistics Network</p>
        </div>

        <div className="signup-form">
          <h2 className="signup-welcome">Create Account</h2>
          <p className="signup-instruction">Fill in your details to get started</p>

          {errors.general && (
            <div className="signup-error-general">
              <p>{errors.general}</p>
            </div>
          )}

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
            style={{ marginTop: 8 }}
          />

          <div className="signup-terms">
            <p>
              By signing up, you agree to our{' '}
              <span className="signup-terms-link">Terms of Service</span>
              {' '}and{' '}
              <span className="signup-terms-link">Privacy Policy</span>
            </p>
          </div>

          <div className="signup-divider">
            <div className="signup-divider-line"></div>
            <span className="signup-divider-text">OR</span>
            <div className="signup-divider-line"></div>
          </div>

          <div className="signup-login-container">
            <span className="signup-login-text">Already have an account? </span>
            <button 
              className="signup-login-link"
              onClick={onNavigateToLogin}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;

