// app/(tabs)/favorites.tsx
// [STATUS: EDIT] — Implemented interactive Favorites list using Firestore hook

import React, { useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookmarkMinus } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { useFavorites } from '../../hooks/use-favorites';
import { ALL_ORES } from '../../constants/ores';
import { OreCard } from '../../components/ore-card';
import { useAuth } from '../../hooks/use-auth';

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { favorites, loading } = useFavorites();

  const favoriteOres = useMemo(() => {
    return favorites
      .map(id => ALL_ORES.find(ore => ore.oreID === id))
      .filter(Boolean); // removes any undefined elements if data was deleted
  }, [favorites]);

  if (!user) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <BookmarkMinus size={48} color={THEME.colors.textMuted} />
        <Text style={styles.emptyTitle}>Not Logged In</Text>
        <Text style={styles.emptySubtitle}>Log in to save and view your favorite minerals offline.</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Minerals</Text>
        <Text style={styles.subtitle}>{favoriteOres.length} Items Collection</Text>
      </View>

      {favoriteOres.length === 0 ? (
        <View style={styles.emptyState}>
          <BookmarkMinus size={48} color={THEME.colors.border} />
          <Text style={styles.emptyTitle}>No saved minerals</Text>
          <Text style={styles.emptySubtitle}>Tap the heart icon on any ore profile to add it to your collection.</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteOres}
          keyExtractor={(item) => item!.oreID}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <OreCard 
              ore={item!} 
              onPress={() => router.push({ pathname: '/modal', params: { oreID: item!.oreID } })} 
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  header: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  title: {
    ...THEME.typography.h1,
    fontSize: 28,
    color: THEME.colors.text,
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  listContent: {
    padding: THEME.spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
    marginTop: -40, // visual center adjust
  },
  emptyTitle: {
    ...THEME.typography.h2,
    color: THEME.colors.textMuted,
    marginTop: THEME.spacing.md,
  },
  emptySubtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: THEME.spacing.sm,
  },
});