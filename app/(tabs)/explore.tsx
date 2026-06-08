// app/(tabs)/explore.tsx
// [STATUS: OPERATIONAL] — Migrated to Server-Side Workflow Visualization Architecture with Client Adapter

import * as ImagePicker from 'expo-image-picker';
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

      // CONFIGURATION CONSTANTS (Move these to an .env file later!)
      const ROBOFLOW_API_KEY = "6GmgjxeeRS4an4UYkaMW";
      const WORKSPACE_ID = "raymonds-workspace-jtsuf";
      const WORKFLOW_ID = "detect-count-and-visualize-2";

      // Hitting the direct Roboflow Serverless Workflow API endpoint
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
      
      // Normalize array wrapping variations between hosted execution engines
      const workflowResult = Array.isArray(rawData) ? rawData[0] : rawData;
      const parsedOutputs = workflowResult?.outputs ? workflowResult.outputs : workflowResult;
      
      // 1. Locate raw predictions arrays dynamically inside workflow nodes safely
      let rawDetections: any[] = [];
      if (parsedOutputs && typeof parsedOutputs === 'object') {
        if (Array.isArray(parsedOutputs.predictions)) {
          rawDetections = parsedOutputs.predictions;
        } else if (Array.isArray(parsedOutputs.detections)) {
          rawDetections = parsedOutputs.detections;
        } else {
          // Fallback scan: look for nested arrays generated by separate block steps
          for (const key of Object.keys(parsedOutputs)) {
            if (parsedOutputs[key] && typeof parsedOutputs[key] === 'object') {
              if (Array.isArray(parsedOutputs[key].predictions)) {
                rawDetections = parsedOutputs[key].predictions;
                break;
              } else if (Array.isArray(parsedOutputs[key].detections)) {
                rawDetections = parsedOutputs[key].detections;
                break;
              }
            }
          }
        }
      } else if (Array.isArray(parsedOutputs)) {
        rawDetections = parsedOutputs;
      }

      // 2. Client Normalization Adapter Layer: Maps API shape to exact UI component specifications
      const normalizedDetections: InferenceDetection[] = rawDetections.map((item: any) => ({
        label: item.class || item.label || "Detected Sample",
        confidence: typeof item.confidence === 'number' ? item.confidence : 1.0,
        mineral_info: {
          colour: item.mineral_info?.colour || "See full profile details",
          hardness: item.mineral_info?.hardness || "Available in profile",
          common_uses: item.mineral_info?.common_uses || "Tap to view full properties",
        }
      }));

      // 3. Extract the canvas visualization frames safely from dynamic pipeline output targets
      let workflowImage = null;
      if (parsedOutputs && typeof parsedOutputs === 'object') {
        if (parsedOutputs.output_image) {
          workflowImage = parsedOutputs.output_image;
        } else {
          for (const key of Object.keys(parsedOutputs)) {
            if (parsedOutputs[key]?.output_image || parsedOutputs[key]?.image) {
              workflowImage = parsedOutputs[key].output_image || parsedOutputs[key].image;
              break;
            }
          }
        }
      }

      // 4. Construct complete state object matching local application Typescript definitions
      const finalResultObject: InferenceResponse = {
        detections: normalizedDetections,
        inference_time_ms: Math.round(rawData.inference_time_ms || workflowResult.inference_time || 0),
        model_version: "Serverless Workflow Pipeline",
      };

      // Explicitly hook mapped image data reference backwards onto custom schema extensions
      (finalResultObject as any).output_image = workflowImage;

      setResults(finalResultObject);
      setScreenState('results');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Direct identification routing failed.';
      setErrorMessage(message);
      setScreenState('error');
    }
  }, [imageUri]);

  // Safely extracts and formats the workflow base64 annotated image payload
  const getAnnotatedImageUri = (): string | null => {
    if (!results) return null;
    
    const rawOutput = (results as any).output_image;
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

            {/* Master AI Visual Analysis Frame Generated from Serverless Workflow */}
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

  return (
    <TouchableOpacity style={styles.detectionCard} activeOpacity={0.8}>
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