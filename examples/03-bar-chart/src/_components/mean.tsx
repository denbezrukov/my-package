import React, { FunctionComponent, memo } from 'react';
import { getTextSize, useDimension, useXTransformer } from 'core/src';
import { Group, Line, Text } from 'react-konva';

interface MeanProps {
  value: number;
}

const MeanComponent: FunctionComponent<MeanProps> = (props) => {
  const { value } = props;
  const { height, xAxisSize } = useDimension();
  const { transform } = useXTransformer();

  const x = transform(value);
  const textSize = getTextSize('mean');

  return (
    <Group x={x} y={0}>
      <Text x={-textSize.width / 2} y={0} text="mean" fill="maroon" />
      <Line
        points={[0, 15, 0, height - xAxisSize]}
        stroke="maroon"
        dash={[2, 4]}
      />
    </Group>
  );
};

export const Mean = memo(MeanComponent);
