import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { SecondChart } from '../second';

storiesOf('Second Chart', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 700);
    const height = number('height', 700);

    return <SecondChart width={width} height={height} />;
  });
