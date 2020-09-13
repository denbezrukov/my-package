import React, {
  FunctionComponent,
  memo,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  getTextSize,
  useDimension,
  useXTransformer,
  useYTransformer,
} from 'core/src';
import { Bin, max } from 'd3-array';
import { Rect as KonvaRect, Text } from 'react-konva';
import { animated, Spring, config } from 'react-spring/renderprops-konva';
import { Weather } from 'data/src';

interface IRectProps {
  x0: number;
  x1: number;
  length: number;
}

const RectComponent: React.FunctionComponent<IRectProps> = (props) => {
  const { x0, x1, length } = props;

  const { transform: xTransform } = useXTransformer();
  const { transform: yTransform } = useYTransformer();
  const dimension = useDimension();

  const barPadding = 1;

  const x = xTransform(x0 ?? 0) + barPadding / 2;
  const y = yTransform(length);
  const width =
    max([0, xTransform(x1 ?? 0) - xTransform(x0 ?? 0) - barPadding]) ?? 0;
  const height = dimension.height - y - dimension.xAxisSize;

  const text = String(length);
  const textSize = getTextSize(text);

  const xText = (width - textSize.width) / 2;
  const yText = -15;

  const [color, setColor] = useState('cornflowerblue');

  const handleMouseEnter = useCallback(() => {
    setColor('yellowgreen');
  }, [setColor]);

  const handleMouseLeave = useCallback(() => {
    setColor('cornflowerblue');
  }, [setColor]);

  const from = useMemo(() => {
    return { y: dimension.height };
  }, [dimension.height]);

  const to = useMemo(() => {
    return {
      y,
    };
  }, [y]);

  const render = useCallback(
    (animation: { y: number }) => {
      return (
        <animated.Group x={x} y={animation.y}>
          <KonvaRect
            y={0}
            x={0}
            height={height}
            width={width}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            fill={color}
          />
          <Text x={xText} y={yText} text={text} fill="darkgrey" />
        </animated.Group>
      );
    },
    [
      x,
      width,
      height,
      handleMouseEnter,
      handleMouseLeave,
      xText,
      yText,
      text,
      color,
    ],
  );

  return (
    <Spring native config={config.slow} from={from} to={to}>
      {render}
    </Spring>
  );
};

const Rect = memo(RectComponent);

interface RectsProps {
  bins: Array<Bin<Weather, number>>;
}

const RectsComponent: FunctionComponent<RectsProps> = (props) => {
  const { bins } = props;

  return (
    <>
      {bins.map((value, index) => {
        const { x0 = 0, x1 = 0, length } = value;

        return <Rect key={index} x0={x0} x1={x1} length={length} />;
      })}
    </>
  );
};

export const Rects = memo(RectsComponent);
