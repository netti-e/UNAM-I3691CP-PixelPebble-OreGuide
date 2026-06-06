import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
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

  // Animation Values
  const oreTranslateX = useSharedValue(SCREEN_WIDTH);     // ORE from right
  const guideTranslateX = useSharedValue(-SCREEN_WIDTH);  // GUIDE from left
  const iconTranslateY = useSharedValue(-SCREEN_HEIGHT);
  const iconTranslateX = useSharedValue(90);
  const iconRotation = useSharedValue(0);
  const loadingBarWidth = useSharedValue(0);
  const iconShake = useSharedValue(0);
  const whiteFlashScale = useSharedValue(0);

  useEffect(() => {
    if (!authLoading) {
      SplashScreen.hideAsync();

      // 1. Text sliding in opposite directions
      oreTranslateX.value = withTiming(0, { duration: 1500, easing: Easing.out(Easing.cubic) });
      guideTranslateX.value = withTiming(0, { duration: 1500, easing: Easing.out(Easing.cubic) });

      // 2. 1.5s delay before icon drop
      setTimeout(() => {
        iconTranslateY.value = withTiming(-85, { duration: 600, easing: Easing.out(Easing.quad) });

        // 3. Roll/Bounce to "O"
        setTimeout(() => {
          iconTranslateX.value = withTiming(-110, { duration: 1500, easing: Easing.linear });
          iconRotation.value = withTiming(-360, { duration: 1500, easing: Easing.linear });
          
          iconTranslateY.value = withRepeat(
            withSequence(
              withTiming(-105, { duration: 350, easing: Easing.out(Easing.quad) }),
              withTiming(-85, { duration: 350, easing: Easing.in(Easing.quad) })
            ),
            2, false
          );

          // 4. Final fall off to rest on the loading bar
          setTimeout(() => {
            iconTranslateY.value = withTiming(5, { duration: 400, easing: Easing.out(Easing.quad) });
            iconTranslateX.value = withTiming(-150, { duration: 400, easing: Easing.out(Easing.quad) });

            // 5. Loading Bar
            setTimeout(() => {
              loadingBarWidth.value = withTiming(240, { duration: 5000, easing: Easing.linear }, (finished) => {
                if (finished) {
                  // 6. Shake & Flash
                  iconShake.value = withRepeat(
                    withSequence(
                      withTiming(10, { duration: 100 }),
                      withTiming(-10, { duration: 100 }),
                      withTiming(0, { duration: 100 })
                    ),
                    3, false, () => {
                      whiteFlashScale.value = withTiming(50, {
                        duration: 1000,
                        easing: Easing.bezier(0.5, 0, 0.7, 0.2)
                      }, (isFinished) => {
                        if (isFinished) runOnJS(setShowOverlay)(false);
                      });
                    }
                  );
                }
              });
            }, 600);
          }, 1400);
        }, 600);
      }, 1500); 
    }
  }, [authLoading]);

  // Styles
  const oreStyle = useAnimatedStyle(() => ({ transform: [{ translateX: oreTranslateX.value }] }));
  const guideStyle = useAnimatedStyle(() => ({ transform: [{ translateX: guideTranslateX.value }] }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: iconTranslateX.value },
      { translateY: iconTranslateY.value },
      { rotate: `${iconRotation.value + iconShake.value}deg` }
    ],
  }));
  const loadingStyle = useAnimatedStyle(() => ({ width: loadingBarWidth.value }));
  const flashStyle = useAnimatedStyle(() => ({
    transform: [{ scale: whiteFlashScale.value }],
    opacity: Math.max(0, 1 - whiteFlashScale.value / 50),
  }));

  return (
    <View style={styles.container}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>

      <Animated.View style={[styles.whiteFlash, flashStyle]} />

      {showOverlay && (
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.overlayCanvas} />
          <View style={styles.animationCenteringContainer}>
            
            <View style={styles.textRow}>
              <Animated.View style={oreStyle}><Text style={styles.brandTextWhite}>ORE </Text></Animated.View>
              <Animated.View style={guideStyle}><Text style={styles.brandTextBlack}>GUIDE</Text></Animated.View>
            </View>
            
            <View style={styles.loadingContainer}>
              <Animated.View style={[styles.loadingBar, loadingStyle]} />
            </View>

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
  overlayCanvas: { ...StyleSheet.absoluteFillObject, backgroundColor: '#E97A34' },
  whiteFlash: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 60,
    left: SCREEN_WIDTH / 7 - 60,
    width: 150, height: 150, borderRadius: 100,
    backgroundColor: '#FFFFFF', zIndex: 100,
  },
  animationCenteringContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  textRow: { flexDirection: 'row', justifyContent: 'center', width: 240 },
  loadingContainer: { width: 240, alignItems: 'flex-start' },
  brandTextWhite: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: 4 },
  brandTextBlack: { fontSize: 32, fontWeight: '900', color: '#000000', letterSpacing: 4 },
  loadingBar: { height: 4, backgroundColor: '#FFFFFF', marginTop: 8 },
  iconBorder: {
    position: 'absolute',
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden', backgroundColor: '#E97A34',
    zIndex: 21,
  },
  brandIcon: { width: 100, height: 100 },
});