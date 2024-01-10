import React, {useEffect, useMemo, useRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
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
import {Text as RNText} from 'react-native';
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
import Icon from 'react-native-vector-icons/AntDesign';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
  const [state, setState] = React.useState({});
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

  const getState = async () => {
    try {
      const res = await axios.get(
        'https://smart-pot-server.onrender.com/state',
      );

      const data = res.data.data;

      setState(data);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getState();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
          timestamp: new Date(item.timestamp).getTime(),
        };
      });
      setDisplayData(displayData);
      setCurrentTemp(displayData[0].value);
    }
  }, [data, type]);

  const onPressLeft = () => {
    const listSensorType = Object.values(SenSorType);
    const index = listSensorType.indexOf(type);
    if (index === 0) {
      setType(listSensorType[listSensorType.length - 1]);
    } else {
      setType(listSensorType[index - 1]);
    }
  };

  const onPressRight = () => {
    const listSensorType = Object.values(SenSorType);
    const index = listSensorType.indexOf(type);
    if (index === listSensorType.length - 1) {
      setType(listSensorType[0]);
    } else {
      setType(listSensorType[index + 1]);
    }
  };

  const onPressWater = async () => {
    try {
      const res = await axios.post(
        'https://smart-pot-server.onrender.com/state/pump/active',
      );
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  const onPressLight = () => {
    try {
      const res = axios.post(
        'https://smart-pot-server.onrender.com/state/light/active',
      );
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  const titleText = useMemo(() => {
    switch (type) {
      case SenSorType.temperature:
        return 'Nhiệt độ';
      case SenSorType.humidity:
        return 'Độ ẩm';
      case SenSorType.light:
        return 'Ánh sáng';
      default:
        return '';
    }
  }, [type]);
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
          <Title title={titleText} />
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

      <Modalize alwaysOpen={120} modalStyle={styles.modalize}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingTop: 20,
            paddingBottom: 36,
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={onPressWater}
            style={{
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}>
            <MaterialIcons
              name="water-drop"
              size={30}
              color={state?.PumpStatus === true ? '#56CCF2' : 'white'}
            />
            <RNText style={styles.toggleText}>
              {state?.PumpStatus === true ? 'Đang tưới' : 'Tưới nước'}
            </RNText>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                marginRight: 30,
                padding: 4,
              }}
              onPress={onPressLeft}>
              <Icon name="left" size={18} color="white" />
            </TouchableOpacity>
            <RNText style={styles.tempText}>{currentTemp}</RNText>
            <MIcon name="temperature-celsius" size={20} color="white" />
            <TouchableOpacity
              style={{
                marginLeft: 30,
                padding: 4,
              }}
              onPress={onPressRight}>
              <Icon name="right" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onPressLight}
            style={{
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}>
            <MaterialIcons
              name="light-mode"
              size={30}
              color={state?.LightStatus === true ? '#56CCF2' : 'white'}
            />
            <RNText style={styles.toggleText}>
              {state?.LightStatus === true ? 'Đang bật' : 'Bật đèn'}
            </RNText>
          </TouchableOpacity>
        </View>
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
  tempText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 20,
  },
  toggleText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    paddingTop: 4,
  },
});
