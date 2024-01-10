/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import '@shopify/react-native-skia';
import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';

import {
  Easing,
  cancelAnimation,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Neumorphism} from './src/components/Dashboard';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export const useLoop = ({duration}: {duration: number}) => {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {duration, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
    return () => {
      cancelAnimation(progress);
    };
  }, [duration, progress]);
  return progress;
};

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Neumorphism />
    </GestureHandlerRootView>
  );
}

export default App;
