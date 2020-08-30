import React, { FunctionComponent, memo } from 'react';
import { Circle } from 'react-konva';
import { useXTransformer, useYTransformer } from 'core/src';
import { useColorScale } from '../scatterPlot.constant';

interface DotsProps {
  weatherList: {
    dewPoint: number;
    humidity: number;
    cloudCover: number;
  }[];
}

const DotsComponent: FunctionComponent<DotsProps> = (props) => {
  const { weatherList } = props;
  const { transform: xTransform } = useXTransformer();
  const { transform: yTransform } = useYTransformer();
  const colorScale = useColorScale();

  return (
    <>
      {weatherList.map((weather, index) => {
        const x = xTransform(weather.dewPoint);
        const y = yTransform(weather.humidity);
        const fill = colorScale(weather.cloudCover);

        return <Circle key={index} radius={4} x={x} y={y} fill={fill} />;
      })}
    </>
  );
};

export const Dots = memo(DotsComponent);
