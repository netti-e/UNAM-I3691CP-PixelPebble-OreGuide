// services/firebase.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';

// Replace these with your actual Firebase project web app credentials
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "oreguide.firebaseapp.com",
  projectId: "oreguide",
  storageBucket: "oreguide.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase App instance safely for React Native
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistent AsyncStorage so logins stay saved across app restarts
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
