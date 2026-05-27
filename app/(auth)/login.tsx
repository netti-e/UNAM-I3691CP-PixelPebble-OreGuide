// app/(auth)/login.tsx

import { Link, router } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../constants/theme';
import { styles } from './login.styles';

export default function LoginScreen() {
  const handleLoginBypass = () => {
    router.replace('/(tabs)');
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
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={20} color={THEME.colors.textMuted} style={styles.icon} />
            <TextInput 
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={THEME.colors.textMuted}
              secureTextEntry
            />
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
          <TouchableOpacity style={styles.button} onPress={handleLoginBypass}>
            <Text style={styles.buttonText}>Log In</Text>
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