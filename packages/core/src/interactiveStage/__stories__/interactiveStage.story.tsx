import React, { useMemo } from 'react';
import { storiesOf } from '@storybook/react';
import { Layer } from 'react-konva';
import { number, withKnobs } from '@storybook/addon-knobs';
import { scaleLinear } from 'd3-scale';
import { InteractiveStage } from '../interactiveStage';
import { BottomAxis } from '../../axis/botomAxis/bottomAxis';
import { RightAxis } from '../../axis/rightAxis/rightAxis';
import { Grid } from '../../grid/grid';
import { DimensionContext } from '../../dimension/dimensionContext';
import { useTransformerState } from '../../transform/_hooks/useTransformerState';
import {
  XTransformerContext,
  YTransformerContext,
} from '../../transform/transformerContext';

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

    const xTransformerConfig = useMemo(() => {
      return {
        scale: scaleLinear()
          .domain(xDomain)
          .range([0, (width ?? 0) - yAxisSize]),
      };
    }, [xDomain, width, yAxisSize]);

    const xTransformer = useTransformerState(xTransformerConfig);

    const yTransformerConfig = useMemo(() => {
      return {
        scale: scaleLinear()
          .domain(yDomain)
          .range([(height ?? 0) + xAxisSize, 0]),
      };
    }, [yDomain, height, xAxisSize]);

    const yTransformer = useTransformerState(yTransformerConfig);

    return (
      <DimensionContext.Provider value={dimension}>
        <XTransformerContext.Provider value={xTransformer}>
          <YTransformerContext.Provider value={yTransformer}>
            <InteractiveStage xDomain={xDomain} yDomain={yDomain}>
              <Layer>
                <Grid />
              </Layer>
              <Layer>
                <BottomAxis />
                <RightAxis />
              </Layer>
            </InteractiveStage>
          </YTransformerContext.Provider>
        </XTransformerContext.Provider>
      </DimensionContext.Provider>
    );
  });
