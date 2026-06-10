// app/(auth)/welcome.tsx

import { useRouter } from 'expo-router';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../hooks/use-auth';
import { styles } from './welcome+styles';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

 const userName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Explorer');

  const handleAdvance = () => {
    router.replace('/(tabs)');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Header Element */}
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color="#555555" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Circular Holder Base Layout Container */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/welcome.icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Multi-Color Nested Branding Matrix */}
        <Text style={styles.mainTitle}>
          From <Text style={styles.highlightText}>Rock</Text> to{' '}
          <Text style={styles.highlightText}>Resource-in</Text> Seconds
        </Text>
        <Text style={styles.subTitle}>Welcome to OreGuide!</Text>
        
        <View style={styles.greetingRow}>
          <Text style={styles.greetingText}>Hello, "{userName}"!</Text>
          <Text style={styles.waveEmoji}>👋</Text>
        </View>

        <Text style={styles.introParagraph}>
          We're excited to have you join our community of geologists, students, and mineral enthusiasts exploring Namibia's rich geological heritage.
        </Text>

        {/* Core Highlight Feature Pills */}
        <View style={styles.featurePill}>
          <Text style={styles.featureText}>
            Use your camera to capture and identify ore samples
          </Text>
        </View>

        <View style={styles.featurePill}>
          <Text style={styles.featureText}>
            Discover where ores are found across Namibia
          </Text>
        </View>

        <View style={styles.featurePill}>
          <Text style={styles.featureText}>
            Access educational content and save profiles offline
          </Text>
        </View>

        {/* Get Started Action Row */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.getStartedButton} 
            onPress={handleAdvance}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <ArrowRight size={16} color="#000000" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}