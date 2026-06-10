import { Redirect, Tabs } from 'expo-router';
import { Camera, Heart, Home, Map as MapIcon } from 'lucide-react-native';
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
        // Set the background color here
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5', // Optional: adds a subtle separator
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Scan Ore',
          tabBarIcon: ({ color }) => <Camera size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <MapIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}