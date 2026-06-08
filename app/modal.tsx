// app/modal.tsx

import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Cpu, Layers, ShieldAlert, X } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ALL_ORES } from '../constants/ores';
import { THEME } from '../constants/theme';
import { formatChemicalFormula } from '../utils/format-fomula'; // Imported utility helper

export default function ModalScreen() {
  const { oreID } = useLocalSearchParams<{ oreID: string }>();

  const oreData = useMemo(() => {
    return ALL_ORES.find(item => item.oreID === oreID);
  }, [oreID]);

  if (!oreData) {
    return (
      <View style={[styles.container, styles.center]}>
        <ShieldAlert size={48} color="#EF4444" />
        <Text style={styles.errorText}>Specimen Profile Not Found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        
        <TouchableOpacity style={styles.closeActionChip} onPress={() => router.back()}>
          <X size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.identityRow}>
          <Text style={styles.oreTitle}>{oreData.name}</Text>
          <View style={styles.formulaBadge}>
            {/* Applied formatChemicalFormula helper to transform string typography */}
            <Text style={styles.formulaText}>
              {formatChemicalFormula(oreData.chemicalComposition)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>Physical Properties</Text>
        <View style={styles.propertiesGrid}>
          <View style={styles.propertyCard}>
            <Layers size={18} color={THEME.colors.primary} />
            <Text style={styles.propertyLabel}>Color Spec</Text>
            <Text style={styles.propertyValue}>{oreData.color}</Text>
          </View>

          <View style={styles.propertyCard}>
            <Cpu size={18} color={THEME.colors.primary} />
            <Text style={styles.propertyLabel}>Hardness (Mohs)</Text>
            <Text style={styles.propertyValue}>{oreData.hardness}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Economic & Industrial Uses</Text>
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{oreData.uses}</Text>
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
  closeActionChip: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 8,
    borderRadius: 20,
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
