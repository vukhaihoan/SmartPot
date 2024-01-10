import {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LineChart} from 'react-native-wagmi-charts';

const dataTest = [
  {
    timestamp: 1625945400000,
    value: 33575.25,
  },
  {
    timestamp: 1625946300000,
    value: 33545.25,
  },
  {
    timestamp: 1625947200000,
    value: 28800.25,
  },
  {
    timestamp: 1625948100000,
    value: 33215.25,
  },
];

const DetailValue = ({item}) => {
  return (
    <View style={styles.detailValue}>
      <Text style={styles.detailValueText}>{item.value}</Text>
      <Text style={styles.detailValueText}>
        {new Date(item.timestamp).toDateString()}
      </Text>
    </View>
  );
};

export const Chart = ({data}) => {
  const [index, setIndex] = useState(0);
  const onCurrentIndexChange = index => {
    console.log('index', index);
    setIndex(index);
  };

  return (
    <>
      <LineChart.Provider
        data={data}
        onCurrentIndexChange={onCurrentIndexChange}>
        <LineChart>
          <LineChart.Path color="#56CCF2" />
          <LineChart.CursorCrosshair color="#56CCF2">
            <LineChart.Tooltip
              textStyle={{
                color: 'white',
              }}
            />
            <LineChart.Tooltip position="bottom">
              <LineChart.DatetimeText
                style={{
                  color: 'white',
                }}
              />
            </LineChart.Tooltip>
          </LineChart.CursorCrosshair>
        </LineChart>
      </LineChart.Provider>
      {/* <DetailValue item={data[index]} /> */}
    </>
  );
};

const styles = StyleSheet.create({});
