// services/firestore.ts

import { collection, DocumentData, getDocs, limit, query } from 'firebase/firestore';
import { Ore } from '../types/ore';
import { db } from './firebase';

const mapDocToOre = (id: string, data: DocumentData): Ore => {
  return {
    oreID: id,
    name: data.name || 'Unnamed Sample',
    color: data.color || 'Unknown Colour Matrix',
    // Matches spellings like "hardeness" directly from your database
    hardness: data.hardeness || data.hardness || 'N/A', 
    chemicalComposition: data.chemicalComposition || 'Unknown Formula',
    uses: data.uses || 'No commercial applications documented.',
    imageSamples: Array.isArray(data.imageSamples) && data.imageSamples.length > 0
      ? data.imageSamples 
      : (data.mainImageuRL ? [data.mainImageuRL] : [])
  };
};

export const fetchAllOres = async (): Promise<Ore[]> => {
  const oresCollection = collection(db, 'ores');
  const oreSnapshot = await getDocs(oresCollection);
  
  return oreSnapshot.docs.map(doc => mapDocToOre(doc.id, doc.data()));
};

export const fetchFeaturedOres = async (maxCount: number = 6): Promise<Ore[]> => {
  const oresCollection = collection(db, 'ores');
  const featuredQuery = query(oresCollection, limit(maxCount));
  const oreSnapshot = await getDocs(featuredQuery);
  
  return oreSnapshot.docs.map(doc => mapDocToOre(doc.id, doc.data()));
};