import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { MarginalHistogram } from '../marginalHistogram';

storiesOf('Histogram', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 800);
    const height = number('height', 800);

    return <MarginalHistogram width={width} height={height} />;
  });
