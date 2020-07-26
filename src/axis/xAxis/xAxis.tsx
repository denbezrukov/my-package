import React, { FunctionComponent, memo, useCallback } from 'react';
import { Rect, Group, Line } from 'react-konva';
import { AxisProps } from '../axis.interface';
import { XTick } from './xTick';
import { useTransformer } from '../../scale/_hooks/useTransformer';
import { MouseMove, useMouseMove } from '../../scale/_hooks/useMouseMove';

const XAxisComponent: FunctionComponent<AxisProps> = (props) => {
  const { width, height, size } = props;
  const y = height - size + 0.5;

  const { transform, setScale } = useTransformer();

  const format = transform.tickFormat();

  const onDblClick = useCallback(() => {
    setScale(() => 0);
  }, [setScale]);

  const onMove: MouseMove = useCallback(
    (event, point) => {
      const { clientX } = event;
      setScale((scale) => {
        return scale + clientX - point.x;
      });
    },
    [setScale],
  );

  const onMouseDown = useMouseMove(onMove);

  return (
    <Group onDblClick={onDblClick} onMouseDown={onMouseDown}>
      <Rect x={0} y={y} height={size} width={width} fill="transparent" />
      <Line points={[0, y, width, y]} stroke="black" strokeWidth={1} />
      {transform.ticks().map((tick) => {
        const x = transform(tick);
        const text = format(tick);
        const key = `${x}:${y}`;

        return <XTick key={key} x={x} y={y} text={text} />;
      })}
    </Group>
  );
};

export const XAxis = memo(XAxisComponent);
