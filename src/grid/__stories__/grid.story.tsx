import React, { useMemo } from 'react';
import { storiesOf } from '@storybook/react';
import { Layer, Stage } from 'react-konva';
import { number, withKnobs } from '@storybook/addon-knobs';
import {
  XTransformerContext,
  YTransformerContext,
} from '../../transform/transform.constant';
import { useTransformerState } from '../../transform/_hooks/useTransformerState';

import { TransformerConfig } from '../../transform/transform.interface';
import { Grid } from '../grid';

storiesOf('Grid', module)
  .addDecorator(withKnobs)
  .add('Grid', () => {
    const width = number('width', 400);
    const height = number('height', 400);
    const from = number('from', 0);
    const to = number('to', 100);

    const xTransformerConfig = useMemo<TransformerConfig>(() => {
      return {
        domain: [from, to],
        range: [0, width],
      };
    }, [from, to, width]);

    const xTransformer = useTransformerState(xTransformerConfig);

    const yTransformerConfig = useMemo<TransformerConfig>(() => {
      return {
        domain: [from, to],
        range: [0, width],
      };
    }, [from, to, width]);

    const yTransformer = useTransformerState(yTransformerConfig);

    return (
      <Stage width={width} height={height}>
        <Layer>
          <XTransformerContext.Provider value={xTransformer}>
            <YTransformerContext.Provider value={yTransformer}>
              <Grid width={width} height={height} />
            </YTransformerContext.Provider>
          </XTransformerContext.Provider>
        </Layer>
      </Stage>
    );
  });
