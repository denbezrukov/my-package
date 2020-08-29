import React, { memo, FunctionComponent } from 'react';
import { Group, Line } from 'react-konva';
import { useXTransformer } from '../transform/_hooks/useXTransformer';
import { useYTransformer } from '../transform/_hooks/useYTransformer';
import { useDimension } from '../dimension/useDimension';

const GridComponent: FunctionComponent = () => {
  const { width, height } = useDimension();
  const { transform: xTransform } = useXTransformer();
  const { transform: yTransform } = useYTransformer();

  return (
    <Group>
      {xTransform.ticks().map((tick, index) => {
        const x = xTransform(tick);

        return (
          <Line
            key={index}
            points={[x, 0, x, height]}
            stroke="black"
            strokeWidth={1}
          />
        );
      })}
      {yTransform.ticks().map((tick, index) => {
        const y = yTransform(tick);

        return (
          <Line
            key={index}
            points={[0, y, width, y]}
            stroke="black"
            strokeWidth={1}
          />
        );
      })}
    </Group>
  );
};

export const Grid = memo(GridComponent);
