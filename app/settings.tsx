// app/settings.tsx

import { router, Stack } from 'expo-router';
import { ArrowLeft, Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../contexts/theme-context';

export default function SettingsScreen() {
  const { theme, isDark, toggleDarkMode } = useAppTheme();
  const c = theme.colors;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={c.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.text }]}>Settings</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Appearance section */}
      <View style={styles.body}>
        <Text style={[styles.sectionLabel, { color: c.textMuted }]}>APPEARANCE</Text>

        <View style={[styles.row, { backgroundColor: c.surface, borderColor: c.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: isDark ? 'rgba(211,84,0,0.15)' : 'rgba(211,84,0,0.1)' }]}>
            {isDark
              ? <Moon size={20} color={c.primary} />
              : <Sun size={20} color={c.primary} />
            }
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: c.text }]}>Dark Mode</Text>
            <Text style={[styles.rowSub, { color: c.textMuted }]}>
              {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleDarkMode}
            trackColor={{ false: c.border, true: c.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    padding: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 12,
    marginTop: 2,
  },
});
