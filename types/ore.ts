// types/ore.ts


import { User } from 'firebase/auth';

export interface UserProfile {
  userID: string;
  email: string;
  dateCreated: Date | string; // Supporting both raw Date objects and Firestore ISO string configurations
}

export interface Ore {
  oreID: string;
  name: string;
  color: string;
  hardness: string;
  chemicalComposition: string;
  uses: string;
  imageSamples: string[];
}

export interface OreIdentification {
  scanID: string;
  userID: string;
  imageURL: string;
  identifiedOre: string;
  confidenceLevel: number;
  timestamp: Date | string;
}

export interface MineLocation {
  locationID: string;
  oreID: string;
  mineName: string;
  coordinates: {
    latitude: number;  // React Native Maps expects latitude
    longitude: number; // React Native Maps expects longitude
  };
  accessPatterns: string; // e.g., "Active Mine", "Abandoned Site", "Public Access"
}

// AI Inference API Contract Specifications
export interface BoundingBox {
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
}

export interface MineralInfo {
  colour: string;
  hardness: string;
  common_uses: string;
}

export interface InferenceDetection {
  label: string;
  confidence: number;
  bounding_box: BoundingBox;
  mineral_info: MineralInfo;
}

export interface InferenceResponse {
  status: 'success' | 'error';
  model_version: string;
  inference_time_ms: number;
  detections: InferenceDetection[];
}

// Global Application Authentication Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: React.ComponentState; // Safe fallback validation for pure string input elements
}

export type RegisterCredentials = LoginCredentials;