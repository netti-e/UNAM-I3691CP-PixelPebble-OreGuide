// app/(tabs)/favorites.tsx

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../../constants/theme';

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={THEME.typography.h2}>Saved Minerals</Text>
      <Text style={[THEME.typography.body, { color: THEME.colors.textMuted, marginTop: THEME.spacing.sm }]}>
        Offline Saved Collection Shell
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});