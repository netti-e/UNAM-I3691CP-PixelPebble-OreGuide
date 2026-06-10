// [STATUS: NEW | Guard auth screens and redirect signed-in users]
// app/(auth)/_layout.tsx
import { Redirect, Stack, useSegments } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  if (loading) {
    return null;
  }

  // Allow authenticated users to view the welcome screen before tabs redirect
  const isOnWelcome = (segments as string[]).includes('welcome');
  if (user && !isOnWelcome) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}