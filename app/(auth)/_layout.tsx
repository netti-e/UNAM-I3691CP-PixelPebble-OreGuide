// [STATUS: EDIT — Restored layout route parameters and cleared extraneous UI snippets]
// app/(auth)/_layout.tsx

import { useAuth } from '@/hooks/use-auth';
import { Redirect, Stack, useSegments } from 'expo-router';

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