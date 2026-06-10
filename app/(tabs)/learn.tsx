// app/(tabs)/learn.tsx
// [STATUS: OPERATIONAL] — Fixed Group Routing Layout

import { router } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { Gem, Landmark, Layers, Pickaxe } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { EDUCATIONAL_CONTENT, LocationData } from '../../constants/ores';
import { THEME } from '../../constants/theme';
import { db } from '../../services/firebase';
import { Ore } from '../../types/ore';
import { styles } from './learn.styles';

type SubSection = 'ores' | 'basics' | 'geology' | 'mining';

export default function LearnScreen() {
  const [activeTab, setActiveTab] = useState<SubSection>('ores');
  const [ores, setOres] = useState<Ore[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEducationalData() {
      try {
        const oresSnapshot = await getDocs(collection(db, 'ores'));
        const activeOres = oresSnapshot.docs.map(doc => ({
          oreID: doc.id,
          ...doc.data()
        } as Ore));
        
        const locsSnapshot = await getDocs(collection(db, 'locations'));
        const activeLocs = locsSnapshot.docs.map(doc => doc.data() as LocationData);

        setOres(activeOres);
        setLocations(activeLocs);
      } catch (err) {
        console.error("Error loading learn materials from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEducationalData();
  }, []);

  const getOreLocations = (oreID: string) => {
    return locations
      .filter(loc => loc.oreID === oreID)
      .map(loc => loc.mineName)
      .join(', ') || 'Various exploration fields';
  };

  const renderTabButton = (type: SubSection, label: string, IconComponent: React.ComponentType<any>) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === type && styles.activeTabButton]}
      onPress={() => setActiveTab(type)}
    >
      <IconComponent size={16} color={activeTab === type ? '#FFF' : THEME.colors.textMuted} />
      <Text style={[styles.tabButtonText, activeTab === type && styles.activeTabButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Knowledge Hub</Text>
        <Text style={styles.headerSubtitle}>Discover Namibia’s mineral wealth and ancient geology</Text>
      </View>

      {/* Segmented Controller Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          {renderTabButton('ores', 'Ores & Mines', Gem)}
          {renderTabButton('basics', 'Basics', Layers)}
          {renderTabButton('geology', 'Geology', Landmark)}
          {renderTabButton('mining', 'Mining', Pickaxe)}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={{ color: THEME.colors.textMuted, marginTop: 12 }}>Loading knowledge modules...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {activeTab === 'ores' && (
            <View>
              <Text style={styles.sectionTitle}>Namibian Ores ({ores.length})</Text>
              {ores.map((ore) => {
                const formula = ore.chemicalComposition || (ore as any).chemicalCompostion || 'N/A';

                return (
                  <TouchableOpacity 
                    key={ore.oreID} 
                    style={styles.oreCard}
                    activeOpacity={0.9}
                    onPress={() => {
                      // FIXED ROUTING: Stripped the (tabs) folder group layer wrapper 
                      router.push({
                        pathname: '/ore-detail',
                        params: { oreId: ore.oreID }
                      });
                      
                      // NOTE: If your file uses a dynamic slug folder syntax like app/ore-detail/[oreId].tsx instead, 
                      // use this layout setup instead:
                      // router.push({ pathname: '/ore-detail/[oreId]', params: { oreId: ore.oreID } });
                    }}
                  >
                    {ore.imageSamples && ore.imageSamples.length > 0 && (
                      <Image source={{ uri: ore.imageSamples[0] }} style={styles.oreImage} />
                    )}
                    <View style={styles.oreCardBody}>
                      <Text style={styles.oreName}>{ore.name}</Text>
                      <Text style={styles.oreFormula}>{formula}</Text>
                      
                      <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Color: </Text>
                        <Text style={styles.metaValue}>{ore.color}</Text>
                      </View>
                      <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Hardness: </Text>
                        <Text style={styles.metaValue}>{ore.hardness}</Text>
                      </View>
                      <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Key Locations: </Text>
                        <Text style={styles.metaValue} numberOfLines={2}>{getOreLocations(ore.oreID)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {activeTab === 'basics' && (
            <View>
              <Text style={styles.sectionTitle}>{EDUCATIONAL_CONTENT.basics.title}</Text>
              <Text style={styles.sectionDesc}>{EDUCATIONAL_CONTENT.basics.description}</Text>
              {EDUCATIONAL_CONTENT.basics.topics.map((topic, index) => (
                <View key={index} style={styles.topicCard}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicContent}>{topic.content}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'geology' && (
            <View>
              <Text style={styles.sectionTitle}>{EDUCATIONAL_CONTENT.geology.title}</Text>
              <Text style={styles.sectionDesc}>{EDUCATIONAL_CONTENT.geology.description}</Text>
              {EDUCATIONAL_CONTENT.geology.topics.map((topic, index) => (
                <View key={index} style={styles.topicCard}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicContent}>{topic.content}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'mining' && (
            <View>
              <Text style={styles.sectionTitle}>{EDUCATIONAL_CONTENT.mining.title}</Text>
              <Text style={styles.sectionDesc}>{EDUCATIONAL_CONTENT.mining.description}</Text>
              {EDUCATIONAL_CONTENT.mining.topics.map((topic, index) => (
                <View key={index} style={styles.topicCard}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicContent}>{topic.content}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}