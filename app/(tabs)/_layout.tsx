import { Tabs } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Camera, GraduationCap, Heart, Map } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { THEME } from '../../constants/theme';

const AnimatedHomeIcon = ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
  const animationRef = useRef<LottieView>(null);
  
  // FIX: Use ReturnType to get the correct type regardless of environment
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (focused) {
      // Play immediately on focus
      animationRef.current?.play();

      // Clear any existing interval before starting a new one
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Set the interval
      intervalRef.current = setInterval(() => {
        animationRef.current?.play();
      }, 4000);
    } else {
      // Clear interval and reset animation when tab is not focused
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      animationRef.current?.reset();
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [focused]);

  return (
    <LottieView
      ref={animationRef}
      source={require('@/assets/animations/home-icon.json')}
      style={{ width: size + 15, height: size + 15 }}
      autoPlay={false}
      loop={false}
      colorFilters={[{ keypath: '*', color: color }]} 
    />
  );
};

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
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: (props) => <AnimatedHomeIcon {...props} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <Camera size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mines Map',
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
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