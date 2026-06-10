// components/ore-card.tsx
// [STATUS: NEW] — Reusable component for displaying an ore summary in lists

import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, Layers, Cpu } from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { Ore } from '../types/ore';
import { formatChemicalFormula } from '../utils/format-fomula';

interface OreCardProps {
  ore: Ore;
  onPress: () => void;
}

export function OreCard({ ore, onPress }: OreCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {ore.imageSamples && ore.imageSamples.length > 0 ? (
          <Image source={{ uri: ore.imageSamples[0] }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.fallbackImage]} />
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{ore.name}</Text>
        
        <View style={styles.formulaBadge}>
          <Text style={styles.formulaText}>{formatChemicalFormula(ore.chemicalComposition)}</Text>
        </View>

        <View style={styles.propertiesRow}>
          <View style={styles.propertyItem}>
            <Layers size={12} color={THEME.colors.primary} />
            <Text style={styles.propertyText} numberOfLines={1}>{ore.color}</Text>
          </View>
          <View style={styles.propertyItem}>
            <Cpu size={12} color={THEME.colors.primary} />
            <Text style={styles.propertyText}>Mohs: {ore.hardness}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <ChevronRight size={20} color={THEME.colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: THEME.spacing.md,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: THEME.borderRadius.md,
  },
  fallbackImage: {
    backgroundColor: THEME.colors.border,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    ...THEME.typography.h2,
    fontSize: 16,
    color: THEME.colors.text,
  },
  formulaBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  formulaText: {
    color: THEME.colors.accent || '#0EA5E9',
    fontWeight: '600',
    fontSize: 11,
  },
  propertiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  propertyText: {
    ...THEME.typography.caption,
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  actionContainer: {
    paddingLeft: THEME.spacing.sm,
  },
});
