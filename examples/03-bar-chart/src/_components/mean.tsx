import React, { FunctionComponent, memo, useCallback, useMemo } from 'react';
import { getTextSize, useDimension, useXTransformer } from 'core/src';
import { Line, Text } from 'react-konva';
import { animated, config, Transition } from 'react-spring/renderprops-konva';

interface MeanProps {
  value: number;
}

const MeanComponent: FunctionComponent<MeanProps> = (props) => {
  const { value } = props;
  const { height, xAxisSize } = useDimension();
  const xTransform = useXTransformer();

  const { width: textWidth } = getTextSize('mean');

  const items = useMemo(() => {
    return [
      {
        x: xTransform.transform(value),
        y: 0,
        index: 0,
      },
    ];
  }, [xTransform, value]);

  const keys = useCallback((item: { index: number }) => {
    return item.index;
  }, []);

  const from = useCallback(
    (item: { x: number }) => {
      const { x } = item;

      return {
        x,
        y: height - xAxisSize,
      };
    },
    [height, xAxisSize],
  );

  const initial = useCallback(
    (item: { x: number }) => {
      const { x } = item;

      return {
        x,
        y: height - xAxisSize,
      };
    },
    [height, xAxisSize],
  );

  const enter = useCallback((item: { x: number }) => {
    const { x } = item;

    return {
      x,
      y: 0,
    };
  }, []);

  const update = useCallback((item: { x: number }) => {
    const { x } = item;

    return {
      x,
      y: 0,
    };
  }, []);

  const render = useCallback(
    (item: { index: number }) => (style: { x: number; y: number }) => {
      const { x, y } = style;

      return (
        <animated.Group x={x} y={y} key={item.index}>
          <Text x={-textWidth / 2} y={0} text="mean" fill="maroon" />
          <Line
            points={[0, 15, 0, height - xAxisSize]}
            stroke="maroon"
            dash={[2, 4]}
          />
        </animated.Group>
      );
    },
    [height, xAxisSize, textWidth],
  );

  return (
    <Transition
      items={items}
      keys={keys}
      config={config.default}
      from={from}
      initial={initial}
      enter={enter}
      update={update}
    >
      {render}
    </Transition>
  );
};

export const Mean = memo(MeanComponent);
