import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { storiesOf } from '@storybook/react';
import { Layer, Stage, Rect, Text } from 'react-konva';
import { number, withKnobs } from '@storybook/addon-knobs';
import { XAxis } from '../xAxis/xAxis';
import {
  XTransformerContext,
  YTransformerContext,
} from '../../transform/transformerContext';
import { useTransformerState } from '../../transform/_hooks/useTransformerState';
import { YAxis } from '../yAxis/yAxis';
import {
  DragInteraction,
  useDragInteraction,
} from '../../transform/_hooks/useDragInteraction';
import { TransformerConfig } from '../../transform/transform.interface';
import { useYTransformer } from '../../transform/_hooks/useYTransformer';
import { useXTransformer } from '../../transform/_hooks/useXTransformer';
import { DimensionContext } from '../../dimension/dimensionContext';
import { useDimension } from '../../dimension/useDimension';

storiesOf('Axis', module)
  .addDecorator(withKnobs)
  .add('XAxis', () => {
    const width = number('width', 400);
    const height = number('height', 400);
    const size = number('size', 20);
    const from = number('from', 0);
    const to = number('to', 100);

    const config = useMemo<TransformerConfig>(() => {
      return {
        domain: [from, to],
        range: [0, width],
      };
    }, [from, to, width]);

    const transformer = useTransformerState(config);

    const dimension = useMemo(() => {
      return {
        width,
        height,
        yAxisSize: 0,
        xAxisSize: size,
      };
    }, [width, height, size]);

    return (
      <Stage width={width} height={height}>
        <DimensionContext.Provider value={dimension}>
          <XTransformerContext.Provider value={transformer}>
            <XInteractionStage />
          </XTransformerContext.Provider>
        </DimensionContext.Provider>
      </Stage>
    );
  })
  .add('YAxis', () => {
    const width = number('width', 400);
    const height = number('height', 400);
    const size = number('size', 50);
    const from = number('from', 0);
    const to = number('to', 100);

    const config = useMemo<TransformerConfig>(() => {
      return {
        domain: [from, to],
        range: [0, width],
      };
    }, [from, to, width]);

    const transformer = useTransformerState(config);
    const dimension = useMemo(() => {
      return {
        width,
        height,
        yAxisSize: size,
        xAxisSize: 0,
      };
    }, [width, height, size]);

    return (
      <Stage width={width} height={height}>
        <DimensionContext.Provider value={dimension}>
          <YTransformerContext.Provider value={transformer}>
            <YInteractionStage />
          </YTransformerContext.Provider>
        </DimensionContext.Provider>
      </Stage>
    );
  });

export const YInteractionStage: FunctionComponent = () => {
  const { setShift } = useYTransformer();

  const onMove: DragInteraction = useCallback(
    (event, point) => {
      const { clientY } = event;
      setShift((shift) => {
        return shift + clientY - point.y;
      });
    },
    [setShift],
  );
  const onMouseDown = useDragInteraction(onMove);

  const onDbClick = useCallback(() => {
    setShift(() => 0);
  }, [setShift]);

  const { width, height, yAxisSize: size } = useDimension();

  return (
    <Layer>
      <Rect
        onMouseDown={onMouseDown}
        onDblClick={onDbClick}
        x={0}
        y={0}
        width={width}
        height={height - size}
      />
      <Text x={width / 2} y={(height - size) / 2} text="Drag for shift" />

      <YAxis />
    </Layer>
  );
};

export const XInteractionStage: FunctionComponent = () => {
  const { setShift } = useXTransformer();

  const onMove: DragInteraction = useCallback(
    (event, point) => {
      const { clientX } = event;
      setShift((shift) => {
        return shift + clientX - point.x;
      });
    },
    [setShift],
  );
  const onMouseDown = useDragInteraction(onMove);

  const onDbClick = useCallback(() => {
    setShift(() => 0);
  }, [setShift]);

  const { width, height, xAxisSize: size } = useDimension();

  return (
    <Layer>
      <Rect
        onMouseDown={onMouseDown}
        onDblClick={onDbClick}
        x={0}
        y={0}
        width={width}
        height={height - size}
      />
      <Text x={width / 2} y={(height - size) / 2} text="Drag for shift" />

      <XAxis />
    </Layer>
  );
};
