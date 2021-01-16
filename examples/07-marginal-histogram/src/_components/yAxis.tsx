import React, { FunctionComponent, memo } from 'react';
import { getTextSize, LeftAxis, useDimension } from 'core';
import { Text } from 'react-konva';

const YAxisComponent: FunctionComponent = () => {
  const dimension = useDimension();
  const text = 'Maximum Temperature (F)';
  const { width } = getTextSize(text);
  const x = 5;
  const y = (dimension.height + width) / 2;

  return (
    <LeftAxis fill="#f8f9fa">
      <Text rotation={-90} x={x} y={y} text={text} />
    </LeftAxis>
  );
};

export const YAxis = memo(YAxisComponent);
