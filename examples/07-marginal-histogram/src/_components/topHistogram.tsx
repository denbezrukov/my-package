import React, { FunctionComponent, memo, useMemo } from 'react';
import { Path } from 'react-konva';
import { useXTransformer } from 'core';
import { bin, extent } from 'd3-array';
import { Weather } from 'data';
import { scaleLinear } from 'd3-scale';
import { area, curveBasis } from 'd3-shape';
import {
  colorAccessor,
  useColorScale,
  useFilteredWeatherList,
  useMarginalHistogramState,
  xAccessor,
} from '../marginalHistogram.constant';
import { HighlightRect } from './highlightRect';

type ArrayType<T> = T extends Array<infer R> ? R : never;

const TopHistogramComponent: FunctionComponent = () => {
  const { filter, selectedWeather } = useMarginalHistogramState();
  const filteredWeatherList = useFilteredWeatherList();
  const colorScale = useColorScale();

  const { transform } = useXTransformer<number>();

  const binsGenerator = useMemo(() => {
    const [left, right] = transform.domain();
    return bin<Weather, number>()
      .domain([left ?? 0, right ?? 0])
      .value(xAccessor)
      .thresholds(20);
  }, [transform]);

  const bins = useMemo(() => binsGenerator(filteredWeatherList), [
    binsGenerator,
    filteredWeatherList,
  ]);

  const histogramHeight = 70;

  const { scale } = useMemo(() => {
    const [left, right] = extent(bins, (value) => value.length);

    return {
      scale: scaleLinear()
        .domain([left ?? 0, right ?? 0])
        .range([histogramHeight, 0]),
    };
  }, [bins]);

  const areaGenerator = area<ArrayType<typeof bins>>()
    .x((d) => transform(((d.x0 ?? 0) + (d.x1 ?? 0)) / 2))
    .y0(histogramHeight)
    .y1((d) => scale(d.length))
    .curve(curveBasis);

  const data = areaGenerator(bins);

  const hoveredBins = useMemo(
    () =>
      binsGenerator(
        filteredWeatherList.filter((weather) => weather.isWithinRange),
      ),
    [binsGenerator, filteredWeatherList],
  );

  const hoveredData = areaGenerator(hoveredBins);

  const hoverLineThickness = 10;

  return data !== null ? (
    <>
      <Path data={data} fill="#cbd2d7" />
      {hoveredData && filter && (
        <Path data={hoveredData} fill={filter.color} stroke="white" />
      )}
      <HighlightRect
        items={
          selectedWeather
            ? [
                {
                  x:
                    transform(xAccessor(selectedWeather)) -
                    hoverLineThickness / 2,
                  height: histogramHeight + 10,
                  width: hoverLineThickness,
                  fill: colorScale(colorAccessor(selectedWeather)),
                },
              ]
            : []
        }
      />
    </>
  ) : null;
};

export const TopHistogram = memo(TopHistogramComponent);
