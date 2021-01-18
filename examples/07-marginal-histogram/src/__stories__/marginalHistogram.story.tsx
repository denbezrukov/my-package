import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, boolean, withKnobs } from '@storybook/addon-knobs';
import { MarginalHistogram } from '../marginalHistogram';

storiesOf('Histogram', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 800);
    const height = number('height', 800);
    const isVoronoiVisible = boolean('voronoi visibility', false);

    return (
      <MarginalHistogram
        width={width}
        height={height}
        isVoronoiVisible={isVoronoiVisible}
      />
    );
  });
