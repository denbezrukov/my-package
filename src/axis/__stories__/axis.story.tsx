import React, { FunctionComponent, useCallback } from 'react';
import { storiesOf } from '@storybook/react';
import { Layer, Stage, Rect, Text } from 'react-konva';
import { number, withKnobs } from '@storybook/addon-knobs';
import { XAxis } from '../xAxis/xAxis';
import { ScaleContext } from '../../scale/scale.constant';
import { useTransformerState } from '../../scale/_hooks/useTransformerState';
import { useTransformer } from '../../scale/_hooks/useTransformer';
import { YAxis } from '../yAxis/yAxis';
import { MouseMove, useMouseMove } from '../../scale/_hooks/useMouseMove';

storiesOf('axis', module)
  .addDecorator(withKnobs)
  .add('XAxis', () => {
    const width = number('width', 400);
    const height = number('height', 400);
    const size = number('size', 20);
    const from = number('from', 0);
    const to = number('to', 100);

    const scale = useTransformerState({
      domain: [from, to],
      range: [0, width],
    });

    return (
      <Stage width={width} height={height}>
        <ScaleContext.Provider value={scale}>
          <XInteractionStage width={width} height={height} size={size} />
        </ScaleContext.Provider>
      </Stage>
    );
  })
  .add('YAxis', () => {
    const width = number('width', 400);
    const height = number('height', 400);
    const size = number('size', 50);
    const from = number('from', 0);
    const to = number('to', 100);

    const scale = useTransformerState({
      domain: [from, to],
      range: [0, width],
    });

    return (
      <Stage width={width} height={height}>
        <ScaleContext.Provider value={scale}>
          <YInteractionStage width={width} height={height} size={size} />
        </ScaleContext.Provider>
      </Stage>
    );
  });

export const YInteractionStage: FunctionComponent<{
  width: number;
  height: number;
  size: number;
}> = (props) => {
  const { width, height, size } = props;
  const { setShift } = useTransformer();

  const onMove: MouseMove = useCallback(
    (event, point) => {
      const { clientY } = event;
      setShift((shift) => {
        return shift + clientY - point.y;
      });
    },
    [setShift],
  );
  const onMouseDown = useMouseMove(onMove);

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
  const { setShift } = useTransformer();

  const onMove: MouseMove = useCallback(
    (event, point) => {
      const { clientX } = event;
      setShift((shift) => {
        return shift + clientX - point.x;
      });
    },
    [setShift],
  );
  const onMouseDown = useMouseMove(onMove);

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
