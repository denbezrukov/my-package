import React, { FunctionComponent, memo } from 'react';
import { BottomAxis, useDimension, getTextSize } from 'core';
import { Text } from 'react-konva';

const XAxisComponent: FunctionComponent = () => {
  const dimension = useDimension();
  const text = 'Dew point';
  const { width, height } = getTextSize(text);
  const x = (dimension.width + dimension.yAxisSize) / 2 - width / 2;
  const y = dimension.xAxisSize - height - 5;

  return (
    <BottomAxis>
      <Text x={x} y={y} text={text} />
    </BottomAxis>
  );
};

export const XAxis = memo(XAxisComponent);
