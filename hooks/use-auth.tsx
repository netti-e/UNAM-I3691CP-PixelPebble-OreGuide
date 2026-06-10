// [STATUS: NEW] — Implemented Auth Context Provider and useAuth hook tracking login, registration, and session persistence.

// hooks/use-auth.ts
import {
  User,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, NativeModules, TurboModuleRegistry } from 'react-native';
import { auth, db } from '../services/firebase';
import { AuthContextType, LoginCredentials, RegisterCredentials } from '../types/ore';

const isGoogleSigninAvailable = (): boolean => {
  try {
    if (NativeModules && NativeModules.RNGoogleSignin) {
      return true;
    }
    if (TurboModuleRegistry && typeof TurboModuleRegistry.get === 'function') {
      return TurboModuleRegistry.get('RNGoogleSignin') !== null;
    }
  } catch (e) {
    // Fail silently, module not available
  }
  return false;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // FR-016: Persistent login listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Configure Google Sign-In safely
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (webClientId && webClientId.indexOf('dummy') === -1 && isGoogleSigninAvailable()) {
      try {
        const { GoogleSignin: gSignin } = require('@react-native-google-signin/google-signin');
        gSignin.configure({
          webClientId,
        });
      } catch (err) {
        console.warn('GoogleSignin configuration skipped (Expo Go/non-native client):', err);
      }
    }

    return unsubscribe;
  }, []);

  // FR-001: User registration + Firestore profile provisioning
  const register = async ({ email, password, name }: RegisterCredentials): Promise<void> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Update Firebase Auth user display name
      if (name) {
        await updateProfile(newUser, { displayName: name });
        await newUser.reload();
      }

      // Sync with Firestore schema: users/ : { userID, email, name, dateCreated }
      await setDoc(doc(db, 'users', newUser.uid), {
        userID: newUser.uid,
        email: newUser.email,
        name: name || '',
        dateCreated: serverTimestamp(),
      });

      // Update local state user after reload
      setUser(auth.currentUser);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // FR-002: Login
  const login = async ({ email, password }: LoginCredentials): Promise<void> => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // FR-002: Logout
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // FR-XXX: Google Login
  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      if (!isGoogleSigninAvailable()) {
        if (__DEV__) {
          return new Promise((resolve, reject) => {
            Alert.alert(
              'Developer Fallback Option',
              'The native Google Sign-in module is not available in Expo Go. Would you like to bypass using a mock Google account for testing?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: () => {
                    setLoading(false);
                    reject(new Error('Google Sign-In cancelled.'));
                  }
                },
                {
                  text: 'Bypass (Mock Account)',
                  onPress: async () => {
                    try {
                      const mockEmail = 'mock.google.explorer@oreguide.test';
                      const mockPassword = 'MockPassword123!';
                      
                      try {
                        await signInWithEmailAndPassword(auth, mockEmail, mockPassword);
                      } catch (err: any) {
                        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                          await createUserWithEmailAndPassword(auth, mockEmail, mockPassword);
                          if (auth.currentUser) {
                            await updateProfile(auth.currentUser, { displayName: 'Google Explorer (Mock)' });
                            await auth.currentUser.reload();
                          }
                        } else {
                          throw err;
                        }
                      }
                      
                      if (auth.currentUser) {
                        await setDoc(doc(db, 'users', auth.currentUser.uid), {
                          userID: auth.currentUser.uid,
                          email: auth.currentUser.email,
                          name: 'Google Explorer (Mock)',
                          dateCreated: serverTimestamp(),
                        }, { merge: true });
                        setUser(auth.currentUser);
                      }
                      resolve();
                    } catch (error) {
                      reject(error);
                    }
                  }
                }
              ]
            );
          });
        }
        throw new Error('Google Sign-In is not supported in Expo Go. A native Development Build is required.');
      }

      const GoogleSigninModule = require('@react-native-google-signin/google-signin').GoogleSignin;

      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      if (!webClientId || webClientId.indexOf('dummy') !== -1) {
        throw new Error(
          'Google Sign-In is not configured yet. Please configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in your environment.'
        );
      }

      await GoogleSigninModule.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSigninModule.signIn();
      
      const idToken = response.data?.idToken || (response as any).idToken;
      if (!idToken) {
        throw new Error('No ID token returned from Google Sign-In.');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      // Sync with Firestore using merge: true to avoid overwriting existing data
      await setDoc(doc(db, 'users', user.uid), {
        userID: user.uid,
        email: user.email,
        name: user.displayName || 'Google Explorer',
        dateCreated: serverTimestamp(),
      }, { merge: true });

    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, login, register, logout, loginWithGoogle } },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}