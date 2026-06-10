import NetInfo from '@react-native-community/netinfo';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native'; // Added import
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { loading: authLoading } = useAuth();
  const [showOverlay, setShowOverlay] = useState(true);
  const [networkSpeed, setNetworkSpeed] = useState(1);
  const animationRef = useRef<LottieView>(null);

  // Animation Values
  const oreTranslateX = useSharedValue(SCREEN_WIDTH);
  const guideTranslateX = useSharedValue(-SCREEN_WIDTH);
  const iconTranslateY = useSharedValue(-SCREEN_HEIGHT);
  const iconTranslateX = useSharedValue(130);
  const iconRotation = useSharedValue(0);
  const iconShake = useSharedValue(0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkSpeed(state.type === 'wifi' ? 1 : 0.5);
    });

    if (!authLoading) {
      SplashScreen.hideAsync();

      oreTranslateX.value = withTiming(0, { duration: 1500, easing: Easing.out(Easing.cubic) });
      guideTranslateX.value = withTiming(0, { duration: 1500, easing: Easing.out(Easing.cubic) });

      setTimeout(() => {
        iconTranslateY.value = withTiming(-85, { duration: 600, easing: Easing.out(Easing.quad) });
        setTimeout(() => {
          iconTranslateX.value = withTiming(-80, { duration: 1500, easing: Easing.linear });
          iconRotation.value = withTiming(-360, { duration: 1500, easing: Easing.linear });
          
          iconTranslateY.value = withRepeat(
            withSequence(
              withTiming(-105, { duration: 350, easing: Easing.out(Easing.quad) }),
              withTiming(-85, { duration: 350, easing: Easing.in(Easing.quad) })
            ), 2, false
          );

          setTimeout(() => {
            iconTranslateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) });
            iconTranslateX.value = withTiming(-110, { duration: 400, easing: Easing.out(Easing.quad) });

            setTimeout(() => {
              animationRef.current?.play();
              // Lottie total duration is 10s at 1x speed. Adjusted by networkSpeed.
              setTimeout(() => {
                iconShake.value = withRepeat(
                  withSequence(
                    withTiming(10, { duration: 100 }),
                    withTiming(-10, { duration: 100 }),
                    withTiming(0, { duration: 100 })
                  ), 3, false, () => {
                    iconScale.value = withTiming(20, { duration: 800, easing: Easing.in(Easing.exp) }, () => {
                      runOnJS(setShowOverlay)(false);
                    });
                  }
                );
              }, 10000 / networkSpeed);
            }, 600);
          }, 1400);
        }, 600);
      }, 1500); 
    }
    return () => unsubscribe();
  }, [authLoading, networkSpeed]);

  const oreStyle = useAnimatedStyle(() => ({ transform: [{ translateX: oreTranslateX.value }] }));
  const guideStyle = useAnimatedStyle(() => ({ transform: [{ translateX: guideTranslateX.value }] }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: iconTranslateX.value },
      { translateY: iconTranslateY.value },
      { rotate: `${iconRotation.value + iconShake.value}deg` },
      { scale: iconScale.value }
    ],
  }));
  
  return (
    <View style={styles.container}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>

      {showOverlay && (
        <View style={styles.overlayCanvas}>
          <View style={styles.animationCenteringContainer}>
            <View style={styles.textRow}>
              <Animated.View style={oreStyle}><Text style={styles.brandTextWhite}>RE </Text></Animated.View>
              <Animated.View style={guideStyle}><Text style={styles.brandTextBlack}>GUIDE</Text></Animated.View>
            </View>
            
            {/* Replaced loadingBar with LottieView */}
            <LottieView
  ref={animationRef}
  source={require('@/assets/animations/loading-bar.json')}
  style={styles.lottieLoading}
  speed={networkSpeed}
  loop={false}
  renderMode="HARDWARE"
  colorFilters={[
    // Make the text white
    {
      keypath: 'Loading...', 
      color: 'white',
    },
    // Make the bar and moving dot elements white
    {
      keypath: 'Layer 5 Outlines 4',
      color: 'white',
    },
    {
      keypath: 'Dot',
      color: 'white',
    }
  ]}
/>

            <Animated.View style={[styles.iconBorder, iconStyle]}>
              <Animated.Image
                source={require('@/assets/images/splash-icon.png')}
                style={styles.brandIcon}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
        </View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return <AuthProvider><RootLayoutContent /></AuthProvider>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlayCanvas: { ...StyleSheet.absoluteFillObject, backgroundColor: '#E97A34', zIndex: 100 },
  animationCenteringContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textRow: { flexDirection: 'row', justifyContent: 'center', width: 240, marginLeft: 45, marginTop: 85,},
  lottieLoading: { width: 340, height: 150,marginLeft: 25, marginTop: -50}, // Adjusted for Lottie size
  brandTextWhite: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: 4 },
  brandTextBlack: { fontSize: 32, fontWeight: '900', color: '#000000', letterSpacing: 4 },
  iconBorder: {
    position: 'absolute',
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden', backgroundColor: '#E97A34',
  },
  brandIcon: { width: 100, height: 100 },
});