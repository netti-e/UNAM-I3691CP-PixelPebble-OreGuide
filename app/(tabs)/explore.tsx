// app/(tabs)/explore.tsx
// [STATUS: OPERATIONAL] — Migrated to Server-Side Workflow Visualization Architecture with Deep Recursive Scanner

import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, ChevronRight, Image as ImageIcon, RotateCcw, Zap } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { THEME } from '../../constants/theme';
import type { InferenceDetection, InferenceResponse } from '../../types/ore';
import { styles } from './explore.styles';

type ScreenState = 'idle' | 'preview' | 'loading' | 'results' | 'error';

// Local Geological Registry to substitute dummy model responses with valid quick stats
const MINERAL_STATIC_REGISTRY: Record<string, { colour: string; hardness: string; common_uses: string }> = {
  'chalcopyrite': { colour: 'Brass Yellow', hardness: '3.5 - 4.0 Mohs', common_uses: 'Primary ore source of Copper (Cu)' },
  'azurite': { colour: 'Azure Blue', hardness: '3.5 - 4.0 Mohs', common_uses: 'Copper ore matrices, pigments, and gems' },
  'malachite': { colour: 'Vibrant Green', hardness: '3.5 - 4.0 Mohs', common_uses: 'Copper identification pathfinder mineral' },
  'pyrite': { colour: 'Pale Brass Yellow', hardness: '6.0 - 6.5 Mohs', common_uses: 'Sulfuric acid production and sulfur sourcing' },
  'galena': { colour: 'Metallic Lead Grey', hardness: '2.5 - 2.8 Mohs', common_uses: 'Primary Lead (Pb) ore source containing Silver' },
  'hematite': { colour: 'Metallic Grey / Dark Red', hardness: '5.5 - 6.5 Mohs', common_uses: 'Main industrial manufacturing source of Iron (Fe)' },
  'magnetite': { colour: 'Metallic Iron Black', hardness: '5.5 - 6.5 Mohs', common_uses: 'Highly magnetic specialized iron ore production' },
  'gold': { colour: 'Golden Yellow', hardness: '2.5 - 3.0 Mohs', common_uses: 'High-grade electronics, currency, and jewelry' },
};

export default function ExploreScreen() {
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [results, setResults] = useState<InferenceResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const requestMediaPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'OreGuide needs access to your photo library to select ore samples.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'OreGuide needs camera access to capture ore samples.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const handlePickFromGallery = useCallback(async () => {
    const granted = await requestMediaPermission();
    if (!granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setResults(null);
      setScreenState('preview');
    }
  }, []);

  const handleOpenCamera = useCallback(async () => {
    const granted = await requestCameraPermission();
    if (!granted) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setResults(null);
      setScreenState('preview');
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setImageUri(null);
    setResults(null);
    setErrorMessage('');
    setScreenState('idle');
  }, []);

  const convertUriToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1];
        resolve(base64String || '');
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  };

  const handleIdentify = useCallback(async () => {
    if (!imageUri) return;

    setScreenState('loading');
    setErrorMessage('');

    try {
      const base64Data = await convertUriToBase64(imageUri);

      // CONFIGURATION CONSTANTS
      const ROBOFLOW_API_KEY = "6GmgjxeeRS4an4UYkaMW";
      const WORKSPACE_ID = "raymonds-workspace-jtsuf";
      const WORKFLOW_ID = "detect-count-and-visualize-2";

      const response = await fetch(`https://serverless.roboflow.com/infer/workflows/${WORKSPACE_ID}/${WORKFLOW_ID}`, {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          api_key: ROBOFLOW_API_KEY,
          inputs: {
            image: {
              type: "base64",
              value: base64Data
            }
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Roboflow cloud error (${response.status}): ${errorText || 'Invalid execution configuration'}`);
      }

      const rawData = await response.json();

      // ==========================================
      // DEEP RECURSIVE PAYLOAD SCANNERS
      // ==========================================
      
      const extractPredictions = (data: any): any[] => {
        if (!data || typeof data !== 'object') return [];

        if (Array.isArray(data)) {
          if (data.length > 0 && typeof data[0] === 'object') {
            const first = data[0];
            if ('confidence' in first || 'class' in first || 'class_id' in first || 'label' in first) {
              return data;
            }
          }
          for (const item of data) {
            const nested = extractPredictions(item);
            if (nested.length > 0) return nested;
          }
        } else {
          const targetKeys = ['predictions', 'detections', 'objects', 'results'];
          for (const key of targetKeys) {
            if (data[key] && Array.isArray(data[key])) {
              const res = extractPredictions(data[key]);
              if (res.length > 0) return res;
            }
          }
          for (const key of Object.keys(data)) {
            if (data[key] && typeof data[key] === 'object') {
              const nested = extractPredictions(data[key]);
              if (nested.length > 0) return nested;
            }
          }
        }
        return [];
      };

      const findWorkflowImage = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return null;
        if (obj.output_image) return obj.output_image;
        if (obj.image && (typeof obj.image === 'string' || obj.image.value)) return obj.image;

        if (Array.isArray(obj)) {
          for (const item of obj) {
            const found = findWorkflowImage(item);
            if (found) return found;
          }
        } else {
          for (const key of Object.keys(obj)) {
            const found = findWorkflowImage(obj[key]);
            if (found) return found;
          }
        }
        return null;
      };

      const rawDetections = extractPredictions(rawData);
      const workflowImage = findWorkflowImage(rawData);

      // 3. Map findings into the exact structure expected by the UI layers
      const normalizedDetections: InferenceDetection[] = rawDetections.map((item: any) => {
        let parsedConfidence = 1.0;
        if (typeof item.confidence === 'number') {
          parsedConfidence = item.confidence;
        } else if (typeof item.confidence === 'string') {
          const val = parseFloat(item.confidence);
          if (!isNaN(val)) parsedConfidence = val;
        }

        const rawLabel = item.class || item.label || "Detected Ore";
        const registryKey = rawLabel.toLowerCase().trim();
        const registryMatch = MINERAL_STATIC_REGISTRY[registryKey];

        // Intelligently clean up dummy text responses using static registry records
        return {
          label: rawLabel,
          confidence: parsedConfidence,
          mineral_info: {
            colour: item.mineral_info?.colour && !item.mineral_info.colour.includes("details")
              ? item.mineral_info.colour
              : (registryMatch?.colour || "Analyzing chromatic signature..."),
            hardness: item.mineral_info?.hardness && !item.mineral_info.hardness.includes("profile")
              ? item.mineral_info.hardness
              : (registryMatch?.hardness || "Determining scratch resistance..."),
            common_uses: item.mineral_info?.common_uses && !item.mineral_info.common_uses.includes("Tap")
              ? item.mineral_info.common_uses
              : (registryMatch?.common_uses || "Calculating primary utility..."),
          }
        };
      });

      // 4. Wrap up cleanly into standard layout payload using intersection typing
      const finalResultObject: InferenceResponse & { output_image?: any } = {
        detections: normalizedDetections,
        inference_time_ms: Math.round(rawData.inference_time_ms || rawData[0]?.inference_time || 0),
        model_version: "Serverless Workflow Pipeline",
        output_image: workflowImage,
      };

      setResults(finalResultObject);
      setScreenState('results');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Direct identification routing failed.';
      setErrorMessage(message);
      setScreenState('error');
    }
  }, [imageUri]);

  const getAnnotatedImageUri = (): string | null => {
    if (!results) return null;
    
    const rawOutput = (results as InferenceResponse & { output_image?: any }).output_image;
    if (!rawOutput) return null;

    const base64String = typeof rawOutput === 'string' ? rawOutput : rawOutput.value;
    if (!base64String) return null;

    return base64String.startsWith('data:') ? base64String : `data:image/jpeg;base64,${base64String}`;
  };

  const canIdentify = screenState === 'preview' || screenState === 'error';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Scan Ore</Text>
          <Text style={styles.subtitle}>Capture or upload a sample for AI identification</Text>
        </View>

        {/* Image Zone */}
        <View style={styles.imageZone}>
          {imageUri ? (
            <View style={[styles.imagePreviewWrapper, { position: 'relative', backgroundColor: '#000' }]}>
              <Image 
                source={{ uri: imageUri }} 
                style={styles.previewImage} 
                resizeMode="contain" 
              />
              
              <TouchableOpacity style={styles.clearButton} onPress={handleClearImage} activeOpacity={0.8}>
                <RotateCcw size={16} color={THEME.colors.surface} />
                <Text style={styles.clearButtonText}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyZone}>
              <View style={styles.emptyIconCircle}>
                <ImageIcon size={32} color={THEME.colors.primary} />
              </View>
              <Text style={styles.emptyZoneTitle}>No image selected</Text>
              <Text style={styles.emptyZoneHint}>JPEG or PNG · max 10 MB</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleOpenCamera} activeOpacity={0.85}>
            <Camera size={20} color={THEME.colors.surface} />
            <Text style={styles.primaryButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handlePickFromGallery} activeOpacity={0.85}>
            <ImageIcon size={20} color={THEME.colors.primary} />
            <Text style={styles.secondaryButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Identify CTA */}
        <TouchableOpacity
          style={[styles.identifyButton, !canIdentify && styles.identifyButtonDisabled]}
          onPress={handleIdentify}
          disabled={!canIdentify}
          activeOpacity={0.85}
        >
          {screenState === 'loading' ? (
            <ActivityIndicator color={THEME.colors.surface} size="small" />
          ) : (
            <Zap size={20} color={canIdentify ? THEME.colors.surface : THEME.colors.textMuted} />
          )}
          <Text style={[styles.identifyButtonText, !canIdentify && styles.identifyButtonTextDisabled]}>
            {screenState === 'loading' ? 'Identifying…' : 'Identify Ore'}
          </Text>
        </TouchableOpacity>

        {!imageUri && (
          <Text style={styles.identifyHint}>Select an image to enable identification</Text>
        )}

        {/* Error State */}
        {screenState === 'error' && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Identification Failed</Text>
            <Text style={styles.errorBody}>{errorMessage}</Text>
          </View>
        )}

        {/* Results Metadata Section */}
        {screenState === 'results' && results && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsMeta}>
              <Text style={styles.resultsMetaText}>
                {results.detections.length} detection{results.detections.length !== 1 ? 's' : ''} · {results.inference_time_ms}ms · {results.model_version}
              </Text>
            </View>

            {/* Master AI Visual Analysis Frame */}
            {getAnnotatedImageUri() && (
              <View style={{
                height: 240,
                backgroundColor: '#09090B',
                borderRadius: 12,
                marginBottom: 20,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#27272A'
              }}>
                <Image 
                  source={{ uri: getAnnotatedImageUri()! }} 
                  style={{ width: '100%', height: '100%' }} 
                  resizeMode="contain" 
                />
              </View>
            )}

            {results.detections.length === 0 ? (
              <View style={styles.noResultsCard}>
                <Text style={styles.noResultsText}>No ores detected in this sample. Try using a clearer photo with better lighting.</Text>
              </View>
            ) : (
              results.detections.map((detection: InferenceDetection, index: number) => (
                <DetectionCard key={`${detection.label}-${index}`} detection={detection} />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetectionCard({ detection }: { detection: InferenceDetection }) {
  const confidencePercent = Math.round(detection.confidence * 100);
  const confidenceColor =
    detection.confidence >= 0.75
      ? THEME.colors.primary
      : detection.confidence >= 0.5
      ? THEME.colors.accent
      : THEME.colors.error;

  // Handles dynamic document routing to the detailed profile screen
  const handleViewProfile = () => {
    router.push({
      pathname: '/ore-detail',
      params: { oreId: detection.label }
    });
  };

  return (
    <TouchableOpacity 
      style={styles.detectionCard} 
      activeOpacity={0.8}
      onPress={handleViewProfile}
    >
      <View style={styles.detectionHeader}>
        <Text style={styles.detectionLabel}>{detection.label}</Text>
        <View style={[styles.confidenceBadge, { backgroundColor: confidenceColor }]}>
          <Text style={styles.confidenceBadgeText}>{confidencePercent}%</Text>
        </View>
      </View>

      <View style={styles.detectionDivider} />

      <View style={styles.detectionMeta}>
        <MetaRow label="Colour" value={detection.mineral_info.colour} />
        <MetaRow label="Hardness" value={detection.mineral_info.hardness} />
        <MetaRow label="Common uses" value={detection.mineral_info.common_uses} />
      </View>

      <View style={styles.detectionFooter}>
        <Text style={styles.viewProfileText}>View full profile</Text>
        <ChevronRight size={16} color={THEME.colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}