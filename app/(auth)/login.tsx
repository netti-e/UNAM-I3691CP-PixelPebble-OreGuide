// app/(auth)/login.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
// @ts-ignore
import { getReactNativePersistence, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { Check, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../hooks/use-auth';
import { auth } from '../../services/firebase';
import { styles } from './login.styles';

const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

export default function LoginScreen() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Verification Failed', 'Please fill in both Email and Password fields.');
      return;
    }

    setLoading(true);
    try {
      await setPersistence(auth, rememberMe ? getReactNativePersistence(AsyncStorage) : inMemoryPersistence);
      await login({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (error: any) {
      let errorMessage = 'An error occurred during login. Please try again.';
      if (error && error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'The email address is invalid.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This user account has been disabled.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = 'Incorrect email or password.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Please try again later.';
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error && error.message) {
        errorMessage = error.message;
      }
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      router.replace('/(tabs)');
    } catch (error: any) {
      // Ignore if user cancels the prompt
      if (error && error.message && error.message.indexOf('cancelled') !== -1) {
        return;
      }
      Alert.alert('Google Sign-In Failed', error.message || 'An error occurred during Google Sign-In.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <View style={styles.content}>
        <Text style={styles.title}>LOGIN</Text>
        
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color={THEME.colors.textMuted} style={styles.icon} />
            <TextInput 
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={THEME.colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={20} color={THEME.colors.textMuted} style={styles.icon} />
            <TextInput 
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={THEME.colors.textMuted}
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)} style={{ padding: 4 }}>
              {secureText ? (
                <Eye size={20} color={THEME.colors.textMuted} />
              ) : (
                <EyeOff size={20} color={THEME.colors.textMuted} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Check size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Visual Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: THEME.spacing.lg }}>
          <View style={{ flex: 1, height: 1, backgroundColor: THEME.colors.border }} />
          <Text style={{ marginHorizontal: THEME.spacing.md, color: THEME.colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>
            OR CONTINUE WITH
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: THEME.colors.border }} />
        </View>

        <TouchableOpacity 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: THEME.colors.surface, 
            borderWidth: 1, 
            borderColor: THEME.colors.border, 
            borderRadius: THEME.borderRadius.xl, 
            height: 56, 
            gap: 10,
            opacity: loading ? 0.7 : 1
          }}
          onPress={handleGoogleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={THEME.colors.primary} size="small" />
          ) : (
            <>
              <GoogleIcon size={20} />
              <Text style={{ color: THEME.colors.text, fontWeight: '700', fontSize: 14 }}>
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </View>
  );
}