import React, { FunctionComponent, memo, useCallback } from 'react';
import { Rect, Group, Line } from 'react-konva';
import { AxisProps } from '../axis.interface';
import { useTransformer } from '../../scale/_hooks/useTransformer';
import { YTick } from './yTick';
import { MouseMove, useMouseMove } from '../../scale/_hooks/useMouseMove';

const YAxisComponent: FunctionComponent<AxisProps> = (props) => {
  const { width, height, size } = props;
  const x = width - size + 0.5;

  const { transform, setScale } = useTransformer();

  const format = transform.tickFormat();

  const onDblClick = useCallback(() => {
    setScale(() => 0);
  }, [setScale]);

  const onMove: MouseMove = useCallback(
    (event, point) => {
      const { clientY } = event;
      setScale((scale) => {
        return scale + clientY - point.y;
      });
    },
    [setScale],
  );

  const onMouseDown = useMouseMove(onMove);

  return (
    <Group onDblClick={onDblClick} onMouseDown={onMouseDown}>
      <Rect x={x} y={0} height={height} width={size} fill="transparent" />
      <Line points={[x, 0, x, height]} stroke="black" strokeWidth={1} />
      {transform.ticks().map((tick) => {
        const y = transform(tick);
        const text = format(tick);
        const key = `${x}:${y}`;

        return <YTick key={key} x={x} y={y} text={text} />;
      })}
    </Group>
  );
};

export const YAxis = memo(YAxisComponent);
