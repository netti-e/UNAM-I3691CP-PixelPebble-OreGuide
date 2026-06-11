// app/(tabs)/map.tsx
// [STATUS: EDIT] — Refactored to a 50/50 split-screen layout for map and mine details

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Pickaxe, ChevronRight, MapPin, Layers, Cpu } from 'lucide-react-native';
import { AppLoader } from '../../components/app-loader';
import { MOCK_MINE_LOCATIONS } from '../../constants/mines';
import { useAppTheme } from '../../contexts/theme-context';
import { fetchAllOres, fetchMineLocations } from '../../services/firestore';
import { MineLocation, Ore } from '../../types/ore';

export default function MapScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const THEME = theme;
  const [selectedMine, setSelectedMine] = useState<MineLocation | null>(null);
  const [mines, setMines] = useState<MineLocation[]>(MOCK_MINE_LOCATIONS);
  const [ores, setOres] = useState<Ore[]>([]);
  const [oresLoading, setOresLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: -22.0,
    longitude: 18.0,
    latitudeDelta: 22.0,
    longitudeDelta: 18.0,
  });

  useEffect(() => {
    fetchMineLocations().then(data => { if (data.length > 0) setMines(data); }).catch(() => {});
    fetchAllOres()
      .then(data => setOres(data))
      .catch(() => {})
      .finally(() => setOresLoading(false));
  }, []);

  const selectedOre = selectedMine
    ? ores.find(o => o.oreID === selectedMine.oreID) ?? null
    : null;

  return (
    <View style={[styles.container, { backgroundColor: THEME.colors.background }]}>
      {/* Map Section */}
      <View style={selectedMine ? styles.mapHalf : styles.mapFull}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
          mapType="none"
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

      {selectedMine && (
        <View style={[styles.detailsHalf, { backgroundColor: THEME.colors.surface }]}>
          <ScrollView contentContainerStyle={styles.detailsScroll}>
            <View style={styles.detailsHeader}>
              <View>
                <Text style={[styles.mineName, { color: THEME.colors.text }]}>{selectedMine.mineName}</Text>
                <View style={styles.accessRow}>
                  <MapPin size={14} color={THEME.colors.textMuted} />
                  <Text style={[styles.accessText, { color: THEME.colors.textMuted }]}>{selectedMine.accessPatterns}</Text>
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

            <View style={[styles.divider, { backgroundColor: THEME.colors.border }]} />

            {oresLoading ? (
              <View style={[styles.orePreviewCard, { backgroundColor: THEME.colors.background, borderColor: THEME.colors.border, justifyContent: 'center', alignItems: 'center' }]}>
                <AppLoader size={60} />
              </View>
            ) : selectedOre ? (
              <View style={[styles.orePreviewCard, { backgroundColor: THEME.colors.background, borderColor: THEME.colors.border }]}>
                {selectedOre.imageSamples && selectedOre.imageSamples.length > 0 ? (
                  <Image
                    source={{ uri: selectedOre.imageSamples[0] }}
                    style={[styles.oreThumbnail, { backgroundColor: THEME.colors.border }]}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.oreThumbnail, { backgroundColor: THEME.colors.border }]} />
                )}
                <View style={styles.oreInfo}>
                  <Text style={[styles.oreTitle, { color: THEME.colors.text }]}>{selectedOre.name}</Text>

                  <View style={styles.propertyRow}>
                    <Layers size={14} color={THEME.colors.primary} />
                    <Text style={[styles.propertyText, { color: THEME.colors.textMuted }]} numberOfLines={1}>{selectedOre.color}</Text>
                  </View>

                  <View style={styles.propertyRow}>
                    <Cpu size={14} color={THEME.colors.primary} />
                    <Text style={[styles.propertyText, { color: THEME.colors.textMuted }]}>Hardness: {selectedOre.hardness}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={[styles.orePreviewCard, { backgroundColor: THEME.colors.background, borderColor: THEME.colors.border }]}>
                <Text style={[styles.propertyText, { color: THEME.colors.textMuted }]}>No associated ore data found.</Text>
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
    flexDirection: 'column',
  },
  mapFull: {
    flex: 1,
  },
  mapHalf: {
    flex: 1,
  },
  detailsHalf: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    marginTop: -20,
  },
  detailsScroll: {
    padding: 24,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBubble: {
    backgroundColor: '#D35400',
    padding: 6,
    borderRadius: 9999,
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
    borderTopColor: '#D35400',
    marginTop: -1,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  mineName: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 4,
  },
  accessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  accessText: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 22,
  },
  viewOreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D35400',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  viewOreBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  orePreviewCard: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 8,
    gap: 12,
    borderWidth: 1,
  },
  oreThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  oreInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  oreTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  propertyText: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
    flexShrink: 1,
  },
});