import React, { FunctionComponent, memo, useMemo } from 'react';
import { Path, Rect } from 'react-konva';
import { useYTransformer } from 'core';
import { bin, extent } from 'd3-array';
import { Weather } from 'data';
import { scaleLinear } from 'd3-scale';
import { area, curveBasis } from 'd3-shape';
import { useAccessors, useHoverPoint } from '../marginalHistogram.constant';

interface TopHistogramProps {
  weatherList: Weather[];
}

type ArrayType<T> = T extends Array<infer R> ? R : never;

const RightHistogramComponent: FunctionComponent<TopHistogramProps> = (
  props,
) => {
  const { weatherList } = props;
  const { transform } = useYTransformer<number>();
  const { yAccessor } = useAccessors();
  const point = useHoverPoint();

  const bins = useMemo(() => {
    const [left, right] = transform.domain();
    const binsGenerator = bin<Weather, number>()
      .domain([left ?? 0, right ?? 0])
      .value(yAccessor)
      .thresholds(20);

    return binsGenerator(weatherList);
  }, [transform, yAccessor, weatherList]);

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
      {point && (
        <Rect
          x={point.y}
          height={histogramHeight + 10}
          fill="#5758BB"
          width={hoverLineThickness}
          opacity={0.5}
        />
      )}
    </>
  ) : null;
};

export const RightHistogram = memo(RightHistogramComponent);
