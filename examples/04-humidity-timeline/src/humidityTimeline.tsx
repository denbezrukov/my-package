import React, { FunctionComponent, memo, useMemo, useCallback } from 'react';
import { weatherList, Weather } from 'data/src';
import { Layer } from 'react-konva';
import { extent } from 'd3-array';
import {
  DimensionContext,
  InteractiveStage,
  useTransformerState,
  BottomAxis,
  YTransformerContext,
  XTransformerContext,
  LeftAxis,
} from 'core/src';
import { scaleLinear, scaleTime } from 'd3-scale';
import { HumidityTimelineProps } from './humidityTimeline.interface';

const BarChartComponent: FunctionComponent<HumidityTimelineProps> = (props) => {
  const { width, height } = props;
  const yAxisSize = 50;
  const xAxisSize = 30;

  const yAccessor = useCallback((weather: Weather) => weather.humidity, []);
  const xAccessor = useCallback((weather: Weather) => {
    const date = new Date(weather.date);
    return date.getTime();
  }, []);

  const dataset = useMemo(() => {
    return [...weatherList].sort((a, b) => xAccessor(a) - xAccessor(b));
  }, [xAccessor]);

  const xDomain = useMemo<[number, number]>(() => {
    const [left, right] = extent(dataset, xAccessor);
    return [left ?? 0, right ?? 0];
  }, [dataset, xAccessor]);

  const yDomain = useMemo(() => {
    const [bottom, top] = extent(dataset, yAccessor);
    return [bottom ?? 0, top ?? 0];
  }, [dataset, yAccessor]);

  const dimension = useMemo(() => {
    return {
      width,
      height,
      yAxisSize,
      xAxisSize,
    };
  }, [width, height, xAxisSize, yAxisSize]);

  const xTransformerConfig = useMemo(() => {
    return {
      scale: scaleTime()
        .domain(xDomain)
        .range([yAxisSize + 15, width ?? 0])
        .nice(),
    };
  }, [xDomain, width, yAxisSize]);

  const xTransformer = useTransformerState(xTransformerConfig);

  const yTransformerConfig = useMemo(() => {
    return {
      scale: scaleLinear()
        .domain(yDomain)
        .range([(height ?? 0) - xAxisSize, 15])
        .nice(5),
    };
  }, [yDomain, height, xAxisSize]);

  const yTransformer = useTransformerState(yTransformerConfig);

  return (
    <DimensionContext.Provider value={dimension}>
      <XTransformerContext.Provider value={xTransformer}>
        <YTransformerContext.Provider value={yTransformer}>
          <InteractiveStage>
            <Layer />
            <Layer>
              <BottomAxis />
              <LeftAxis />
            </Layer>
          </InteractiveStage>
        </YTransformerContext.Provider>
      </XTransformerContext.Provider>
    </DimensionContext.Provider>
  );
};

export const HumidityTimeline = memo(BarChartComponent);
