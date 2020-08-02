import React, { useMemo } from 'react';
import { storiesOf } from '@storybook/react';
import { Layer } from 'react-konva';
import { number, withKnobs } from '@storybook/addon-knobs';
import { InteractiveStage } from '../interactiveStage';
import { Grid } from '../../grid/grid';
import { XAxis } from '../../axis/xAxis/xAxis';
import { YAxis } from '../../axis/yAxis/yAxis';
import { DimensionContext } from '../../dimension/dimensionContext';

storiesOf('Interactive Stage', module)
  .addDecorator(withKnobs)
  .add('Interactive Stage', () => {
    const width = number('width', 400);
    const height = number('height', 400);
    const xFrom = number('xFrom', 0);
    const xTo = number('xTo', 100);
    const yFrom = number('yFrom', -100);
    const yTo = number('yTo', 100);

    const xAxisSize = number('xAxisSize', 20);
    const yAxisSize = number('yAxisSize', 40);

    const xDomain = useMemo<[number, number]>(() => {
      return [xFrom, xTo];
    }, [xFrom, xTo]);
    const yDomain = useMemo<[number, number]>(() => {
      return [yFrom, yTo];
    }, [yFrom, yTo]);

    const dimension = useMemo(() => {
      return {
        width,
        height,
        yAxisSize,
        xAxisSize,
      };
    }, [width, height, xAxisSize, yAxisSize]);

    return (
      <InteractiveStage
        xDomain={xDomain}
        yDomain={yDomain}
        dimension={dimension}
      >
        <DimensionContext.Provider value={dimension}>
          <Layer>
            <Grid />
          </Layer>
          <Layer>
            <XAxis />
            <YAxis />
          </Layer>
        </DimensionContext.Provider>
      </InteractiveStage>
    );
  });
