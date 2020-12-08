import React, {
  FunctionComponent,
  memo,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {
  getTextSize,
  useDimension,
  useXTransformer,
  useYTransformer,
} from 'core';
import { Bin, max } from 'd3-array';
import { animated, config, Transition } from 'react-spring/renderprops-konva';
import { Weather } from 'data';

interface IRectProps {
  x0: number;
  x1: number;
  y: number;
  text: string;
  color: string;
}

const RectComponent: React.FunctionComponent<IRectProps> = (props) => {
  const { x0, x1, y, text, color } = props;

  const dimension = useDimension();

  const barPadding = 1;

  const x = x0 + barPadding / 2;
  const width = max([0, x1 - x0 - barPadding]) ?? 0;
  const height = dimension.height - y - dimension.xAxisSize;

  const textSize = getTextSize(text);

  const xText = (width - textSize.width) / 2;
  const yText = -15;

  const [isHover, setHover] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setHover(true);
  }, [setHover]);

  const handleMouseLeave = useCallback(() => {
    setHover(false);
  }, [setHover]);

  const fill = isHover ? 'yellowgreen' : color;

  return (
    <animated.Group x={x} y={y}>
      <animated.Rect
        y={0}
        x={0}
        height={height}
        width={width}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        fill={fill}
      />
      <animated.Text x={xText} y={yText} text={text} fill="darkgrey" />
    </animated.Group>
  );
};

const Rect = memo(RectComponent);

interface RectsProps {
  bins: Array<Bin<Weather, number>>;
}

interface TransitionItem {
  x0: number;
  x1: number;
  y: number;
  length: number;
  index: number;
}

const RectsComponent: FunctionComponent<RectsProps> = (props) => {
  const { bins } = props;
  const xTransform = useXTransformer();
  const yTransform = useYTransformer();
  const dimension = useDimension();

  const initialY = dimension.height - dimension.xAxisSize;

  const items = useMemo(
    () =>
      bins.map((item, index) => {
        const { x0, x1, length } = item;

        return {
          x0: xTransform.transform(x0 ?? 0),
          x1: xTransform.transform(x1 ?? 0),
          y: yTransform.transform(length ?? 0),
          length,
          index,
        };
      }),
    [bins, xTransform, yTransform],
  );

  const keys = useCallback((item: TransitionItem) => item.index, []);

  const initial = useCallback(
    (item: TransitionItem) => {
      const { x0, x1 } = item;
      return {
        x0,
        x1,
        y: initialY,
        length: 0,
      };
    },
    [initialY],
  );

  const from = useCallback(
    (item: TransitionItem) => {
      const { x0, x1 } = item;
      return {
        x0,
        x1,
        y: initialY,
        length: 0,
      };
    },
    [initialY],
  );

  const enter = useCallback((item: TransitionItem) => {
    const { x0, x1, y, length } = item;
    return {
      x0,
      x1,
      y,
      length,
    };
  }, []);

  const update = useCallback((item: TransitionItem) => {
    const { x0, x1, y, length } = item;
    return {
      x0,
      x1,
      y,
      length,
    };
  }, []);

  const leave = useCallback(
    (item: TransitionItem) => {
      const { x0, x1 } = item;

      return {
        x0,
        x1,
        y: 2 * dimension.height,
        length: 0,
        color: 'orangered',
      };
    },
    [dimension],
  );

  const render = useCallback(
    (item: TransitionItem) => (style: {
      x0: number;
      x1: number;
      y: number;
      length: number;
      color?: string;
    }) => {
      const { x0, x1, y, length, color } = style;
      const text = String(Math.ceil(length));
      const { index } = item;

      return (
        <Rect
          key={index}
          x0={x0}
          x1={x1}
          y={y}
          text={text}
          color={color ?? 'cornflowerblue'}
        />
      );
    },
    [],
  );

  return (
    <Transition
      config={config.default}
      items={items}
      keys={keys}
      initial={initial}
      from={from}
      enter={enter}
      update={update}
      leave={leave}
    >
      {render}
    </Transition>
  );
};

export const Rects = memo(RectsComponent);
