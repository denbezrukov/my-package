import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { HumidityTimeline } from '../humidityTimeline';

storiesOf('Humidity timeline', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 800);
    const height = number('height', 400);

    return <HumidityTimeline width={width} height={height} />;
  });
