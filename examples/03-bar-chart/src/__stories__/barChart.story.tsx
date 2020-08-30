import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { BarChart } from '../barChart';

storiesOf('Bar Chart', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 800);
    const height = number('height', 400);

    return <BarChart width={width} height={height} />;
  });
