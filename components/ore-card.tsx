// components/ore-card.tsx

import { ChevronRight, Cpu, Layers } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors } from '../constants/theme';
import { useAppTheme } from '../contexts/theme-context';
import { Ore } from '../types/ore';
import { formatChemicalFormula } from '../utils/format-fomula';

interface OreCardProps {
  ore: Ore;
  onPress: () => void;
}

const getStyles = (c: ThemeColors) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 16,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: c.border,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: c.text,
  },
  formulaBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(14,165,233,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  formulaText: {
    color: c.accent || '#0EA5E9',
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
    fontSize: 12,
    color: c.textMuted,
  },
  actionContainer: {
    paddingLeft: 8,
  },
});

export function OreCard({ ore, onPress }: OreCardProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => getStyles(theme.colors), [theme]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {ore.imageSamples && ore.imageSamples.length > 0 ? (
          <Image source={{ uri: ore.imageSamples[0] }} style={styles.thumbnail} />
        ) : (
          <View style={styles.thumbnail} />
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{ore.name}</Text>

        <View style={styles.formulaBadge}>
          <Text style={styles.formulaText}>{formatChemicalFormula(ore.chemicalComposition)}</Text>
        </View>

        <View style={styles.propertiesRow}>
          <View style={styles.propertyItem}>
            <Layers size={12} color={theme.colors.primary} />
            <Text style={styles.propertyText} numberOfLines={1}>{ore.color}</Text>
          </View>
          <View style={styles.propertyItem}>
            <Cpu size={12} color={theme.colors.primary} />
            <Text style={styles.propertyText}>Mohs: {ore.hardness}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <ChevronRight size={20} color={theme.colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}
