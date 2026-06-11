// app/(tabs)/map.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity,
  Dimensions, Platform, StatusBar,
} from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { X, MapPin, Droplets, Shield, ArrowRight, Mountain } from 'lucide-react-native';
import { AppLoader } from '../../components/app-loader';
import { MOCK_MINE_LOCATIONS } from '../../constants/mines';
import { useAppTheme } from '../../contexts/theme-context';
import { fetchAllOres, fetchMineLocations } from '../../services/firestore';
import { MineLocation, Ore } from '../../types/ore';

const { height: SCREEN_H } = Dimensions.get('window');
const STATUS_H = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
const GEOAPIFY_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY ?? '';

function buildMapHTML(apiKey: string): string {
  const hasKey = apiKey.length > 0 && apiKey !== 'YOUR_GEOAPIFY_KEY_HERE';
  const tileUrl = hasKey
    ? `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #f0ede8; }
    .leaflet-control-zoom { border: none !important; box-shadow: 0 2px 12px rgba(0,0,0,0.15) !important; border-radius: 12px !important; overflow: hidden; }
    .leaflet-control-zoom a { background: #fff !important; color: #333 !important; border: none !important; font-size: 16px !important; line-height: 30px !important; width: 36px !important; height: 36px !important; }
    .leaflet-control-zoom a:hover { background: #f5f5f5 !important; }
    @keyframes pulse {
      0%   { transform: scale(1);   opacity: 0.6; }
      70%  { transform: scale(2.2); opacity: 0; }
      100% { transform: scale(1);   opacity: 0; }
    }
    .pin-pulse {
      position: absolute;
      width: 28px; height: 28px;
      border-radius: 50%;
      background: rgba(30, 127, 216, 0.4);
      top: 4px; left: 4px;
      animation: pulse 1.6s ease-out infinite;
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      maxZoom: 19
    }).setView([-22.0, 18.0], 5);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('${tileUrl}', {
      maxZoom: 19,
      subdomains: ['a','b','c']
    }).addTo(map);

    var markers = {};
    var selectedId = null;

    function buildIcon(locationID) {
      var isSelected = locationID === selectedId;
      var fill = isSelected ? '#1E7FD8' : '#D35400';
      var ring = isSelected ? '<div class="pin-pulse"></div>' : '';
      var html =
        '<div style="position:relative;width:36px;height:46px;">' +
          ring +
          '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46" style="filter:drop-shadow(0 3px 5px rgba(0,0,0,0.30))">' +
            '<ellipse cx="18" cy="43" rx="7" ry="3" fill="rgba(0,0,0,0.18)"/>' +
            '<path d="M18 2 C9.2 2 2 9.2 2 18 C2 29.5 18 44 18 44 C18 44 34 29.5 34 18 C34 9.2 26.8 2 18 2Z" fill="' + fill + '" stroke="#fff" stroke-width="2.5"/>' +
            '<circle cx="18" cy="18" r="7" fill="rgba(255,255,255,0.95)"/>' +
            '<circle cx="18" cy="18" r="3.5" fill="' + fill + '"/>' +
          '</svg>' +
        '</div>';
      return L.divIcon({
        html: html,
        iconSize: [36, 46],
        iconAnchor: [18, 46],
        className: ''
      });
    }

    function initMap(mines) {
      Object.values(markers).forEach(function(m) { m.remove(); });
      markers = {};
      mines.forEach(function(mine) {
        if (!mine.coordinates || mine.coordinates.latitude == null) return;
        var latlng = [mine.coordinates.latitude, mine.coordinates.longitude];
        var marker = L.marker(latlng, { icon: buildIcon(mine.locationID) }).addTo(map);
        marker.on('click', function(e) {
          L.DomEvent.stopPropagation(e);
          selectedId = mine.locationID;
          Object.keys(markers).forEach(function(id) {
            markers[id].setIcon(buildIcon(id));
          });
          window.ReactNativeWebView.postMessage(JSON.stringify({ locationID: mine.locationID }));
        });
        markers[mine.locationID] = marker;
      });
    }

    map.on('click', function() {
      selectedId = null;
      Object.keys(markers).forEach(function(id) {
        markers[id].setIcon(buildIcon(id));
      });
      window.ReactNativeWebView.postMessage(JSON.stringify({ locationID: null }));
    });
  </script>
</body>
</html>`;
}

export default function MapScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const c = theme.colors;
  const webviewRef = useRef<WebView>(null);
  const [selectedMine, setSelectedMine] = useState<MineLocation | null>(null);
  const [mines, setMines] = useState<MineLocation[]>(MOCK_MINE_LOCATIONS);
  const [ores, setOres] = useState<Ore[]>([]);
  const [oresLoading, setOresLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

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

  const handleMapLoad = () => {
    setMapReady(true);
    webviewRef.current?.injectJavaScript(`initMap(${JSON.stringify(mines)}); true;`);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const { locationID } = JSON.parse(event.nativeEvent.data) as { locationID: string | null };
      setSelectedMine(locationID == null ? null : (mines.find(m => m.locationID === locationID) ?? null));
    } catch {}
  };

  useEffect(() => {
    if (mapReady) {
      webviewRef.current?.injectJavaScript(`initMap(${JSON.stringify(mines)}); true;`);
    }
  }, [mines]);

  const heroImage = selectedOre?.imageSamples?.[0] ?? null;

  return (
    <View style={styles.root}>
      {/* Full-screen map */}
      <WebView
        ref={webviewRef}
        style={StyleSheet.absoluteFillObject}
        originWhitelist={['*']}
        source={{ html: buildMapHTML(GEOAPIFY_KEY) }}
        onLoadEnd={handleMapLoad}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        overScrollMode="never"
        bounces={false}
      />

      {/* Floating mine count badge */}
      {!selectedMine && (
        <View style={[styles.badge, { backgroundColor: c.surface }]}>
          <Mountain size={13} color={c.primary} />
          <Text style={[styles.badgeText, { color: c.text }]}>{mines.length} mines</Text>
        </View>
      )}

      {/* Bottom-sheet detail panel */}
      {selectedMine && (
        <View style={[styles.sheet, { backgroundColor: c.surface }]}>
          {/* Handle + close row */}
          <View style={styles.sheetTop}>
            <View style={[styles.handle, { backgroundColor: c.border }]} />
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: c.background }]}
              onPress={() => setSelectedMine(null)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={16} color={c.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Hero ore image */}
          <View style={styles.heroWrap}>
            {oresLoading ? (
              <View style={[styles.heroImage, { backgroundColor: c.background, justifyContent: 'center', alignItems: 'center' }]}>
                <AppLoader size={52} />
              </View>
            ) : heroImage ? (
              <Image source={{ uri: heroImage }} style={styles.heroImage} resizeMode="cover" />
            ) : (
              <View style={[styles.heroImage, styles.heroPlaceholder, { backgroundColor: c.background }]}>
                <Mountain size={40} color={c.border} />
                <Text style={[styles.placeholderText, { color: c.textMuted }]}>No image available</Text>
              </View>
            )}
            {/* Ore name badge overlaid on image */}
            {selectedOre && (
              <View style={[styles.oreBadge, { backgroundColor: c.primary }]}>
                <Text style={styles.oreBadgeText}>{selectedOre.name}</Text>
              </View>
            )}
          </View>

          {/* Mine info */}
          <View style={styles.infoSection}>
            <Text style={[styles.mineName, { color: c.text }]} numberOfLines={1}>{selectedMine.mineName}</Text>
            <View style={styles.locationRow}>
              <MapPin size={13} color={c.primary} />
              <Text style={[styles.locationText, { color: c.textMuted }]} numberOfLines={1}>
                {selectedMine.accessPatterns}
              </Text>
            </View>

            {/* Stat chips */}
            {selectedOre && !oresLoading && (
              <View style={styles.chipsRow}>
                <View style={[styles.chip, { backgroundColor: c.background, borderColor: c.border }]}>
                  <Droplets size={13} color={c.primary} />
                  <Text style={[styles.chipText, { color: c.text }]} numberOfLines={1}>{selectedOre.color}</Text>
                </View>
                <View style={[styles.chip, { backgroundColor: c.background, borderColor: c.border }]}>
                  <Shield size={13} color={c.primary} />
                  <Text style={[styles.chipText, { color: c.text }]}>{selectedOre.hardness} Mohs</Text>
                </View>
              </View>
            )}

            {/* CTA */}
            <TouchableOpacity
              style={[styles.cta, { backgroundColor: c.primary }]}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/ore-detail', params: { oreID: selectedMine.oreID } })}
            >
              <Text style={styles.ctaText}>View Full Mineral Profile</Text>
              <ArrowRight size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  badge: {
    position: 'absolute',
    top: STATUS_H + 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
    paddingBottom: 32,
  },
  sheetTop: {
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroWrap: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  heroPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '500',
  },
  oreBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  oreBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  infoSection: {
    paddingHorizontal: 20,
    gap: 6,
  },
  mineName: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '400',
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  ctaText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
