import React, { FunctionComponent, memo } from 'react';
import {
  getTextSize,
  useDimension,
  useXTransformer,
  useYTransformer,
} from 'core/src';
import { Bin, max } from 'd3-array';
import { Group, Rect, Text } from 'react-konva';
import { Weather } from 'data/src';

interface RectsProps {
  bins: Array<Bin<Weather, number>>;
}

const RectsComponent: FunctionComponent<RectsProps> = (props) => {
  const { bins } = props;
  const { transform: xTransform } = useXTransformer();
  const { transform: yTransform } = useYTransformer();
  const dimension = useDimension();

  const barPadding = 1;

  return (
    <>
      {bins.map((value, index) => {
        const { x0, x1, length } = value;

        const x = xTransform(x0 ?? 0) + barPadding / 2;
        const y = yTransform(length);
        const width =
          max([0, xTransform(x1 ?? 0) - xTransform(x0 ?? 0) - barPadding]) ?? 0;
        const height = dimension.height - y - dimension.xAxisSize;

        const text = String(length);
        const textSize = getTextSize(text);

        const xText = (width - textSize.width) / 2;
        const yText = -15;

        return (
          <Group x={x} y={y} key={index}>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="cornflowerblue"
            />
            <Text x={xText} y={yText} text={text} fill="darkgrey" />
          </Group>
        );
      })}
    </>
  );
};

export const Rects = memo(RectsComponent);
