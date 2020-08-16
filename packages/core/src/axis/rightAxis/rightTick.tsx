import React, { FunctionComponent, memo} from 'react';
import { Line, Text } from 'react-konva';
import { TickProps } from '../tick.inteface';
import { textSize } from '../../utils/textSize';

export const RightTickComponent: FunctionComponent<TickProps> = (props) => {
  const { x, y, size = 5, text } = props;
  const { height } = textSize(text);

  return (
    <>
      <Line points={[x, y, x + size, y]} stroke="black" strokeWidth={1} />
      <Text x={x + size + 5} y={y - height / 2} text={text} />
    </>
  );
};

export const RightTick = memo(RightTickComponent);
