import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ProtectedApp } from './components/ProtectedApp';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {Platform.OS === 'web' ? (
        <GoogleOAuthProvider clientId={process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? 'placeholder'}>
          <AuthProvider>
            <ProtectedApp />
          </AuthProvider>
        </GoogleOAuthProvider>
      ) : (
        <AuthProvider>
          <ProtectedApp />
        </AuthProvider>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
