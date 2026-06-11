// components/app-loader.tsx

import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';

interface AppLoaderProps {
  size?: number;
}

export function AppLoader({ size = 80 }: AppLoaderProps) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <LottieView
        source={require('../assets/animations/Loading06.json')}
        style={{ width: size, height: size }}
        autoPlay
        loop
        colorFilters={[{ keypath: '*', color: '#D35400' }]}
      />
    </View>
  );
}
