import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function AccountDetailsScreen() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return !isLoaded ? (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.message}>Loading...</Text>
    </View>
  ) : !isSignedIn ? (
    <Redirect href="/(auth)/sign-in" />
  ) : (
    <View style={styles.container}>
      <Text style={styles.header}>Account Details</Text>
      <View style={styles.card}>
        <Text style={styles.fieldLabel}>Name</Text>
        <Text style={styles.fieldValue}>
          {user?.firstName || 'N/A'} {user?.lastName || ''}
        </Text>
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Email</Text>
        <Text style={styles.fieldValue}>
          {user?.primaryEmailAddress?.emailAddress || 'N/A'}
        </Text>
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f5f7',
    padding: 20,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f5f7',
  },
  message: {
    fontSize: 18,
    color: '#333',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 20,
    color: '#333',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#777',
  },
  fieldValue: {
    fontSize: 18,
    color: '#000',
    marginTop: 5,
  },
  signOutButton: {
    backgroundColor: '#0081F1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
