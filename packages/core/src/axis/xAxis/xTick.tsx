import React, { FunctionComponent, memo, useLayoutEffect, useRef } from 'react';
import { Line, Text } from 'react-konva';
import Konva from 'konva';
import { TickProps } from '../tick.inteface';

export const XTickComponent: FunctionComponent<TickProps> = (props) => {
  const { x, y, size = 5, text } = props;
  const ref = useRef<Konva.Text | null>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.offsetX(Math.round(ref.current.width() / 2));
    }
  });

  return (
    <>
      <Line points={[x, y, x, y + size]} stroke="black" strokeWidth={1} />
      <Text ref={ref} x={x} y={y + size + 5} text={text} />
    </>
  );
};

export const XTick = memo(XTickComponent);
