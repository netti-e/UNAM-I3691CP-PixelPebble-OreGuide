// app/modal.tsx
// [STATUS: EDIT] — Integrated useFavorites hook and added heart toggle button

import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Cpu, Layers, ShieldAlert, X, Heart } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppLoader } from '../components/app-loader';
import { THEME } from '../constants/theme';
import { useAppTheme } from '../contexts/theme-context';
import { fetchAllOres } from '../services/firestore';
import { Ore } from '../types/ore';
import { formatChemicalFormula } from '../utils/format-fomula';
import { useFavorites } from '../hooks/use-favorites';
import { useAuth } from '../hooks/use-auth';

export default function ModalScreen() {
  const { oreID } = useLocalSearchParams<{ oreID: string }>();
  const { theme } = useAppTheme();
  const THEME = theme;
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, loading } = useFavorites();

  const [oreData, setOreData] = useState<Ore | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchAllOres()
      .then(ores => setOreData(ores.find(o => o.oreID === oreID) ?? null))
      .catch(() => setOreData(null))
      .finally(() => setFetching(false));
  }, [oreID]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert("Please log in to save favorites.");
      return;
    }
    if (!oreID) return;
    
    try {
      if (isFavorite(oreID)) {
        await removeFavorite(oreID);
      } else {
        await addFavorite(oreID);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      alert("Failed to update favorites. Please try again.");
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: THEME.colors.background }]}>
        <AppLoader size={90} />
      </View>
    );
  }

  if (!oreData) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: THEME.colors.background }]}>
        <ShieldAlert size={48} color="#EF4444" />
        <Text style={[styles.errorText, { color: THEME.colors.textMuted }]}>Specimen Profile Not Found</Text>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: THEME.colors.primary }]} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isSaved = isFavorite(oreID as string);

  return (
    <View style={[styles.container, { backgroundColor: THEME.colors.background }]}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      
      <View style={styles.imageContainer}>
        {oreData.imageSamples && oreData.imageSamples.length > 0 ? (
          <Image 
            source={{ uri: oreData.imageSamples[0] }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.heroImage, styles.fallbackImageBg]} />
        )}
        
        <View style={styles.headerActionsRow}>
          <TouchableOpacity 
            style={styles.actionChip} 
            onPress={handleFavoriteToggle}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Heart 
                size={20} 
                color={isSaved ? THEME.colors.primary : "#FFF"} 
                fill={isSaved ? THEME.colors.primary : "transparent"} 
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionChip} onPress={() => router.back()}>
            <X size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.identityRow, { backgroundColor: THEME.colors.background }]}>
          <Text style={styles.oreTitle}>{oreData.name}</Text>
          <View style={styles.formulaBadge}>
            <Text style={styles.formulaText}>
              {formatChemicalFormula(oreData.chemicalComposition)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={[styles.sectionHeading, { color: THEME.colors.textMuted }]}>Physical Properties</Text>
        <View style={styles.propertiesGrid}>
          <View style={[styles.propertyCard, { backgroundColor: THEME.colors.surface, borderColor: THEME.colors.border }]}>
            <Layers size={18} color={THEME.colors.primary} />
            <Text style={[styles.propertyLabel, { color: THEME.colors.textMuted }]}>Color Spec</Text>
            <Text style={[styles.propertyValue, { color: THEME.colors.text }]}>{oreData.color}</Text>
          </View>

          <View style={[styles.propertyCard, { backgroundColor: THEME.colors.surface, borderColor: THEME.colors.border }]}>
            <Cpu size={18} color={THEME.colors.primary} />
            <Text style={[styles.propertyLabel, { color: THEME.colors.textMuted }]}>Hardness (Mohs)</Text>
            <Text style={[styles.propertyValue, { color: THEME.colors.text }]}>{oreData.hardness}</Text>
          </View>
        </View>

        <Text style={[styles.sectionHeading, { color: THEME.colors.textMuted }]}>Economic & Industrial Uses</Text>
        <View style={[styles.descriptionBox, { backgroundColor: THEME.colors.surface, borderColor: THEME.colors.border }]}>
          <Text style={[styles.descriptionText, { color: THEME.colors.text }]}>{oreData.uses}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  imageContainer: {
    width: '100%',
    height: 260,
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  fallbackImageBg: {
    backgroundColor: THEME.colors.border,
  },
  headerActionsRow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionChip: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  identityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  oreTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: THEME.colors.text,
    flex: 1,
  },
  formulaBadge: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  formulaText: {
    color: THEME.colors.accent || '#0EA5E9',
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: 20,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  propertiesGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  propertyCard: {
    flex: 1,
    backgroundColor: THEME.colors.surface || 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  propertyLabel: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  propertyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.text,
  },
  descriptionBox: {
    backgroundColor: THEME.colors.surface || 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 12,
    padding: 16,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: THEME.colors.text,
  },
  errorText: {
    fontSize: 16,
    color: THEME.colors.textMuted,
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
