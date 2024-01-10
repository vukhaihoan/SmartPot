import {LineChart} from 'react-native-wagmi-charts';

const data = [
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

export const Chart = ({data}) => {
  return (
    <LineChart.Provider data={data}>
      <LineChart>
        <LineChart.Path color="#56CCF2" />
        <LineChart.CursorCrosshair />
        <LineChart.Tooltip cursorGutter={60} xGutter={16} yGutter={16} />
      </LineChart>
    </LineChart.Provider>
  );
};
