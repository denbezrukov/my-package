import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import { Circle, Ring } from 'react-konva';
import { useXTransformer, useYTransformer } from 'core';
import { Weather } from 'data';
import {
  useAccessors,
  useColorScale,
  useSetHoverPoint,
} from '../marginalHistogram.constant';

interface DotProps {
  weather: Weather;
}

const DotComponent: FunctionComponent<DotProps> = (props) => {
  const { weather } = props;
  const [isHovered, setHovered] = useState(false);

  const { transform: xTransform } = useXTransformer();
  const { transform: yTransform } = useYTransformer();
  const colorScale = useColorScale();
  const { xAccessor, yAccessor, colorAccessor } = useAccessors();

  const x = xTransform(xAccessor(weather));
  const y = yTransform(yAccessor(weather));
  const fill = colorScale(colorAccessor(weather));
  const setHoverPoint = useSetHoverPoint();

  const onMouseOver = useCallback(() => {
    setHovered(() => true);
    setHoverPoint({ x, y });
  }, [setHovered, setHoverPoint, x, y]);

  const onMouseLeave = useCallback(() => {
    setHovered(() => false);
    setHoverPoint(undefined);
  }, [setHovered, setHoverPoint]);

  return (
    <>
      {isHovered && (
        <Ring x={x} y={y} innerRadius={7} outerRadius={9} fill="#6F1E51" />
      )}
      <Circle
        radius={4}
        x={x}
        y={y}
        fill={fill}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      />
    </>
  );
};

const Dot = memo(DotComponent);

interface DotsProps {
  weatherList: Weather[];
}

const DotsComponent: FunctionComponent<DotsProps> = (props) => {
  const { weatherList } = props;

  return (
    <>
      {weatherList.map((weather, index) => (
        <Dot key={index} weather={weather} />
      ))}
    </>
  );
};

export const Dots = memo(DotsComponent);
