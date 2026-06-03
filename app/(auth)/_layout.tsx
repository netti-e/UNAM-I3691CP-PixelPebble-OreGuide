// [STATUS: NEW | Guard auth screens and redirect signed-in users]
// app/(auth)/_layout.tsx
import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}