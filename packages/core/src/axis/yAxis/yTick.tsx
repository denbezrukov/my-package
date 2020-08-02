import React, { FunctionComponent, memo, useLayoutEffect, useRef } from 'react';
import { Line, Text } from 'react-konva';
import Konva from 'konva';
import { TickProps } from '../tick.inteface';

export const YTickComponent: FunctionComponent<TickProps> = (props) => {
  const { x, y, size = 5, text } = props;
  const ref = useRef<Konva.Text | null>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.offsetY(Math.round(ref.current.height() / 2));
    }
  });

  return (
    <>
      <Line points={[x, y, x + size, y]} stroke="black" strokeWidth={1} />
      <Text ref={ref} x={x + size + 5} y={y} text={text} />
    </>
  );
};

export const YTick = memo(YTickComponent);
