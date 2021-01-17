import React, { FunctionComponent, memo, useMemo } from 'react';
import { Path, Rect } from 'react-konva';
import { useXTransformer } from 'core';
import { bin, extent } from 'd3-array';
import { Weather } from 'data';
import { scaleLinear } from 'd3-scale';
import { area, curveBasis } from 'd3-shape';
import {
  useAccessors,
  useSelectedWeather,
} from '../marginalHistogram.constant';

interface TopHistogramProps {
  weatherList: Weather[];
}

type ArrayType<T> = T extends Array<infer R> ? R : never;

const TopHistogramComponent: FunctionComponent<TopHistogramProps> = (props) => {
  const { weatherList } = props;
  const { transform } = useXTransformer<number>();
  const { xAccessor } = useAccessors();
  const selectedWeather = useSelectedWeather();

  const bins = useMemo(() => {
    const [left, right] = transform.domain();
    const binsGenerator = bin<Weather, number>()
      .domain([left ?? 0, right ?? 0])
      .value(xAccessor)
      .thresholds(20);

    return binsGenerator(weatherList);
  }, [transform, xAccessor, weatherList]);

  const histogramHeight = 70;

  const { scale } = useMemo(() => {
    const [left, right] = extent(bins, (value) => value.length);

    return {
      scale: scaleLinear()
        .domain([left ?? 0, right ?? 0])
        .range([histogramHeight, 0]),
    };
  }, [bins]);

  const data = area<ArrayType<typeof bins>>()
    .x((d) => transform(((d.x0 ?? 0) + (d.x1 ?? 0)) / 2))
    .y0(histogramHeight)
    .y1((d) => scale(d.length))
    .curve(curveBasis)(bins);

  const hoverLineThickness = 10;

  return data !== null ? (
    <>
      <Path data={data} fill="#cbd2d7" />
      {selectedWeather && (
        <Rect
          x={transform(xAccessor(selectedWeather))}
          height={histogramHeight + 10}
          fill="#5758BB"
          width={hoverLineThickness}
          opacity={0.5}
        />
      )}
    </>
  ) : null;
};

export const TopHistogram = memo(TopHistogramComponent);
