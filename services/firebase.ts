// services/firebase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { browserLocalPersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Hardcoded for offline development environments to bypass missing .env variable mappings
const firebaseConfig = {
  apiKey: "AIzaSyFakeKey_OreGuidePaulusLocal2026Dev", // <-- Replace with your real Firebase Project API Key string
  authDomain: "unam-i3691cp-pixelpebble.firebaseapp.com",
  projectId: "unam-i3691cp-pixelpebble",
  storageBucket: "unam-i3691cp-pixelpebble.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase App instance safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth safely based on platform environment
const createAuthInstance = () => {
  if (Platform.OS === 'web') {
    return initializeAuth(app, {
      persistence: browserLocalPersistence,
    });
  } else {
    const customMobilePersistence = {
      type: 'LOCAL',
      async _isAvailable() { return true; },
      async _set(key: string, value: any) { await AsyncStorage.setItem(key, JSON.stringify(value)); },
      async _get(key: string) { 
        const val = await AsyncStorage.getItem(key); 
        return val ? JSON.parse(val) : null; 
      },
      async _remove(key: string) { await AsyncStorage.removeItem(key); }
    };

    return initializeAuth(app, {
      persistence: customMobilePersistence as any,
    });
  }
};

const auth = createAuthInstance();

// Initialize Firestore (Database) and Storage (Images)
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
