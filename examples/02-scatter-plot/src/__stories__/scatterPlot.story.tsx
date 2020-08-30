import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { ScatterPlot } from '../scatterPlot';

storiesOf('ScatterPlot', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 700);
    const height = number('height', 700);

    return <ScatterPlot width={width} height={height} />;
  });
