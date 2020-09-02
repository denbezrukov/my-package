import { Weather } from 'data/src';

export interface BarChartProps {
  width: number;
  height: number;
  metricAccessor: (weather: Weather) => number;
}
