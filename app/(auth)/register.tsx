import { Link, router } from 'expo-router';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { THEME } from '../../constants/theme';
import { styles } from './register.styles';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // 🚀 BYPASS ACTIVE: Skipping inputs & Firebase to test the Welcome UI directly!
    try {
      setLoading(true);
      
      // Tiny artificial delay to show your beautiful loading spinner
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Jump straight to your Welcome screen layout!
      router.replace('/(auth)/welcome');
    } catch (error) {
      console.log("Bypass navigation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={THEME.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.inputContainer}>
          {/* Name Field Input Row */}
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={THEME.colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Email Field Input Row */}
          <View style={styles.inputWrapper}>
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

          {/* Password Field Input Row */}
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={THEME.colors.textMuted}
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              {secureText ? (
                <Eye size={20} color={THEME.colors.textMuted} />
              ) : (
                <EyeOff size={20} color={THEME.colors.textMuted} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
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