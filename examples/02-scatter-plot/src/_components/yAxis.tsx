import React, { FunctionComponent, memo } from 'react';
import { getTextSize, LeftAxis, useDimension } from 'core/src';
import { Text } from 'react-konva';

const YAxisComponent: FunctionComponent = () => {
  const dimension = useDimension();
  const text = 'Relative humidity';
  const { width } = getTextSize(text);
  const x = 5;
  const y = (dimension.height + width) / 2;

  return (
    <LeftAxis>
      <Text rotation={-90} x={x} y={y} text={text} />
    </LeftAxis>
  );
};

export const YAxis = memo(YAxisComponent);
