// app/(tabs)/index.tsx

import { router } from 'expo-router';
import { LogOut, Search, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { THEME } from '../../constants/theme';
import { styles } from './index.styles';

export default function HomeScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>OreGuide</Text>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={() => setMenuOpen(!menuOpen)}
          activeOpacity={0.8}
        >
          <User size={22} color={THEME.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Dismiss Menu Backdrop Layer */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}

      {/* Absolute Context Dropdown Menu */}
      {menuOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout} activeOpacity={0.7}>
            <LogOut size={18} color="#EF4444" />
            <Text style={[styles.dropdownItemText, styles.logoutText]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Mock Search Functional Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBarPlaceholder}>
            <Search size={20} color={THEME.colors.textMuted} />
            <Text style={styles.searchPlaceholderText}>Search minerals by name...</Text>
          </View>
        </View>

        {/* Structural Filter Categories */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Filter by Chromatic Profile</Text>
          <View style={styles.chipContainer}>
            {['Metallic Grey', 'Azure Blue', 'Brass Yellow', 'Deep Red'].map((color) => (
              <View key={color} style={styles.chip}>
                <Text style={styles.chipText}>{color}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.filterSection, { marginTop: THEME.spacing.lg }]}>
          <Text style={styles.sectionTitle}>Filter by Elemental Matrix</Text>
          <View style={styles.chipContainer}>
            {['Copper (Cu)', 'Iron (Fe)', 'Gold (Au)', 'Sulfur (S)'].map((element) => (
              <View key={element} style={styles.chip}>
                <Text style={styles.chipText}>{element}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}