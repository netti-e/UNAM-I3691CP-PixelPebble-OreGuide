// app/(tabs)/learn.tsx
// [STATUS: OPERATIONAL] — Educational Hub with GraduationCap Icon Integration

import { useLocalSearchParams } from 'expo-router';
// SWAPPED: BookOpen replaced with GraduationCap
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import { Compass, Droplet, Globe, GraduationCap, Layers, ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { THEME } from '../../constants/theme';
import { styles } from './learn.styles';

const db = getFirestore();

interface OreData {
  name: string;
  chemicalComposition?: string;
  chemicalCompostion?: string; 
  color: string;
  hardness: string;
  uses: string;
  mainImageURL?: string;
  imageSamples?: string[];
}

type ActiveTab = 'minerals' | 'namibia';

export default function LearnScreen() {
  const { oreName } = useLocalSearchParams<{ oreName?: string }>();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('minerals');
  const [selectedOreId, setSelectedOreId] = useState<string | null>(null);
  const [allOres, setAllOres] = useState<{ id: string; name: string }[]>([]);
  const [activeOreData, setActiveOreData] = useState<OreData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (oreName) {
      setActiveTab('minerals');
      setSelectedOreId(oreName);
    }
  }, [oreName]);

  useEffect(() => {
    const fetchOreList = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ores'));
        const oresList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || doc.id
        }));
        setAllOres(oresList);
        
        if (!selectedOreId && oresList.length > 0 && !oreName) {
          setSelectedOreId(oresList[0].id);
        }
      } catch (error) {
        console.error("Error fetching mineral catalog index: ", error);
      }
    };
    fetchOreList();
  }, []);

  useEffect(() => {
    if (!selectedOreId) return;

    const fetchOreDetails = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'ores', selectedOreId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setActiveOreData(docSnap.data() as OreData);
        }
      } catch (error) {
        console.error("Error pulling Firestore document parameters: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOreDetails();
  }, [selectedOreId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Safe Branding Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Learning Hub</Text>
      </View>

      {/* Segmented Control Pill Container */}
      <View style={styles.tabOuterContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'minerals' && styles.activeTabButton]}
            onPress={() => setActiveTab('minerals')}
          >
            {/* ICON UPDATED: BookOpen changed to GraduationCap */}
            <GraduationCap size={18} color={activeTab === 'minerals' ? '#FFFFFF' : THEME.colors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'minerals' && styles.activeTabText]}>Mineral Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'namibia' && styles.activeTabButton]}
            onPress={() => setActiveTab('namibia')}
          >
            <Globe size={16} color={activeTab === 'namibia' ? '#FFFFFF' : THEME.colors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'namibia' && styles.activeTabText]}>Namibia Insights</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TAB 1: MINERAL ARCHIVE */}
        {activeTab === 'minerals' && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ribbonContainer} contentContainerStyle={{ paddingRight: 32 }}>
              {allOres.map((ore) => (
                <TouchableOpacity
                  key={ore.id}
                  style={[styles.ribbonChip, selectedOreId === ore.id && styles.activeRibbonChip]}
                  onPress={() => setSelectedOreId(ore.id)}
                >
                  <Text style={[styles.ribbonChipText, selectedOreId === ore.id && styles.activeRibbonChipText]}>
                    {ore.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={THEME.colors.primary} />
                <Text style={styles.loaderText}>Querying matrix data...</Text>
              </View>
            ) : activeOreData ? (
              <View style={styles.profileWrapper}>
                {activeOreData.mainImageURL && (
                  <Image source={{ uri: activeOreData.mainImageURL }} style={styles.heroImage} resizeMode="cover" />
                )}

                <Text style={styles.oreTitle}>{activeOreData.name}</Text>
                
                <View style={styles.gridContainer}>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>Composition</Text>
                    <Text style={styles.gridValue}>
                      {activeOreData.chemicalComposition || activeOreData.chemicalCompostion || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>Hardness (Mohs)</Text>
                    <Text style={styles.gridValue}>{activeOreData.hardness || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.infoCard}>
                  <Text style={styles.cardHeader}>Chromatic Properties</Text>
                  <Text style={styles.cardBody}>{activeOreData.color}</Text>
                </View>

                <View style={styles.infoCard}>
                  <Text style={styles.cardHeader}>Industrial & Global Applications</Text>
                  <Text style={styles.cardBody}>{activeOreData.uses}</Text>
                </View>

                {activeOreData.imageSamples && activeOreData.imageSamples.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.sectionLabel}>Field Collection Samples</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll} contentContainerStyle={{ paddingRight: 32 }}>
                      {activeOreData.imageSamples.map((imgUrl, idx) => (
                        <Image key={idx} source={{ uri: imgUrl }} style={styles.galleryImage} />
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            ) : null}
          </View>
        )}

        {/* TAB 2: GEOLOGICAL PROFILE & NAMIBIA INSIGHTS */}
        {activeTab === 'namibia' && (
          <View style={styles.insightsWrapper}>
            <View style={styles.insightSection}>
              <View style={styles.sectionHeaderRow}>
                <Layers size={18} color={THEME.colors.primary} />
                <Text style={styles.insightSectionTitle}>Geological Formation History</Text>
              </View>
              <Text style={styles.insightParagraph}>
                Namibia contains highly stable, ancient crust zones spanning billions of years. The fundamental bedrock blueprint was carved during the ancient <Text style={styles.highlightText}>Damara Orogeny</Text> tectonic event.
              </Text>
              <Text style={styles.insightParagraph}>
                This massive collision forced deep hydrothermal veins containing rich mineral components upward, giving birth to the vast copper, gold, and gemstone deposits found throughout the territory today.
              </Text>
            </View>

            <View style={styles.insightSection}>
              <View style={styles.sectionHeaderRow}>
                <Compass size={18} color={THEME.colors.primary} />
                <Text style={styles.insightSectionTitle}>Primary Extracted Mineral Output</Text>
              </View>
              <Text style={styles.insightParagraph}>
                • <Text style={styles.boldText}>Diamonds:</Text> Extensively gathered via high-tier alluvial marine recovery arrays along the coastline.
              </Text>
              <Text style={styles.insightParagraph}>
                • <Text style={styles.boldText}>Uranium Feedstock:</Text> Powered by world-class tier-one infrastructure deposits at Husab and Rössing.
              </Text>
              <Text style={styles.insightParagraph}>
                • <Text style={styles.boldText}>Base Complex Ores:</Text> Rich processing operations targeting gold, zinc, and high-grade copper minerals.
              </Text>
            </View>

            <View style={styles.insightSection}>
              <View style={styles.sectionHeaderRow}>
                <ShieldCheck size={18} color={THEME.colors.primary} />
                <Text style={styles.insightSectionTitle}>Sustainable Resource Architecture</Text>
              </View>
              
              <View style={styles.subCard}>
                <View style={styles.subCardHeaderRow}>
                  <Droplet size={14} color={THEME.colors.primary} />
                  <Text style={styles.subCardTitle}>Desalination & Water Preservation</Text>
                </View>
                <Text style={styles.subCardBody}>
                  Industrial setups utilize dedicated ocean water desalination infrastructure pipelines to keep pristine desert aquifers protected from consumption.
                </Text>
              </View>

              <View style={styles.subCard}>
                <View style={styles.subCardHeaderRow}>
                  <Globe size={14} color={THEME.colors.primary} />
                  <Text style={styles.subCardTitle}>Progressive Open-Pit Reconstruction</Text>
                </View>
                <Text style={styles.subCardBody}>
                  Excavated terrain zones undergo continuous rehabilitation backfilling cycles alongside production pipelines to support local desert biodiversity.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}