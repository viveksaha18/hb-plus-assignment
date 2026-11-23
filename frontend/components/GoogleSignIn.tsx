import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, Text, View } from 'react-native';
import { GoogleLogin } from '@react-oauth/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export function GoogleSignIn() {
  const { signIn } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nativeClientId =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
      : process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'hbplusauth',
  });
  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  };
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: nativeClientId ?? '',
      redirectUri,
      responseType: AuthSession.ResponseType.IdToken,
      scopes: ['openid', 'profile', 'email'],
      extraParams: { nonce: 'hbplus-' + Math.random().toString(36).slice(2) },
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === 'success') {
      setLoading(true);
      const idToken = response.params.id_token as string | undefined;
      if (!idToken) {
        setError('Google did not return an ID token.');
        setLoading(false);
        return;
      }
      signIn(idToken).catch((e) => setError(e.message)).finally(() => setLoading(false));
    } else if (response?.type === 'error') {
      setError(response.error?.description ?? 'Google Sign-In failed.');
    }
  }, [response]);

  if (Platform.OS === 'web') {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
    if (!webClientId) return <Text style={{ color: '#b42318' }}>Google Web OAuth is not configured.</Text>;
    return (
      <View style={{ width: '100%', alignItems: 'center' }}>
        {error ? <Text style={{ color: '#b42318', marginBottom: 12, textAlign: 'center' }}>{error}</Text> : null}
        {loading ? <ActivityIndicator /> : (
          <GoogleLogin
            onSuccess={(credential) => {
              setLoading(true);
              if (!credential.credential) {
                setError('Google did not return an ID token.');
                setLoading(false);
              } else {
                signIn(credential.credential).catch((e) => setError(e.message)).finally(() => setLoading(false));
              }
            }}
            onError={() => setError('Google Sign-In failed.')}
            useOneTap={false}
          />
        )}
      </View>
    );
  }

  return (
    <View style={{ width: '100%' }}>
      {error ? <Text style={{ color: '#b42318', marginBottom: 12, textAlign: 'center' }}>{error}</Text> : null}
      <Pressable
        disabled={!request || loading}
        onPress={() => {
          setError('');
          setLoading(true);
          promptAsync().catch((e) => setError(e.message)).finally(() => setLoading(false));
        }}
        style={({ pressed }) => ({
          opacity: pressed || loading ? 0.7 : 1,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#d0d5dd',
          borderRadius: 10,
          height: 52,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        })}
      >
        {loading ? <ActivityIndicator /> : <Text style={{ color: '#344054', fontWeight: '700' }}>Continue with Google</Text>}
      </Pressable>
    </View>
  );
}
