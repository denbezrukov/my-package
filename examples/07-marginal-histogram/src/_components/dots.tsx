import React, { FunctionComponent, memo } from 'react';
import { Circle } from 'react-konva';
import { useXTransformer, useYTransformer } from 'core';
import { Weather } from 'data';
import { useAccessors, useColorScale } from '../marginalHistogram.constant';

interface DotProps {
  weather: Weather;
}

const DotComponent: FunctionComponent<DotProps> = (props) => {
  const { weather } = props;

  const { transform: xTransform } = useXTransformer();
  const { transform: yTransform } = useYTransformer();
  const colorScale = useColorScale();
  const { xAccessor, yAccessor, colorAccessor } = useAccessors();

  const x = xTransform(xAccessor(weather));
  const y = yTransform(yAccessor(weather));
  const fill = colorScale(colorAccessor(weather));

  return (
    <>
      <Circle
        listening={false}
        perfectDrawEnabled={false}
        radius={4}
        x={x}
        y={y}
        fill={fill}
        hitStrokeWidth={0}
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
