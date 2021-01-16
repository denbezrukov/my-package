import React, { FunctionComponent, memo, useCallback } from 'react';
import { Rect, Group, Line } from 'react-konva';
import Konva from 'konva';
import { RightTick } from './rightTick';
import {
  DragInteraction,
  useDragInteraction,
} from '../../transform/_hooks/useDragInteraction';
import { useYTransformer } from '../../transform/_hooks/useYTransformer';
import { useDimension } from '../../dimension/useDimension';
import { AxisProps } from '../axis.interface';

const RightAxisComponent: FunctionComponent<AxisProps> = (props) => {
  const { fill = 'white', children } = props;
  const { width, height, yAxisSize } = useDimension();
  const x = width - yAxisSize + 0.5;

  const { transform, setScale, setScaleOffset } = useYTransformer();

  const format = transform.tickFormat();

  const onDblClick = useCallback(() => {
    setScale(() => 0);
  }, [setScale]);

  const onMove: DragInteraction = useCallback(
    (event, point) => {
      const { clientY } = event;
      setScale((scale) => scale + clientY - point.y);
    },
    [setScale],
  );

  const dragInteraction = useDragInteraction(onMove);
  const onMouseDown = useCallback(
    (event: Konva.KonvaEventObject<MouseEvent>) => {
      const { offsetY } = event.evt;
      setScaleOffset(() => offsetY);
      dragInteraction(event);
    },
    [dragInteraction, setScaleOffset],
  );

  return (
    <Group x={x} y={0} onDblClick={onDblClick} onMouseDown={onMouseDown}>
      <Rect x={0} y={0} height={height} width={yAxisSize} fill={fill} />
      <Line points={[0, 0, 0, height]} stroke="black" strokeWidth={1} />
      {transform.ticks().map((tick, index) => {
        const y = transform(tick);
        const text = format(tick);
        const key = `${x}:${y}:${index}`;

        return <RightTick key={key} x={0} y={y} text={text} />;
      })}
      {children}
    </Group>
  );
};

export const RightAxis = memo(RightAxisComponent);
