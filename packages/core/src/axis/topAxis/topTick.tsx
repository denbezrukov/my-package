import React, { FunctionComponent, memo } from 'react';
import { Line, Text } from 'react-konva';
import { TickProps } from '../tick.inteface';
import { getTextSize } from '../../utils/textSize';

export const TopTickComponent: FunctionComponent<TickProps> = (props) => {
  const { x, y, size = 5, text } = props;
  const { width, height } = getTextSize(text);

  return (
    <>
      <Line points={[x, y, x, y - size]} stroke="black" strokeWidth={1} />
      <Text
        align="center"
        x={x - width / 2}
        y={y - height - size - 5}
        text={text}
      />
    </>
  );
};

export const TopTick = memo(TopTickComponent);
