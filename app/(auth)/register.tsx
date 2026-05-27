// app/(auth)/register.tsx

import { Link, router } from 'expo-router';
import { ChevronLeft, Eye } from 'lucide-react-native';
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../constants/theme';
import { styles } from './register.styles';

export default function RegisterScreen() {
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
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={THEME.colors.textMuted}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={THEME.colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={THEME.colors.textMuted}
              secureTextEntry
            />
            <TouchableOpacity>
              <Eye size={20} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
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