import React, { FunctionComponent, memo } from 'react';
import { Line, Text } from 'react-konva';
import { TickProps } from '../tick.inteface';
import { textSize } from '../../utils/textSize';

export const BottomTickComponent: FunctionComponent<TickProps> = (props) => {
  const { x, y, size = 5, text } = props;
  const { width } = textSize(text);

  return (
    <>
      <Line points={[x, y, x, y + size]} stroke="black" strokeWidth={1} />
      <Text align="center" x={x - width / 2} y={y + size + 5} text={text} />
    </>
  );
};

export const BottomTick = memo(BottomTickComponent);
