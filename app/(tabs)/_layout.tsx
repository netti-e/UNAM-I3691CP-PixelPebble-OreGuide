import { Tabs } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Camera, GraduationCap, Heart, Map } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { useAppTheme } from '../../contexts/theme-context';

// Module-level ref so the tabPress listener can trigger the animation
// without prop drilling through the tabBarIcon render prop
let triggerHomePlay: (() => void) | null = null;

const AnimatedHomeIcon = ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    triggerHomePlay = () => animationRef.current?.play();
    return () => { triggerHomePlay = null; };
  }, []);

  useEffect(() => {
    if (focused) {
      animationRef.current?.play();
    } else {
      animationRef.current?.reset();
    }
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
  const { theme } = useAppTheme();
  const c = theme.colors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopWidth: 1,
          borderTopColor: c.border,
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
        listeners={{
          tabPress: () => { triggerHomePlay?.(); },
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