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
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {ProgressBar} from './src/components/ProgressBar';

import {
  mix,
  Blur,
  Canvas,
  Circle,
  Fill,
  Group,
  LinearGradient,
  rect,
  useFont,
  vec,
  fitRects,
  rect2rect,
} from '@shopify/react-native-skia';

import {
  Easing,
  cancelAnimation,
  useSharedValue,
  withRepeat,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import {Test} from './src/components/Test';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const width = 390;
const height = 844;
const src = rect(0, 0, width, height);

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
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const window = useWindowDimensions();
  const dst = rect(0, 0, window.width, window.height);
  const rects = fitRects('cover', src, dst);
  const transform = rect2rect(rects.src, rects.dst);
  const translateY = useSharedValue(0);
  const t = useLoop({duration: 3000});
  const x = useDerivedValue(() => mix(t.value, 0, 180), [t]);
  const progress = useDerivedValue(() => x.value / 192, [x]);
  const font = useFont(require('./src/components/SF-Pro-Display-Bold.otf'), 17);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />

        {/* <Test /> */}
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <Canvas style={{flex: 1, width: 400, height: 200}} mode="continuous">
            {/* <Group transform={transform}> */}
            <ProgressBar progress={progress} />

            {/* </Group> */}
          </Canvas>
          <Canvas style={{flex: 1, width: 400, height: 200}} mode="continuous">
            {/* <Group transform={transform}> */}
            <ProgressBar progress={progress} />

            {/* </Group> */}
          </Canvas>
          {/* <LearnMoreLinks /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
