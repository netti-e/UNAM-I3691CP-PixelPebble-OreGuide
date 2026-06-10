// app/(tabs)/map.tsx
// [STATUS: EDIT] — Refactored to a 50/50 split-screen layout for map and mine details

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Pickaxe, ChevronRight, MapPin, Layers, Cpu } from 'lucide-react-native';
import { MOCK_MINE_LOCATIONS } from '../../constants/mines';
import { THEME } from '../../constants/theme';
import { fetchAllOres, fetchMineLocations } from '../../services/firestore';
import { MineLocation, Ore } from '../../types/ore';

export default function MapScreen() {
  const router = useRouter();
  const [selectedMine, setSelectedMine] = useState<MineLocation | null>(null);
  const [mines, setMines] = useState<MineLocation[]>(MOCK_MINE_LOCATIONS);
  const [ores, setOres] = useState<Ore[]>([]);

  useEffect(() => {
    fetchMineLocations().then(data => { if (data.length > 0) setMines(data); }).catch(() => {});
    fetchAllOres().then(setOres).catch(() => {});
  }, []);

  // Approximate center of Namibia
  const initialRegion = {
    latitude: -22.5597,
    longitude: 17.0832,
    latitudeDelta: 10.0,
    longitudeDelta: 10.0,
  };

  const selectedOre = selectedMine
    ? ores.find(o => o.oreID === selectedMine.oreID) ?? null
    : null;

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <View style={selectedMine ? styles.mapHalf : styles.mapFull}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
          mapType="none"
          // If they tap the map background, deselect the mine to go full screen
          onPress={(e) => {
            if (e.nativeEvent.action !== 'marker-press') {
              setSelectedMine(null);
            }
          }}
        >
          <UrlTile
            urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          {mines.map((mine) => (
            <Marker
              key={mine.locationID}
              coordinate={mine.coordinates}
              onPress={() => setSelectedMine(mine)}
            >
              <View style={styles.markerContainer}>
                <View style={[
                  styles.markerBubble, 
                  selectedMine?.locationID === mine.locationID && { backgroundColor: THEME.colors.secondary }
                ]}>
                  <Pickaxe color={THEME.colors.surface} size={16} />
                </View>
                <View style={[
                  styles.markerTail,
                  selectedMine?.locationID === mine.locationID && { borderTopColor: THEME.colors.secondary }
                ]} />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Details Section (Bottom Half) */}
      {selectedMine && (
        <View style={styles.detailsHalf}>
          <ScrollView contentContainerStyle={styles.detailsScroll}>
            <View style={styles.detailsHeader}>
              <View>
                <Text style={styles.mineName}>{selectedMine.mineName}</Text>
                <View style={styles.accessRow}>
                  <MapPin size={14} color={THEME.colors.textMuted} />
                  <Text style={styles.accessText}>{selectedMine.accessPatterns}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.viewOreBtn}
                onPress={() => router.push({ pathname: '/modal', params: { oreID: selectedMine.oreID } })}
              >
                <Text style={styles.viewOreBtnText}>Profile</Text>
                <ChevronRight size={16} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {selectedOre ? (
              <View style={styles.orePreviewCard}>
                {selectedOre.imageSamples && selectedOre.imageSamples.length > 0 && (
                  <Image source={{ uri: selectedOre.imageSamples[0] }} style={styles.oreThumbnail} />
                )}
                <View style={styles.oreInfo}>
                  <Text style={styles.oreTitle}>{selectedOre.name}</Text>
                  
                  <View style={styles.propertyRow}>
                    <Layers size={14} color={THEME.colors.primary} />
                    <Text style={styles.propertyText} numberOfLines={1}>{selectedOre.color}</Text>
                  </View>
                  
                  <View style={styles.propertyRow}>
                    <Cpu size={14} color={THEME.colors.primary} />
                    <Text style={styles.propertyText}>Hardness: {selectedOre.hardness}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.orePreviewCard}>
                <Text style={styles.propertyText}>No associated ore data found.</Text>
              </View>
            )}
            
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    flexDirection: 'column',
  },
  mapFull: {
    flex: 1,
  },
  mapHalf: {
    flex: 1, // 50% height
  },
  detailsHalf: {
    flex: 1, // 50% height
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    marginTop: -20, // Overlap the map slightly
  },
  detailsScroll: {
    padding: THEME.spacing.lg,
  },
  // Marker Styles
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBubble: {
    backgroundColor: THEME.colors.primary,
    padding: 6,
    borderRadius: THEME.borderRadius.round,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  markerTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: THEME.colors.primary,
    marginTop: -1,
  },
  // Details Content
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.md,
  },
  mineName: {
    ...THEME.typography.h1,
    fontSize: 22,
    color: THEME.colors.text,
    marginBottom: 4,
  },
  accessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  accessText: {
    ...THEME.typography.body,
    fontSize: 13,
    color: THEME.colors.textMuted,
  },
  viewOreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
    gap: 4,
  },
  viewOreBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: THEME.spacing.md,
  },
  orePreviewCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.sm,
    gap: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  oreThumbnail: {
    width: 80,
    height: 80,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.border,
  },
  oreInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  oreTitle: {
    ...THEME.typography.h2,
    fontSize: 18,
    color: THEME.colors.text,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  propertyText: {
    ...THEME.typography.caption,
    fontSize: 13,
    color: THEME.colors.textMuted,
    flexShrink: 1,
  },
});