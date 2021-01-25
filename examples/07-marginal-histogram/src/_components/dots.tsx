import React, { FunctionComponent, memo, useRef, useLayoutEffect } from 'react';
import { Circle } from 'react-konva';
import { useXTransformer, useYTransformer } from 'core';
import { Weather } from 'data';
import Konva from 'konva';
import { useAccessors, useColorScale } from '../marginalHistogram.constant';

interface DotProps {
  weather: Weather & { isWithinRange: boolean };
}

const DotComponent: FunctionComponent<DotProps> = (props) => {
  const { weather } = props;
  const ref = useRef<Konva.Circle>(null);

  const { transform: xTransform } = useXTransformer();
  const { transform: yTransform } = useYTransformer();
  const colorScale = useColorScale();
  const { xAccessor, yAccessor, colorAccessor } = useAccessors();

  const x = xTransform(xAccessor(weather));
  const y = yTransform(yAccessor(weather));
  const fill = colorScale(colorAccessor(weather));

  useLayoutEffect(() => {
    const handle = requestAnimationFrame(() => {
      ref.current?.to({
        radius: weather.isWithinRange ? 4 : 2,
        opacity: weather.isWithinRange ? 1 : 0.3,
      });
    });

    return () => cancelAnimationFrame(handle);
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

interface DotsProps {
  weatherList: (Weather & { isWithinRange: boolean })[];
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
