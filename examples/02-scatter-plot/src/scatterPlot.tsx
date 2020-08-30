import React, { FunctionComponent, memo, useMemo } from 'react';
import { weatherList } from 'data/src';
import { Layer } from 'react-konva';
import { extent } from 'd3-array';
import {
  DimensionContext,
  InteractiveStage,
  useTransformerState,
  Grid,
  YTransformerContext,
  XTransformerContext,
} from 'core/src';
import { scaleLinear } from 'd3-scale';
import { SecondProps } from './scatterPlot.interface';
import { ColorScaleContext } from './scatterPlot.constant';
import { Dots } from './_components/dots';
import { XAxis } from './_components/xAxis';
import { YAxis } from './_components/yAxis';

const ScatterPlotComponent: FunctionComponent<SecondProps> = (props) => {
  const { width, height } = props;
  const yAxisSize = 55;
  const xAxisSize = 40;

  const xDomain = useMemo<[number, number]>(() => {
    const [min, max] = extent(weatherList, (weather) => weather.dewPoint);
    return [min ?? 0, max ?? 0];
  }, []);
  const yDomain = useMemo<[number, number]>(() => {
    const [min, max] = extent(weatherList, (weather) => weather.humidity);
    return [min ?? 0, max ?? 0];
  }, []);

  const colorDomain = useMemo<[number, number]>(() => {
    const [min, max] = extent(weatherList, (weather) => weather.cloudCover);
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
      scale: scaleLinear()
        .domain(xDomain)
        .range([yAxisSize + 15, (width ?? 0) - 15])
        .nice(),
    };
  }, [xDomain, width, yAxisSize]);

  const xTransformer = useTransformerState(xTransformerConfig);

  const yTransformerConfig = useMemo(() => {
    return {
      scale: scaleLinear()
        .domain(yDomain)
        .range([(height ?? 0) - xAxisSize, 15])
        .nice(),
    };
  }, [yDomain, height, xAxisSize]);

  const yTransformer = useTransformerState(yTransformerConfig);

  const colorScale = useMemo(() => {
    return scaleLinear<string>()
      .domain(colorDomain)
      .range(['skyblue', 'darkslategrey']);
  }, [colorDomain]);

  return (
    <DimensionContext.Provider value={dimension}>
      <XTransformerContext.Provider value={xTransformer}>
        <YTransformerContext.Provider value={yTransformer}>
          <InteractiveStage>
            <ColorScaleContext.Provider value={colorScale}>
              <Layer>
                <Grid />
                <Dots weatherList={weatherList} />
              </Layer>
              <Layer>
                <XAxis />
                <YAxis />
              </Layer>
            </ColorScaleContext.Provider>
          </InteractiveStage>
        </YTransformerContext.Provider>
      </XTransformerContext.Provider>
    </DimensionContext.Provider>
  );
};

export const ScatterPlot = memo(ScatterPlotComponent);
