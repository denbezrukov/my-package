import React, { FunctionComponent, memo, useMemo, useCallback } from 'react';
import { getTextSize, useDimension, useXTransformer } from 'core/src';
import { Line, Text } from 'react-konva';
import { animated, Spring, config } from 'react-spring/renderprops-konva';

interface MeanProps {
  value: number;
}

const MeanComponent: FunctionComponent<MeanProps> = (props) => {
  const { value } = props;
  const { height, xAxisSize } = useDimension();
  const { transform } = useXTransformer();

  const x = transform(value);
  const textSize = getTextSize('mean');

  const from = useMemo(() => {
    return { y: height - xAxisSize };
  }, [height, xAxisSize]);

  const to = useMemo(() => {
    return {
      y: 0,
    };
  }, []);

  const render = useCallback(
    (animation: { y: number }) => {
      return (
        <animated.Group x={x} y={animation.y}>
          <Text x={-textSize.width / 2} y={0} text="mean" fill="maroon" />
          <Line
            points={[0, 15, 0, height - xAxisSize]}
            stroke="maroon"
            dash={[2, 4]}
          />
        </animated.Group>
      );
    },
    [textSize.width, x, height, xAxisSize],
  );

  return (
    <Spring native config={config.slow} from={from} to={to}>
      {render}
    </Spring>
  );
};

export const Mean = memo(MeanComponent);
