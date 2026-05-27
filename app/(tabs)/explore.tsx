// app/(tabs)/explore.tsx

import { ChevronRight, Compass, HelpCircle, Shield, User } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../constants/theme';
import { styles } from './explore.styles';

export default function ExploreScreen() {
  const menuItems = [
    { id: 'profile', label: 'Account Profile', icon: User },
    { id: 'security', label: 'Privacy & Security', icon: Shield },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Manage your mineral database settings</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Compass size={22} color={THEME.colors.primary} />
            <Text style={styles.cardTitle}>Global Ore Registries</Text>
          </View>
          <Text style={styles.cardBody}>
            Online classification indexes, geographic mapping, and crowd-sourced mining vectors will appear here.
          </Text>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>Account Management</Text>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isLast = index === menuItems.length - 1;
            return (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]} 
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <IconComponent size={20} color={THEME.colors.textMuted} style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <ChevronRight size={18} color={THEME.colors.textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}