// [STATUS: EDIT] — Refactored Firebase initialization to use safe environment variables and added Firestore/Storage integrations.

// services/firebase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Keys are safely pulled from the local .env file during the Expo build process
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase App instance safely for React Native
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistent AsyncStorage so logins stay saved across app restarts
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore (Database) and Storage (Images)
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

