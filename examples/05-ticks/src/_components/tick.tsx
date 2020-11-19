import React, { FunctionComponent, memo } from 'react';
import { Group, Line, Rect } from 'react-konva';
import { useXTransformer, useYTransformer } from 'core';
import { DomainTick } from '../ticksChart.interface';

interface TicksProps {
  tick: DomainTick;
}

const TickComponent: FunctionComponent<TicksProps> = (props) => {
  const { tick } = props;
  const xTransformer = useXTransformer();
  const yTransformer = useYTransformer();

  const x0 = xTransformer.transform(tick.x0);
  const x1 = xTransformer.transform(tick.x1);
  const open = yTransformer.transform(tick.open);
  const close = yTransformer.transform(tick.close);
  const y0 = Math.min(open, close);
  const height = Math.max(open, close) - y0;
  const high = yTransformer.transform(tick.high);
  const low = yTransformer.transform(tick.low);

  const width = x1 - x0;

  return (
    <Group>
      <Rect x={x0} y={y0} width={width} height={height} fill="cornflowerblue" />
      <Line
        stroke="green"
        strokeWidth={1}
        points={[x0 + width / 2, high, x0 + width / 2, y0]}
      />
      <Line
        stroke="red"
        strokeWidth={1}
        points={[x0 + width / 2, y0 + height, x0 + width / 2, low]}
      />
    </Group>
  );
};

export const Tick = memo(TickComponent);
