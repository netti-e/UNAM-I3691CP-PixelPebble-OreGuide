// app/(tabs)/favorites.tsx

import { BookmarkMinus } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppLoader } from '../../components/app-loader';
import { OreCard } from '../../components/ore-card';
import { THEME } from '../../constants/theme';
import { useAppTheme } from '../../contexts/theme-context';
import { useAuth } from '../../hooks/use-auth';
import { useFavorites } from '../../hooks/use-favorites';
import { fetchAllOres } from '../../services/firestore';
import { Ore } from '../../types/ore';

export default function FavoritesScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const c = theme.colors;
  const { user } = useAuth();
  const { favorites, loading: favLoading } = useFavorites();
  const [allOres, setAllOres] = useState<Ore[]>([]);
  const [oresLoading, setOresLoading] = useState(true);

  useEffect(() => {
    fetchAllOres()
      .then(setAllOres)
      .catch(() => {})
      .finally(() => setOresLoading(false));
  }, []);

  const favoriteOres = useMemo(() => {
    return favorites
      .map(id => allOres.find(ore => ore.oreID === id))
      .filter(Boolean) as Ore[];
  }, [favorites, allOres]);

  if (!user) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: c.background }]}>
        <BookmarkMinus size={48} color={c.textMuted} />
        <Text style={[styles.emptyTitle, { color: c.textMuted }]}>Not Logged In</Text>
        <Text style={[styles.emptySubtitle, { color: c.textMuted }]}>Log in to save and view your favorite minerals.</Text>
      </SafeAreaView>
    );
  }

  if (favLoading || oresLoading) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: c.background }]}>
        <AppLoader size={80} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <Text style={[styles.title, { color: c.text }]}>Saved Minerals</Text>
        <Text style={[styles.subtitle, { color: c.primary }]}>{favoriteOres.length} item{favoriteOres.length !== 1 ? 's' : ''} saved</Text>
      </View>

      {favoriteOres.length === 0 ? (
        <View style={styles.emptyState}>
          <BookmarkMinus size={48} color={c.border} />
          <Text style={[styles.emptyTitle, { color: c.textMuted }]}>No saved minerals</Text>
          <Text style={[styles.emptySubtitle, { color: c.textMuted }]}>Tap the heart icon on any ore profile to add it to your collection.</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteOres}
          keyExtractor={(item) => item.oreID}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <OreCard
              ore={item}
              onPress={() => router.push({ pathname: '/modal', params: { oreID: item.oreID } })}
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
    marginTop: -40,
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
