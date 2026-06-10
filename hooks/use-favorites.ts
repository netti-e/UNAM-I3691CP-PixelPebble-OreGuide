// hooks/use-favorites.ts
// [STATUS: NEW] — Hook for managing user favorites in Firestore

import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './use-auth';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const favoritesRef = collection(db, 'users', user.uid, 'favorites');
    
    const unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
      const savedOreIDs = snapshot.docs.map(doc => doc.id);
      setFavorites(savedOreIDs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching favorites:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addFavorite = async (oreID: string) => {
    if (!user) throw new Error("Must be logged in to save favorites.");
    
    const docRef = doc(db, 'users', user.uid, 'favorites', oreID);
    await setDoc(docRef, {
      oreID,
      addedAt: serverTimestamp()
    });
  };

  const removeFavorite = async (oreID: string) => {
    if (!user) throw new Error("Must be logged in to remove favorites.");
    
    const docRef = doc(db, 'users', user.uid, 'favorites', oreID);
    await deleteDoc(docRef);
  };

  const isFavorite = (oreID: string) => {
    return favorites.includes(oreID);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}
