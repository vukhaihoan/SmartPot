import React, {useEffect, useMemo, useRef} from 'react';
import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
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
  Text,
  rect2rect,
} from '@shopify/react-native-skia';
import {useDerivedValue, useSharedValue} from 'react-native-reanimated';

import {useLoop} from '../../shaderLib/Animations';

import {Title} from './components/Title';
import {ProgressBar} from './components/ProgressBar';
// import { Snow } from "./components/icons/Snow";
// import { Control } from "./components/Control";
// import { Wind } from "./components/icons/Wind";
// import { Sun } from "./components/icons/Sun";
// import { Power } from "./components/icons/Power";
import {Mode} from './components/Mode';
import {Control} from './components/Control';
import {Snow} from './components/icons/Snow';
import {Modalize} from 'react-native-modalize';
import {Chart} from '../Chart/Chart';
import axios from 'axios';

const width = 390;
const height = 844;
const src = rect(0, 0, width, height);

enum SenSorType {
  temperature = 'temperature',
  humidity = 'humidity',
  light = 'light',
}

export const Neumorphism = () => {
  const window = useWindowDimensions();
  const dst = rect(0, 0, window.width, window.height);
  const rects = fitRects('cover', src, dst);
  const transform = rect2rect(rects.src, rects.dst);
  const translateY = useSharedValue(0);
  // const t = useLoop({duration: 3000});
  // const x = useDerivedValue(() => mix(t.value, 0, 180), [t]);
  // const progress = useDerivedValue(() => x.value / 192, [x]);
  const progress = useSharedValue(40 / 100);
  const font = useFont(require('./components/SF-Pro-Display-Bold.otf'), 17);

  // const modalizeRef = useRef<Modalize>(null);

  // const onOpen = () => {
  //   modalizeRef.current?.open();
  // };

  const [data, setData] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false);
  const [currentTemp, setCurrentTemp] = React.useState(0);
  const [displayData, setDisplayData] = React.useState([]);
  const [type, setType] = React.useState(SenSorType.temperature);

  useEffect(() => {
    progress.value = currentTemp / 100;
  }, [currentTemp, progress]);

  const getSensors = async () => {
    try {
      const res = await axios.get(
        'https://smart-pot-server.onrender.com/sensor',
      );

      console.log('res', res);
      const data = res.data.data;

      setData(data);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getSensors();
  }, [refresh]);

  // count down to next refresh
  const [countDown, setCountDown] = React.useState(10);
  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDown - 1);
    }, 1000);
    if (countDown === 0) {
      setRefresh(!refresh);
      setCountDown(10);
    }
    return () => clearInterval(interval);
  }, [countDown, refresh]);

  useEffect(() => {
    if (data.length > 0) {
      const displayData = (data as any).map(item => {
        return {
          value: item[type],
          timeStamp: item.timeStamp,
        };
      });
      setDisplayData(displayData);
      setCurrentTemp(displayData[0].value);
    }
  }, [data, type]);

  return (
    <>
      <Canvas style={{flex: 1}} mode="continuous">
        <Group transform={transform}>
          <Group>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, height)}
              colors={['#2A2D32', '#212326', '#131313']}
            />
            <Fill />
          </Group>
          <Group>
            <Blur blur={30} />
            <Circle
              color="#56CCF2"
              opacity={0.2}
              cx={width}
              cy={height}
              r={150}
            />
          </Group>
          <Title title="Climate" />
          {/* <Text>Refresh data after {countDown}</Text> */}
          <ProgressBar progress={progress} />
          <Control
            x={0}
            y={464}
            label="Ac"
            active={true}
            progress={progress}
            font={font}>
            <Snow />
          </Control>
          {/* <Mode translateY={translateY} /> */}
        </Group>
      </Canvas>

      <Modalize alwaysOpen={200} modalStyle={styles.modalize}>
        {displayData.length > 0 && <Chart data={displayData} />}
      </Modalize>
    </>
  );
};

const styles = StyleSheet.create({
  modalize: {
    backgroundColor: '#212326',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
