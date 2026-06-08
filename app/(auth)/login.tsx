// app/(auth)/login.tsx

import { Link, router } from 'expo-router';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../hooks/use-auth';
import { styles } from './login.styles';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Verification Failed', 'Please fill in both Email and Password fields.');
      return;
    }

    setLoading(true);
    try {
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

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
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
            <View style={styles.rememberMeContainer}>
              <View style={styles.checkbox} />
              <Text style={styles.rememberMeText}>Remember me</Text>
            </View>
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
      </View>

      <Image 
        source={require('../../assets/images/background.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
    </KeyboardAvoidingView>
  );
}