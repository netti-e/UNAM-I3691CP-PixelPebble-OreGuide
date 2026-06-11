// [STATUS: EDIT — Swapped custom OTP verification states with native client-side Firebase Link dispatch]
// app/(auth)/forgot-password.tsx

import { router } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ArrowLeft, Check } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { THEME } from '../../constants/theme';
import { auth } from '../../services/firebase';

type ResetStep = 'EMAIL' | 'SUCCESS';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<ResetStep>('EMAIL');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // TRIGGER NATIVE FIREBASE LINKS DISPATCH
  const handleSendResetLink = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      Alert.alert('Invalid Entry', 'Please enter a valid email address.');
      return;
    }
    
    setLoading(true);
    try {
      // Direct communication with Firebase Client SDK
      await sendPasswordResetEmail(auth, trimmedEmail);
      
      // Advance immediately to the notification view state
      setStep('SUCCESS');
    } catch (error: any) {
      let errorMessage = 'Could not process password reset request.';
      
      if (error && error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'The email address is improperly formatted.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'There is no registered account corresponding to this email address.';
            break;
          default:
            errorMessage = error.message;
        }
      }
      Alert.alert('Reset Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {step !== 'SUCCESS' && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={THEME.colors.text} />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        {/* STEP 1: COLLECT EMAIL TARGET */}
        {step === 'EMAIL' && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address below. We will dispatch a secure link to reset your credentials (be sure to check your Spam folder).
            </Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="user@example.com"
                placeholderTextColor={THEME.colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleSendResetLink} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: LINK DISPATCH SUCCESS BANNER */}
        {step === 'SUCCESS' && (
          <View style={styles.stepContainerCentered}>
            <View style={styles.successCard}>
              <View style={styles.checkmarkCircle}>
                <Check size={40} color="#000000" strokeWidth={2.5} />
              </View>
              <Text style={styles.successTitle}>Reset Link Dispatched</Text>
              <Text style={styles.successBody}>
                A secure password recovery hyperlink has been transmitted to <Text style={styles.boldText}>{email}</Text>. Check your Inbox and Spam folders.
              </Text>
            </View>

            <TouchableOpacity style={styles.getStartedButton} onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.getStartedText}>Back to Login</Text>
              <View style={styles.arrowCircle}>
                <Text style={styles.arrowText}>➔</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 24,
    zIndex: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 999,
  },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  stepContainer: { width: '100%' },
  stepContainerCentered: { width: '100%', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#000000', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', lineHeight: 20, marginBottom: 40, paddingHorizontal: 10 },
  boldText: { fontWeight: '600', color: '#1A1A1A' },
  inputWrapper: { backgroundColor: '#F5F5F5', borderRadius: 24, height: 60, paddingHorizontal: 24, justifyContent: 'center', marginBottom: 24 },
  inputLabel: { fontSize: 11, color: '#7F8C8D', marginBottom: 2, fontWeight: '500' },
  input: { fontSize: 15, color: '#1A1A1A', padding: 0, height: 24 },
  primaryButton: { backgroundColor: THEME.colors.primary, borderRadius: 24, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 16, minWidth: 160, paddingHorizontal: 24, alignSelf: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  successCard: { width: width * 0.82, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center', shadowColor: THEME.colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 30, elevation: 12, borderWidth: 1, borderColor: 'rgba(211, 84, 0, 0.08)', marginBottom: 40 },
  checkmarkCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#000000', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', color: '#000000', marginBottom: 12 },
  successBody: { fontSize: 13, color: '#7F8C8D', textAlign: 'center', lineHeight: 18, paddingHorizontal: 4 },
  getStartedButton: { backgroundColor: THEME.colors.primary, borderRadius: 24, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingLeft: 24, paddingRight: 6, gap: 12 },
  getStartedText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  arrowCircle: { backgroundColor: '#FFFFFF', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  arrowText: { color: THEME.colors.primary, fontSize: 14, fontWeight: 'bold' },
});