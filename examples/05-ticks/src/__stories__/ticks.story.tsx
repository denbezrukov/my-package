import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { TicksChart } from '../ticks';

storiesOf('Ticks Chart', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 800);
    const height = number('height', 400);
    const barWidth = number('bar width', 5);
    const barPadding = number('bar padding', 1);
    const amount = number('amount', 150);

    return (
      <TicksChart
        width={width}
        height={height}
        barWidth={barWidth}
        barPadding={barPadding}
        amount={amount}
      />
    );
  });
