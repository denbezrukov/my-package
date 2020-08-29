import React, { FunctionComponent, memo, useMemo } from 'react';
import { weatherList } from 'data';
import { Layer, Path } from 'react-konva';
import { extent } from 'd3-array';
import { line } from 'd3-shape';
import {
  DimensionContext,
  InteractiveStage,
  useTransformerState,
  useXTransformer,
  useYTransformer,
  Grid,
  BottomAxis,
  RightAxis,
  YTransformerContext,
  XTransformerContext,
} from 'core';
import { scaleLinear, scaleTime } from 'd3-scale';
import { FirstProps } from './first.interface';

const Line: FunctionComponent = () => {
  const { transform: xTransform } = useXTransformer();
  const { transform: yTransform } = useYTransformer();

  const data = line()
    .x((d) => xTransform(d[0]))
    .y((d) => yTransform(d[1]))(
    weatherList.map((weather) => {
      const x = new Date(weather.date);

      return [x.getTime(), weather.temperatureMax];
    }),
  );

  return data !== null ? (
    <Path data={data} fill="transparent" strokeWidth={2} stroke="#af9358" />
  ) : null;
};

const FirstChartComponent: FunctionComponent<FirstProps> = (props) => {
  const { width, height } = props;
  const yAxisSize = 50;
  const xAxisSize = 30;

  const xDomain = useMemo<[number, number]>(() => {
    const [min, max] = extent(weatherList, (weather) => {
      const date = new Date(weather.date);
      return date.getTime();
    });
    return [min ?? 0, max ?? 0];
  }, []);
  const yDomain = useMemo<[number, number]>(() => {
    const [min, max] = extent(weatherList, (weather) => weather.temperatureMax);
    return [min ?? 0, max ?? 0];
  }, []);

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
        .range([0, (width ?? 0) - yAxisSize])
        .nice(),
    };
  }, [xDomain, width, yAxisSize]);

  const xTransformer = useTransformerState(xTransformerConfig);

  const yTransformerConfig = useMemo(() => {
    return {
      scale: scaleLinear()
        .domain(yDomain)
        .range([height ?? 0, 0])
        .nice(),
    };
  }, [yDomain, height]);

  const yTransformer = useTransformerState(yTransformerConfig);

  return (
    <DimensionContext.Provider value={dimension}>
      <XTransformerContext.Provider value={xTransformer}>
        <YTransformerContext.Provider value={yTransformer}>
          <InteractiveStage>
            <Layer>
              <Grid />
              <Line />
            </Layer>
            <Layer>
              <BottomAxis />
              <RightAxis />
            </Layer>
          </InteractiveStage>
        </YTransformerContext.Provider>
      </XTransformerContext.Provider>
    </DimensionContext.Provider>
  );
};

export const FirstChart = memo(FirstChartComponent);
