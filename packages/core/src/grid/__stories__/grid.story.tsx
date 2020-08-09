import React, { useMemo } from 'react';
import { storiesOf } from '@storybook/react';
import { Layer, Stage } from 'react-konva';
import { number, withKnobs } from '@storybook/addon-knobs';
import { scaleLinear } from 'd3-scale';
import {
  XTransformerContext,
  YTransformerContext,
} from '../../transform/transformerContext';
import { useTransformerState } from '../../transform/_hooks/useTransformerState';

import { Grid } from '../grid';
import { DimensionContext } from '../../dimension/dimensionContext';

storiesOf('Grid', module)
  .addDecorator(withKnobs)
  .add('Grid', () => {
    const width = number('width', 400);
    const height = number('height', 400);
    const from = number('from', 0);
    const to = number('to', 100);

    const xTransformerConfig = useMemo(() => {
      return {
        scale: scaleLinear()
          .domain([from, to])
          .range([10, width - 10]),
      };
    }, [from, to, width]);

    const xTransformer = useTransformerState(xTransformerConfig);

    const yTransformerConfig = useMemo(() => {
      return {
        scale: scaleLinear()
          .domain([from, to])
          .range([10, width - 10]),
      };
    }, [from, to, width]);

    const yTransformer = useTransformerState(yTransformerConfig);

    const dimension = useMemo(() => {
      return {
        width,
        height,
        yAxisSize: 0,
        xAxisSize: 0,
      };
    }, [width, height]);

    return (
      <Stage width={width} height={height}>
        <DimensionContext.Provider value={dimension}>
          <XTransformerContext.Provider value={xTransformer}>
            <YTransformerContext.Provider value={yTransformer}>
              <Layer>
                <Grid />
              </Layer>
            </YTransformerContext.Provider>
          </XTransformerContext.Provider>
        </DimensionContext.Provider>
      </Stage>
    );
  });
