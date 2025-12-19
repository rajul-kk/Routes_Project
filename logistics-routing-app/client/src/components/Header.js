// Header component with user greeting and logout

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({ title = 'RouteKL', userName, onLogout, showLogout = true }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>{title}</Text>
        {userName && (
          <Text style={styles.headerSubtitle}>Hi, {userName}</Text>
        )}
      </View>
      {showLogout && onLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1C2A3A',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#FF375F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Header;

