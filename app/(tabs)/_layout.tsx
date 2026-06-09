// app/(tabs)/_layout.tsx
// [STATUS: OPERATIONAL] — Core Tab Navigation Layout Architecture

import { Redirect, Tabs } from 'expo-router';
// UPDATED: Added GraduationCap to the icon bundle import
import { Camera, GraduationCap, Heart, Home, Map as MapIcon } from 'lucide-react-native';
import React from 'react';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../hooks/use-auth';

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          elevation: 4, // Clean drop shadow backdrop for Android
          shadowColor: '#000000', // Crisp layout depth for iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Scan Ore',
          tabBarIcon: ({ color }) => <Camera size={22} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <MapIcon size={22} color={color} />,
        }}
      />

      {/* NEW NAVIGATION NODE: Added the target Learn Hub Screen mapping */}
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <GraduationCap size={23} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Heart size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}