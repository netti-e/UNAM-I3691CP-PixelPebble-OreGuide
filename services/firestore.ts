// services/firestore.ts

import { collection, DocumentData, getDocs, limit, query } from 'firebase/firestore';
import { Ore, MineLocation } from '../types/ore';
import { db } from './firebase';

const mapDocToOre = (id: string, data: DocumentData): Ore => {
  // Use the oreID field if present (trim trailing spaces from real docs), otherwise fall back to doc ID
  const oreID = ((data.oreID as string) || id).trim();

  // Handle mainImageURL (capital URL) and mainImageUrl (camel) variants across docs
  const mainImage = (data.mainImageURL || data.mainImageUrl || '') as string;
  const samples = Array.isArray(data.imageSamples) ? (data.imageSamples as string[]) : [];
  const seen = new Set<string>();
  const imageSamples: string[] = [];
  for (const url of [mainImage, ...samples]) {
    if (url && !seen.has(url)) { seen.add(url); imageSamples.push(url); }
  }

  return {
    oreID,
    name: data.name || 'Unnamed Sample',
    color: data.color || 'Unknown Colour Matrix',
    hardness: data.hardeness || data.hardness || 'N/A',
    // Handle chemicalCompostion typo in original Firestore docs
    chemicalComposition: data.chemicalComposition || data.chemicalCompostion || 'Unknown Formula',
    uses: data.uses || 'No commercial applications documented.',
    imageSamples,
  };
};

export const fetchAllOres = async (): Promise<Ore[]> => {
  const oresCollection = collection(db, 'ores');
  const oreSnapshot = await getDocs(oresCollection);
  const all = oreSnapshot.docs.map(doc => mapDocToOre(doc.id, doc.data()));

  // Deduplicate by oreID — prefer the doc with more images (Firebase Storage originals
  // have mainImageUrl + imageSamples; seeded docs only have 1 Wikipedia URL)
  const byID = new Map<string, Ore>();
  for (const ore of all) {
    const existing = byID.get(ore.oreID);
    if (!existing || ore.imageSamples.length > existing.imageSamples.length) {
      byID.set(ore.oreID, ore);
    }
  }
  return [...byID.values()];
};

export const fetchFeaturedOres = async (maxCount: number = 6): Promise<Ore[]> => {
  const all = await fetchAllOres();
  return all.slice(0, maxCount);
};

export const fetchMineLocations = async (): Promise<MineLocation[]> => {
  const snapshot = await getDocs(collection(db, 'mines'));
  return snapshot.docs.map(doc => doc.data() as MineLocation);
};

export const fetchEducationalContent = async (): Promise<DocumentData[]> => {
  const snapshot = await getDocs(collection(db, 'educationalContent'));
  return snapshot.docs.map(doc => doc.data());
};