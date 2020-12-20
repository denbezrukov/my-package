import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { TicksChart } from '../ticksChart';

storiesOf('Ticks Chart', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 800);
    const height = number('height', 400);
    const barWidth = number('bar width', 5);
    const barPadding = number('bar padding', 1);
    const start = number('start', 0);
    const end = number('end', 150);

    return (
      <TicksChart
        width={width}
        height={height}
        barWidth={barWidth}
        barPadding={barPadding}
        start={start}
        end={end}
      />
    );
  });
