// Login Screen

import React, { useState } from 'react';
import { login } from '../services/api';
import { InputField, Button } from '../components';
import { validateEmail, validatePassword } from '../utils/validation';
import './LoginScreen.css';

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
    if (errors.email) {
      setErrors({ ...errors, email: '' });
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
  };

  const handleLogin = async () => {
    setErrors({ email: '', password: '', general: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await login(email.trim(), password);
      if (response.success) {
        onLogin(response.user);
      } else {
        setErrors({
          ...errors,
          general: response.error || 'Login failed',
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
    <div className="login-screen">
      <div className="login-background">
        <div className="login-header">
          <h1 className="login-title">RouteKL</h1>
          <p className="login-subtitle">Logistics Routing for Kuala Lumpur</p>
        </div>

        <div className="login-form">
          <h2 className="login-welcome">Welcome Back</h2>
          <p className="login-instruction">Sign in to continue</p>

          {errors.general && (
            <div className="login-error-general">
              <p>{errors.general}</p>
            </div>
          )}

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

          <button className="login-forgot-password">
            Forgot Password?
          </button>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
          />

          <div className="login-divider">
            <div className="login-divider-line"></div>
            <span className="login-divider-text">OR</span>
            <div className="login-divider-line"></div>
          </div>

          <div className="login-signup-container">
            <span className="login-signup-text">Don't have an account? </span>
            <button 
              className="login-signup-link"
              onClick={onNavigateToSignUp}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

