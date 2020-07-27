import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { storiesOf } from '@storybook/react';
import { Layer, Stage, Rect, Text } from 'react-konva';
import { number, withKnobs } from '@storybook/addon-knobs';
import { XAxis } from '../xAxis/xAxis';
import {
  XTransformerContext,
  YTransformerContext,
} from '../../transform/transform.constant';
import { useTransformerState } from '../../transform/_hooks/useTransformerState';
import { YAxis } from '../yAxis/yAxis';
import {
  DragInteraction,
  useDragInteraction,
} from '../../transform/_hooks/useDragInteraction';
import { TransformerConfig } from '../../transform/transform.interface';
import { useYTransformer } from '../../transform/_hooks/useYTransformer';
import { useXTransformer } from '../../transform/_hooks/useXTransformer';

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

    return (
      <Stage width={width} height={height}>
        <XTransformerContext.Provider value={transformer}>
          <XInteractionStage width={width} height={height} size={size} />
        </XTransformerContext.Provider>
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

    return (
      <Stage width={width} height={height}>
        <YTransformerContext.Provider value={transformer}>
          <YInteractionStage width={width} height={height} size={size} />
        </YTransformerContext.Provider>
      </Stage>
    );
  });

export const YInteractionStage: FunctionComponent<{
  width: number;
  height: number;
  size: number;
}> = (props) => {
  const { width, height, size } = props;
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

      <YAxis width={width} height={height} size={size} />
    </Layer>
  );
};

export const XInteractionStage: FunctionComponent<{
  width: number;
  height: number;
  size: number;
}> = (props) => {
  const { width, height, size } = props;
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

      <XAxis width={width} height={height} size={size} />
    </Layer>
  );
};
