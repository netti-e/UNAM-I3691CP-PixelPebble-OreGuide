// app/(tabs)/index.tsx
// [STATUS: OPERATIONAL] — Re-routed ore card components from static local modal to the dynamic Firestore stack overlay

import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Bell, Bookmark, Camera, GraduationCap, LogOut, Map as MapIcon, Search, WifiOff } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { OreCard } from '../../components/ore-card';
import { SearchBar } from '../../components/search-bar';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../hooks/use-auth';
import { useOreSearch } from '../../hooks/use-ore-search';
import { formatChemicalFormula } from '../../utils/format-fomula';
import { styles } from './index.styles';

export default function HomeScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const profileAnimation = useRef<LottieView>(null);
  const { logout, user } = useAuth();
  
  // Interval to play animation every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      profileAnimation.current?.play();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const {
    ores,
    loading,
    isOfflineFallback,
    searchQuery,
    setSearchQuery,
    selectedColor,
    setSelectedColor,
    selectedElement,
    setSelectedElement,
    resetFilters
  } = useOreSearch();

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleActionPress = (label: string) => {
    switch (label) {
      case 'Scan Ore': router.push('/(tabs)/explore'); break;
      case 'Explore Map': router.push('/(tabs)/map'); break;
      case 'Learn': router.push('/(tabs)/learn' as any); break;
      case 'Saved Ores': router.push('/(tabs)/favorites'); break;
      default: break;
    }
  };

  const isSearching = searchQuery.length > 0 || selectedColor !== null || selectedElement !== null;

  return (
    <SafeAreaView style={styles.container}>
      {isOfflineFallback && (
        <View style={{ backgroundColor: '#F59E0B', paddingVertical: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          <WifiOff size={14} color="#FFF" />
          <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>Viewing Offline Specimen Cache</Text>
        </View>
      )}

     {/* Top Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>OreGuide</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <Bell size={22} color={THEME.colors.text} />
          
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => {
              setMenuOpen(!menuOpen);
              // Only plays when the user actually taps the button
              profileAnimation.current?.play();
            }}
          >
            <LottieView
              ref={profileAnimation}
              source={require('@/assets/animations/profile-icon.json')}
              style={{ width: 36, height: 36 }}
              autoPlay={false} // Disabled automatic playback
              loop={false}
              // Keeping your colors as they are in the original file
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}
      
      {menuOpen && (
        <View style={styles.dropdown}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: THEME.colors.border }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: THEME.colors.text }} numberOfLines={1}>
              {user?.displayName || 'Explorer'}
            </Text>
            <Text style={{ fontSize: 11, color: THEME.colors.textMuted }} numberOfLines={1}>
              {user?.email || ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
            <LogOut size={18} color="#EF4444" />
            <Text style={[styles.dropdownItemText, styles.logoutText]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 10 }}>
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            onClearFilters={resetFilters}
          />
        </View>

        {isSearching ? (
          <FlatList 
            data={ores}
            keyExtractor={(item) => item.oreID}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <OreCard 
                ore={item} 
                onPress={() => router.push({ pathname: '/ore-detail', params: { oreID: item.oreID } })} 
              />
            )}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Search size={48} color={THEME.colors.border} />
                <Text style={{ color: THEME.colors.textMuted, marginTop: 16 }}>No minerals found matching these filters.</Text>
              </View>
            }
          />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
            <View style={styles.actionGrid}>
              {[
                { icon: Camera, label: 'Scan Ore' },
                { icon: MapIcon, label: 'Explore Map' },
                { icon: GraduationCap, label: 'Learn' }, 
                { icon: Bookmark, label: 'Saved Ores' },
              ].map((item, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={styles.actionCard}
                  onPress={() => handleActionPress(item.label)}
                  activeOpacity={0.75}
                >
                  <item.icon size={24} color={THEME.colors.primary} />
                  <Text style={styles.actionLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>RECENT MINERALS & SCANS</Text>
            {loading ? (
              <View style={{ height: 140, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="small" color={THEME.colors.primary} />
              </View>
            ) : ores.length === 0 ? (
              <View style={{ height: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.colors.background, borderColor: THEME.colors.border, borderWidth: 1, borderRadius: 12, marginBottom: 20, paddingHorizontal: 16 }}>
                <Text style={{ color: THEME.colors.textMuted, fontSize: 13, textAlign: 'center' }}>No recent minerals available.</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                {ores.map((item) => (
                  <TouchableOpacity 
                    key={item.oreID} 
                    style={styles.scanCard}
                    activeOpacity={0.85}
                    onPress={() => router.push({ pathname: '/ore-detail', params: { oreID: item.oreID } })}
                  >
                    {item.imageSamples && item.imageSamples.length > 0 ? (
                      <Image 
                        source={{ uri: item.imageSamples[0] }} 
                        style={[styles.scanImagePlaceholder, { backgroundColor: 'transparent' }]} 
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.scanImagePlaceholder} />
                    )}
                    <Text style={styles.scanName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.scanMine} numberOfLines={1}>
                      {formatChemicalFormula(item.chemicalComposition)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.banner}>
              <Text style={styles.bannerTitle}>Namibia's Mineral Heritage</Text>
              <TouchableOpacity 
                style={styles.bannerButton} 
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/learn' as any)}
              >
                <Text style={styles.bannerButtonText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}