// app/(auth)/welcome.tsx

import { useRouter } from 'expo-router';
import { ArrowRight, ChevronLeft, Moon, Sun } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme } from '../../contexts/theme-context';
import { useAuth } from '../../hooks/use-auth';
import { getStyles } from '../../styles/auth/welcome.styles';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme, isDark, toggleDarkMode } = useAppTheme();
  const c = theme.colors;
  const styles = useMemo(() => getStyles(c), [c]);

  const userName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Explorer');

  const handleAdvance = () => router.replace('/(tabs)');
  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <ChevronLeft size={20} color={c.textMuted} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/welcome.icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.mainTitle}>
          From <Text style={styles.highlightText}>Rock</Text> to{' '}
          <Text style={styles.highlightText}>Resource</Text> in Seconds
        </Text>
        <Text style={styles.subTitle}>Welcome to OreGuide!</Text>

        <View style={styles.greetingRow}>
          <Text style={styles.greetingText}>Hello, "{userName}"!</Text>
          <Text style={styles.waveEmoji}>👋</Text>
        </View>

        <Text style={styles.introParagraph}>
          We're excited to have you join our community of geologists, students, and mineral
          enthusiasts exploring Namibia's rich geological heritage.
        </Text>

        {/* Feature pills */}
        <View style={styles.featurePill}>
          <Text style={styles.featureText}>Use your camera to capture and identify ore samples</Text>
        </View>
        <View style={styles.featurePill}>
          <Text style={styles.featureText}>Discover where ores are found across Namibia</Text>
        </View>
        <View style={styles.featurePill}>
          <Text style={styles.featureText}>Access educational content and save profiles offline</Text>
        </View>

        {/* Theme picker */}
        <View style={styles.themeSection}>
          <Text style={styles.themeSectionLabel}>Choose your theme</Text>
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[styles.themeOption, !isDark && styles.themeOptionActive]}
              onPress={() => { if (isDark) toggleDarkMode(); }}
              activeOpacity={0.8}
            >
              <Sun size={22} color={!isDark ? '#D35400' : c.textMuted} />
              <Text style={[styles.themeOptionLabel, !isDark && styles.themeOptionLabelActive]}>
                Light
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.themeOption, isDark && styles.themeOptionActive]}
              onPress={() => { if (!isDark) toggleDarkMode(); }}
              activeOpacity={0.8}
            >
              <Moon size={22} color={isDark ? '#D35400' : c.textMuted} />
              <Text style={[styles.themeOptionLabel, isDark && styles.themeOptionLabelActive]}>
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.getStartedButton} onPress={handleAdvance} activeOpacity={0.85}>
            <Text style={styles.getStartedText}>Get Started</Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
