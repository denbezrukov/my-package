import React, { FunctionComponent, memo, useMemo } from 'react';
import { weatherList, Weather } from 'data/src';
import { Layer } from 'react-konva';
import { extent, max, histogram, mean } from 'd3-array';
import {
  DimensionContext,
  InteractiveStage,
  useTransformerState,
  BottomAxis,
  YTransformerContext,
  XTransformerContext,
} from 'core/src';
import { scaleLinear } from 'd3-scale';
import { BarChartProps } from './barChart.interface';
import { Mean } from './_components/mean';
import { Rects } from './_components/rects';

const BarChartComponent: FunctionComponent<BarChartProps> = (props) => {
  const { width, height, metricAccessor } = props;
  const yAxisSize = 50;
  const xAxisSize = 30;

  const xDomain = useMemo<[number, number]>(() => {
    const [left, right] = extent(weatherList, metricAccessor);
    return [left ?? 0, right ?? 0];
  }, [metricAccessor]);

  const bins = useMemo(() => {
    const binsGenerator = histogram<Weather, number>()
      .domain(xDomain)
      .value(metricAccessor)
      .thresholds(12);

    return binsGenerator(weatherList);
  }, [xDomain, metricAccessor]);

  const yDomain = useMemo(() => {
    const top = max(bins, (bin) => bin.length);
    return [0, top ?? 0];
  }, [bins]);

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
        .range([15, (width ?? 0) - yAxisSize - 15])
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

  const meanValue = useMemo(() => {
    return mean(weatherList, metricAccessor) ?? 0;
  }, [metricAccessor]);

  return (
    <DimensionContext.Provider value={dimension}>
      <XTransformerContext.Provider value={xTransformer}>
        <YTransformerContext.Provider value={yTransformer}>
          <InteractiveStage disableYInteraction>
            <Layer>
              <Rects bins={bins} />
              <Mean value={meanValue} />
            </Layer>
            <Layer>
              <BottomAxis />
            </Layer>
          </InteractiveStage>
        </YTransformerContext.Provider>
      </XTransformerContext.Provider>
    </DimensionContext.Provider>
  );
};

export const BarChart = memo(BarChartComponent);
