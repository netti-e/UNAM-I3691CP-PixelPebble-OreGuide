// app/ore-detail.tsx
// [STATUS: OPERATIONAL] — Analytical Core & Full Geological Profile Module

// Imported Stack from expo-router to handle native header visibility controls
import { useLocalSearchParams, router, Stack } from 'expo-router';
// Added collection, query, where, and getDocs to handle fallback lookup matrices
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ArrowLeft, Beaker, Shield, Compass, Image as ImageIcon, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { AppLoader } from '../components/app-loader';
import { db } from '../services/firebase';
import { THEME } from '../constants/theme';
import { useAppTheme } from '../contexts/theme-context';

interface OreData {
  name: string;
  chemicalComposition?: string;
  chemicalCompostion?: string; // Fallback for typo in DB records
  color: string;
  hardness: string;
  uses: string;
  mainImageURL?: string;
  imageSamples?: string[];
}

export default function OreDetailScreen() {
  const { theme } = useAppTheme();
  const c = theme.colors;
  const params = useLocalSearchParams<{ oreId?: string; oreID?: string; id?: string }>();
  const resolvedOreId = params.oreId || params.oreID || params.id;

  const [loading, setLoading] = useState(true);
  const [ore, setOre] = useState<OreData | null>(null);

  useEffect(() => {
    if (!resolvedOreId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // TIER 1: Attempt direct Document ID lookup (e.g., exact match 'Azurite')
        const docRef = doc(db, 'ores', resolvedOreId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setOre(docSnap.data() as OreData);
          return;
        }
        
        // TIER 2: Fallback field query if the route parameter sent an internal field value (e.g., 'ore-azurite')
        const oresCollection = collection(db, 'ores');
        const fieldQuery = query(oresCollection, where('oreID', '==', resolvedOreId));
        const querySnapshot = await getDocs(fieldQuery);
        
        if (!querySnapshot.empty) {
          setOre(querySnapshot.docs[0].data() as OreData);
          return;
        }

        // TIER 3: Case-insensitive fallback scanner to account for mixed casing (e.g., 'chalcopyrite' vs 'Bornite')
        const normalizedTargetId = resolvedOreId.toLowerCase();
        const absoluteSnapshot = await getDocs(oresCollection);
        
        const caseInsensitiveMatch = absoluteSnapshot.docs.find(document => {
          const docIdMatch = document.id.toLowerCase() === normalizedTargetId;
          const internalIdMatch = document.data().oreID?.toLowerCase() === normalizedTargetId;
          return docIdMatch || internalIdMatch;
        });

        if (caseInsensitiveMatch) {
          setOre(caseInsensitiveMatch.data() as OreData);
          return;
        }

        console.warn(`No matching geological entry found for search matrix: ${resolvedOreId}`);
      } catch (error) {
        console.error("Critical Matrix Read Failure:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [resolvedOreId]);

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: c.background }]}>
        <AppLoader size={90} />
        <Text style={[styles.loaderText, { color: c.textMuted }]}>Extracting Mineral Matrices...</Text>
      </View>
    );
  }

  if (!ore) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: c.background }]}>
        <Text style={[styles.errorText, { color: c.textMuted }]}>Geological profile unavailable.</Text>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: c.primary }]} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Return to Hub</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Gracefully handle database schema spelling anomalies safely
  const chemicalFormula = ore.chemicalComposition || ore.chemicalCompostion || 'Unknown Formula';

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.headerNav}>
        <TouchableOpacity style={[styles.roundIconButton, { backgroundColor: c.surface }]} onPress={() => router.back()}>
          <ArrowLeft size={22} color={c.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {ore.mainImageURL && (
          <Image source={{ uri: ore.mainImageURL }} style={styles.heroImage} resizeMode="cover" />
        )}

        <View style={[styles.profileSheet, { backgroundColor: c.surface }, !ore.mainImageURL && { marginTop: 80 }]}>
          <Text style={[styles.title, { color: c.text }]}>{ore.name}</Text>
          <Text style={[styles.formula, { color: c.primary }]}>{chemicalFormula}</Text>

          <View style={styles.grid}>
            <View style={[styles.gridCard, { backgroundColor: c.background, borderColor: c.border }]}>
              <Beaker size={20} color={c.primary} />
              <Text style={[styles.gridLabel, { color: c.textMuted }]}>Color Profile</Text>
              <Text style={[styles.gridValue, { color: c.text }]}>{ore.color}</Text>
            </View>

            <View style={[styles.gridCard, { backgroundColor: c.background, borderColor: c.border }]}>
              <Shield size={20} color={c.primary} />
              <Text style={[styles.gridLabel, { color: c.textMuted }]}>Mohs Hardness</Text>
              <Text style={[styles.gridValue, { color: c.text }]}>{ore.hardness} Mohs</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Compass size={18} color={c.text} />
              <Text style={[styles.sectionTitle, { color: c.text }]}>Industrial Application</Text>
            </View>
            <Text style={[styles.sectionParagraph, { color: c.text }]}>{ore.uses}</Text>
          </View>

          <TouchableOpacity
            style={[styles.googleButton, { borderColor: c.border, backgroundColor: c.surface }]}
            onPress={() => Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(ore.name + ' mineral')}`)}
            activeOpacity={0.7}
          >
            <Search size={16} color={c.primary} />
            <Text style={[styles.googleButtonText, { color: c.primary }]}>Search "{ore.name}" on Google</Text>
          </TouchableOpacity>

          {ore.imageSamples && ore.imageSamples.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <ImageIcon size={18} color={c.text} />
                <Text style={[styles.sectionTitle, { color: c.text }]}>Geological Samples</Text>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryScroll}
              >
                {ore.imageSamples.map((imgUrl, idx) => (
                  <Image 
                    key={idx} 
                    source={{ uri: imgUrl }} 
                    style={styles.galleryThumb} 
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 15,
    color: THEME.colors.textMuted,
    marginBottom: 16,
  },
  headerNav: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 12,
    left: 20,
    zIndex: 10,
  },
  roundIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  scrollPadding: {
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#EAEAEA',
  },
  profileSheet: {
    marginTop: -24,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  formula: {
    fontSize: 14,
    color: THEME.colors.primary,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.text,
    lineHeight: 17,
  },
  section: {
    marginTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  sectionParagraph: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 22,
  },
  galleryScroll: {
    gap: 10,
    paddingRight: 24,
  },
  galleryThumb: {
    width: 140,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: THEME.colors.primary,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});