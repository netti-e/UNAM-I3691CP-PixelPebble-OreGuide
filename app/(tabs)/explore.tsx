// app/(tabs)/explore.tsx
// [STATUS: OPERATIONAL] — Integrated live Render cloud endpoint and optimized multipart parsing

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
      setImageUri(result.assets[0].uri);
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
      setImageUri(result.assets[0].uri);
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

  const handleIdentify = useCallback(async () => {
    if (!imageUri) return;

    setScreenState('loading');
    setErrorMessage('');

    try {
      const filename = imageUri.split('/').pop() ?? 'ore_sample.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      const formData = new FormData();
      
      // Cast to 'any' allows React Native's custom non-browser wrapper to accept the file payload
      formData.append('image', { 
        uri: imageUri, 
        name: filename, 
        type 
      } as any);

      // Successfully linked to your active Render cloud instance
      const response = await fetch('https://oreguide-backend.onrender.com/api/v1/identify', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json'
          // 'Content-Type' is deliberately omitted here! 
          // This allows the browser/device environments to compute boundary markers automatically.
        },
        body: formData,
      });

      if (response.status === 413) throw new Error('Image too large. Maximum size is 10 MB.');
      if (response.status === 400) throw new Error('Invalid image data. Please capture a clearer photo.');
      if (response.status === 422) throw new Error('Unprocessable image parameters encountered.');
      if (response.status >= 500) throw new Error('Cloud engine server error. Please try again shortly.');
      if (!response.ok) throw new Error(`Unexpected connection breakdown (${response.status}).`);

      const data: InferenceResponse = await response.json();
      setResults(data);
      setScreenState('results');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Identification failed. Check your network routing.';
      setErrorMessage(message);
      setScreenState('error');
    }
  }, [imageUri]);

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
            <View style={styles.imagePreviewWrapper}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
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

        {/* Results */}
        {screenState === 'results' && results && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsMeta}>
              <Text style={styles.resultsMetaText}>
                {results.detections.length} detection{results.detections.length !== 1 ? 's' : ''} · {results.inference_time_ms}ms · {results.model_version}
              </Text>
            </View>

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