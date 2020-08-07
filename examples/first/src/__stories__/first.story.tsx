import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { FirstChart } from '../first';

storiesOf('First Chart', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 800);
    const height = number('height', 400);

    return <FirstChart width={width} height={height} />;
  });
