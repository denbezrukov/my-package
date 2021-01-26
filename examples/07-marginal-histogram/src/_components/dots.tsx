import React, { FunctionComponent, memo, useRef, useEffect } from 'react';
import { Circle } from 'react-konva';
import { useXTransformer, useYTransformer } from 'core';
import { Weather } from 'data';
import Konva from 'konva';
import {
  colorAccessor,
  useColorScale,
  useFilteredWeatherList,
  xAccessor,
  yAccessor,
} from '../marginalHistogram.constant';

interface DotProps {
  weather: Weather & { isWithinRange: boolean };
}

const DotComponent: FunctionComponent<DotProps> = (props) => {
  const { weather } = props;
  const ref = useRef<Konva.Circle>(null);

  const { transform: xTransform } = useXTransformer();
  const { transform: yTransform } = useYTransformer();
  const colorScale = useColorScale();

  const x = xTransform(xAccessor(weather));
  const y = yTransform(yAccessor(weather));
  const fill = colorScale(colorAccessor(weather));

  useEffect(() => {
    const handler = setTimeout(() => {
      ref.current?.to({
        radius: weather.isWithinRange ? 4 : 2,
        opacity: weather.isWithinRange ? 1 : 0.3,
        duration: 0.4,
      });
    });
    return () => clearTimeout(handler);
  }, [ref, weather.isWithinRange]);

  return (
    <Circle
      ref={ref}
      listening={false}
      perfectDrawEnabled={false}
      radius={0}
      x={x}
      y={y}
      fill={fill}
      hitStrokeWidth={0}
    />
  );
};

const Dot = memo(DotComponent);

const DotsComponent: FunctionComponent = () => {
  const filteredWeatherList = useFilteredWeatherList();

  return (
    <>
      {filteredWeatherList.map((weather, index) => (
        <Dot key={index} weather={weather} />
      ))}
    </>
  );
};

export const Dots = memo(DotsComponent);
