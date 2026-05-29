// app/(tabs)/explore.tsx
// [STATUS: OPERATIONAL] — Hardened base64 pipeline with stable container tracking

import * as ImagePicker from 'expo-image-picker';
import { Camera, ChevronRight, Image as ImageIcon, RotateCcw, Zap } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  LayoutChangeEvent,
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

  // Dimension tracking engines
  const [imageOriginalSize, setImageOriginalSize] = useState({ width: 1, height: 1 });
  const [imageLayoutSize, setImageLayoutSize] = useState({ width: 0, height: 0 });

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
      setImageOriginalSize({
        width: asset.width || 1,
        height: asset.height || 1,
      });
      setResults(null);
      setImageLayoutSize({ width: 0, height: 0 });
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
      setImageOriginalSize({
        width: asset.width || 1,
        height: asset.height || 1,
      });
      setResults(null);
      setImageLayoutSize({ width: 0, height: 0 });
      setScreenState('preview');
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setImageUri(null);
    setResults(null);
    setErrorMessage('');
    setImageLayoutSize({ width: 0, height: 0 });
    setImageOriginalSize({ width: 1, height: 1 });
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

      const response = await fetch('https://oreguide-backend.onrender.com/api/v1/identify', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64Data }),
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

  // Captures layout bounds of the stable parent view container
  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setImageLayoutSize({ width, height });
    }
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
            /* CRITICAL FIX: onLayout attached here guarantees continuous stability when the results view mounts */
            <View 
              style={[styles.imagePreviewWrapper, { position: 'relative', backgroundColor: '#000' }]}
              onLayout={handleContainerLayout}
            >
              <Image 
                source={{ uri: imageUri }} 
                style={styles.previewImage} 
                resizeMode="contain" 
              />
              
              {/* Absolute Canvas Overlay Engine Layer */}
              {imageLayoutSize.width > 0 && results?.detections?.map((detection: InferenceDetection, index: number) => {
                if (!detection.bounding_box) return null;
                const { x_min, y_min, x_max, y_max } = detection.bounding_box;

                const origWidth = imageOriginalSize.width || 1;
                const origHeight = imageOriginalSize.height || 1;

                const imageAspect = origWidth / origHeight;
                const layoutAspect = imageLayoutSize.width / imageLayoutSize.height;

                let renderWidth = imageLayoutSize.width;
                let renderHeight = imageLayoutSize.height;
                let offsetX = 0;
                let offsetY = 0;

                if (imageAspect > layoutAspect) {
                  // Image is wider than container view -> Letterboxed
                  renderHeight = imageLayoutSize.width / imageAspect;
                  offsetY = (imageLayoutSize.height - renderHeight) / 2;
                } else {
                  // Image is taller than container view -> Pillarboxed
                  renderWidth = imageLayoutSize.height * imageAspect;
                  offsetX = (imageLayoutSize.width - renderWidth) / 2;
                }

                const scaleX = renderWidth / origWidth;
                const scaleY = renderHeight / origHeight;

                const boxLeft = offsetX + (x_min * scaleX);
                const boxTop = offsetY + (y_min * scaleY);
                const boxWidth = (x_max - x_min) * scaleX;
                const boxHeight = (y_max - y_min) * scaleY;

                const isNearTopEdge = boxTop < 25;

                return (
                  <View
                    key={`box-${index}`}
                    style={{
                      position: 'absolute',
                      left: boxLeft,
                      top: boxTop,
                      width: boxWidth,
                      height: boxHeight,
                      borderWidth: 2,
                      borderColor: THEME.colors.primary,
                      backgroundColor: 'rgba(234, 179, 8, 0.1)',
                      zIndex: 10,
                    }}
                  >
                    {/* Floating Label Badge Box */}
                    <View
                      style={{
                        position: 'absolute',
                        top: isNearTopEdge ? 0 : -22,
                        left: -2,
                        backgroundColor: THEME.colors.primary,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderTopLeftRadius: isNearTopEdge ? 0 : 4,
                        borderTopRightRadius: 4,
                        borderBottomLeftRadius: isNearTopEdge ? 4 : 0,
                      }}
                    >
                      <Text style={{ color: '#000', fontSize: 10, fontWeight: 'bold' }}>
                        {detection.label} {Math.round(detection.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                );
              })}

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