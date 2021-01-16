import React, { FunctionComponent, memo } from 'react';
import { BottomAxis, useDimension, getTextSize } from 'core';
import { Text } from 'react-konva';

const XAxisComponent: FunctionComponent = () => {
  const dimension = useDimension();
  const text = 'Minimum Temperature (F)';
  const { width, height } = getTextSize(text);
  const x = (dimension.width + dimension.yAxisSize) / 2 - width / 2;
  const y = dimension.xAxisSize - height - 5;

  return (
    <BottomAxis fill="#f8f9fa">
      <Text x={x} y={y} text={text} />
    </BottomAxis>
  );
};

export const XAxis = memo(XAxisComponent);
