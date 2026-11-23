import React from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { GoogleSignIn } from './GoogleSignIn';

export function ProtectedApp() {
  const { user, loading, logout } = useAuth();
  const { width } = useWindowDimensions();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1677ff" />
      </View>
    );
  }

  if (!user) {
    const compact = width < 760;
    return (
      <ScrollView contentContainerStyle={[styles.loginPage, compact && styles.loginPageCompact]}>
        <View style={[styles.loginCard, compact && styles.loginCardCompact]}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>HB</Text>
          </View>
          <Text style={styles.kicker}>HB PLUS WORKPLACE</Text>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.description}>
            Sign in securely with your official HB Plus Google account.
          </Text>
          <View style={styles.signInArea}>
            <GoogleSignIn />
          </View>
          <Text style={styles.domainHint}>Authorized domain: @hbplus.fit</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.dashboard} contentContainerStyle={styles.dashboardContent}>
      <View style={styles.topbar}>
        <View style={styles.brandRow}>
          <View style={styles.smallBrandMark}><Text style={styles.smallBrandText}>HB</Text></View>
          <Text style={styles.brandName}>HB Plus</Text>
        </View>
        <Pressable
          onPress={() => logout().catch(() => undefined)}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.dashboardBody}>
        <Text style={styles.dashboardKicker}>ACCOUNT OVERVIEW</Text>
        <Text style={styles.dashboardTitle}>Welcome, {user.name}</Text>

        <View style={[styles.profileCard, width < 760 && styles.profileCardCompact]}>
          <View style={styles.avatarWrap}>
            {user.profile_picture ? (
              <Image source={{ uri: user.profile_picture }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>{user.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <View style={styles.rolePill}><Text style={styles.roleText}>{user.role}</Text></View>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>OFFICIAL EMAIL</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>ROLE</Text>
            <Text style={styles.infoValue}>{user.role}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>ACCOUNT STATUS</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.infoValue}>Active</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, minHeight: 600, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f9fc' },
  loginPage: { flexGrow: 1, minHeight: 600, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f7fb', padding: 24 },
  loginPageCompact: { padding: 16 },
  loginCard: { width: '100%', maxWidth: 440, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#e8edf4', alignItems: 'center', padding: 48, ...Platform.select({ web: { boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)' }, default: { elevation: 4 } }) },
  loginCardCompact: { padding: 28 },
  brandMark: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#1677ff', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  brandMarkText: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: 1 },
  kicker: { color: '#667085', fontSize: 12, fontWeight: '700', letterSpacing: 1.6, marginBottom: 10 },
  welcome: { color: '#101828', fontSize: 34, fontWeight: '800', marginBottom: 12 },
  description: { color: '#667085', fontSize: 15, lineHeight: 23, textAlign: 'center', maxWidth: 320, marginBottom: 28 },
  signInArea: { width: '100%', minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  domainHint: { color: '#98a2b3', fontSize: 12, marginTop: 18 },
  dashboard: { flex: 1, backgroundColor: '#f7f9fc' },
  dashboardContent: { minHeight: 600 },
  topbar: { height: 72, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eaecf0', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 32 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  smallBrandMark: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#1677ff', alignItems: 'center', justifyContent: 'center' },
  smallBrandText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  brandName: { color: '#101828', fontSize: 18, fontWeight: '800' },
  logoutButton: { height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#d0d5dd', paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  pressed: { opacity: 0.7 },
  logoutText: { color: '#344054', fontWeight: '700' },
  dashboardBody: { width: '100%', maxWidth: 1120, alignSelf: 'center', padding: 40 },
  dashboardKicker: { color: '#667085', fontSize: 12, fontWeight: '700', letterSpacing: 1.4, marginBottom: 8 },
  dashboardTitle: { color: '#101828', fontSize: 34, fontWeight: '800', marginBottom: 28 },
  profileCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eaecf0', borderRadius: 16, padding: 24, flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 16 },
  profileCardCompact: { alignItems: 'flex-start' },
  avatarWrap: { width: 76, height: 76 },
  avatar: { width: 76, height: 76, borderRadius: 38 },
  avatarFallback: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#e6efff', alignItems: 'center', justifyContent: 'center' },
  avatarFallbackText: { color: '#1677ff', fontSize: 28, fontWeight: '800' },
  profileDetails: { flex: 1 },
  profileName: { color: '#101828', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  profileEmail: { color: '#667085', fontSize: 14, marginBottom: 10 },
  rolePill: { alignSelf: 'flex-start', backgroundColor: '#ecfdf3', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  roleText: { color: '#027a48', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  infoCard: { flexGrow: 1, flexBasis: 280, minHeight: 112, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eaecf0', borderRadius: 16, padding: 20, justifyContent: 'center' },
  infoLabel: { color: '#98a2b3', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
  infoValue: { color: '#344054', fontSize: 15, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#12b76a' },
});
