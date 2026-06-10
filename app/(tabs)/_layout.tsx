// [STATUS: EDIT] — Changed Home icon to Home layout, renamed Saved tab to Favorites, and updated its icon to a Heart

import { Tabs } from 'expo-router';
import React from 'react';
import { THEME } from '../../constants/theme';
// Imported Home and Heart, removed Search
import { Camera, GraduationCap, Heart, Home, Map } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.textMuted,
        tabBarStyle: {
          backgroundColor: THEME.colors.surface,
          borderTopWidth: 1,
          borderTopColor: THEME.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      {/* 1. Home Screen (ICON CHANGED TO HOME) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      {/* 2. Scan Ore Screen */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <Camera size={size} color={color} />,
        }}
      />

      {/* 3. Map View Screen */}
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mines Map',
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />

      {/* 4. Favorites Screen (RENAMED & ICON CHANGED TO HEART) */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites', // Changed from 'Saved'
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />

      {/* 5. Learn Screen */}
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <GraduationCap size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}