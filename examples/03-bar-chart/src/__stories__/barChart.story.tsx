import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, select, withKnobs } from '@storybook/addon-knobs';
import { Weather } from 'data/src';
import { BarChart } from '../barChart';

type Keys =
  | 'moonPhase'
  | 'windSpeed'
  | 'dewPoint'
  | 'humidity'
  | 'uvIndex'
  | 'windBearing'
  | 'temperatureMin'
  | 'temperatureMax';
type Options = Record<string, keyof Pick<Weather, Keys>>;

storiesOf('Bar Chart', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 800);
    const height = number('height', 400);

    const label = 'Field';
    const options: Options = {
      moonPhase: 'moonPhase',
      windSpeed: 'windSpeed',
      dewPoint: 'dewPoint',
      humidity: 'humidity',
      uvIndex: 'uvIndex',
      windBearing: 'windBearing',
      temperatureMin: 'temperatureMin',
      temperatureMax: 'temperatureMax',
    };
    const defaultValue = 'moonPhase';

    const field = select(label, options, defaultValue);

    const metricAccessor = (weather: Weather) => weather[field];

    return (
      <BarChart
        key={Math.random()}
        width={width}
        height={height}
        metricAccessor={metricAccessor}
      />
    );
  });
