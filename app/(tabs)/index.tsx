import { router } from 'expo-router';
import { Bell, Bookmark, BookOpen, Camera, LogOut, Map as MapIcon, Search, User } from 'lucide-react-native';
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

  const recentScans = [
    { id: '1', name: 'Gold Ore', mine: 'Otjikoto Mine' },
    { id: '2', name: 'Copper Ore', mine: 'Tsumeb Mine' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>OreGuide</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <Bell size={22} color={THEME.colors.text} />
          <TouchableOpacity style={styles.profileButton} onPress={() => setMenuOpen(!menuOpen)}>
            <User size={22} color={THEME.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      {menuOpen && <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}><View style={styles.backdrop} /></TouchableWithoutFeedback>}
      {menuOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
            <LogOut size={18} color="#EF4444" />
            <Text style={[styles.dropdownItemText, styles.logoutText]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBarPlaceholder}>
            <Search size={20} color={THEME.colors.textMuted} />
            <Text style={styles.searchPlaceholderText}>Search minerals by name...</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.actionGrid}>
          {[
            { icon: Camera, label: 'Scan Ore' },
            { icon: MapIcon, label: 'Explore Map' },
            { icon: BookOpen, label: 'Learn' },
            { icon: Bookmark, label: 'Saved Ores' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.actionCard}>
              <item.icon size={24} color={THEME.colors.primary} />
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Scans */}
        <Text style={styles.sectionTitle}>RECENT SCANS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {recentScans.map((item) => (
            <View key={item.id} style={styles.scanCard}>
              <View style={styles.scanImagePlaceholder} />
              <Text style={styles.scanName}>{item.name}</Text>
              <Text style={styles.scanMine}>{item.mine}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Heritage Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Namibia's Mineral Heritage</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}