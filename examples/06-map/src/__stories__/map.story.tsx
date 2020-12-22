import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { Map } from '../map';

storiesOf('Map', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 1200);

    return <Map width={width} />;
  });
