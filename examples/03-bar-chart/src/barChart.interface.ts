import { Weather } from 'data';

export interface BarChartProps {
  width: number;
  height: number;
  metricAccessor: (weather: Weather) => number;
}
