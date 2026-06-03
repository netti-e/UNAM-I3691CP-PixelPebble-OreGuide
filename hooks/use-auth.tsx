// [STATUS: NEW] — Implemented Auth Context Provider and useAuth hook tracking login, registration, and session persistence.

// hooks/use-auth.ts
import {
  User,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { AuthContextType, LoginCredentials, RegisterCredentials } from '../types/ore';

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

    return unsubscribe;
  }, []);

  // FR-001: User registration + Firestore profile provisioning
  const register = async ({ email, password }: RegisterCredentials): Promise<void> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Sync with Firestore schema: users/ : { userID, email, dateCreated }
      await setDoc(doc(db, 'users', newUser.uid), {
        userID: newUser.uid,
        email: newUser.email,
        dateCreated: serverTimestamp(),
      });
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

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, login, register, logout } },
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