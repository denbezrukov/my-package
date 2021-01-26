import React, { FunctionComponent, memo, useCallback } from 'react';
import { animated, config, Transition } from 'react-spring/renderprops-konva';

interface HighlightRectProps {
  items: { x: number; height: number; width: number; fill: string }[];
}

interface TransitionItem {
  x: number;
  width: number;
  height: number;
  fill: string;
}

const HighlightRectComponent: FunctionComponent<HighlightRectProps> = (
  props,
) => {
  const { items } = props;

  const render = useCallback(
    () => (style: TransitionItem & { opacity: number }) => {
      const { x, width, height, opacity, fill } = style;

      return (
        <animated.Rect
          x={x}
          height={height}
          fill={fill}
          width={width}
          opacity={opacity}
          globalCompositeOperation="color-burn"
        />
      );
    },
    [],
  );

  const initial = useCallback(
    (item: TransitionItem) => ({
      x: item.x,
      height: item.height,
      width: item.width,
      opacity: 0,
      fill: 'transparent',
    }),
    [],
  );

  const from = useCallback(
    (item: TransitionItem) => ({
      x: item.x,
      height: item.height,
      width: item.width,
      opacity: 0.5,
      fill: item.fill,
    }),
    [],
  );

  const update = useCallback(
    (item: TransitionItem) => ({
      x: item.x,
      height: item.height,
      width: item.width,
      opacity: 0.5,
      fill: item.fill,
    }),
    [],
  );

  const leave = useCallback(
    (item: TransitionItem) => ({
      x: item.x,
      height: item.height,
      width: item.width,
      opacity: 0,
      fill: item.fill,
    }),
    [],
  );

  return (
    <Transition
      config={config.default}
      items={items}
      initial={initial}
      from={initial}
      enter={from}
      update={update}
      leave={leave}
    >
      {render}
    </Transition>
  );
};

export const HighlightRect = memo(HighlightRectComponent);
