import React, { FunctionComponent, memo, useMemo } from 'react';
import { weatherList, Weather } from 'data/src';
import { Layer, Rect, Text } from 'react-konva';
import { extent, max, histogram, Bin } from 'd3-array';
import {
  DimensionContext,
  InteractiveStage,
  useTransformerState,
  BottomAxis,
  YTransformerContext,
  XTransformerContext,
  useXTransformer,
  useYTransformer,
  useDimension,
} from 'core/src';
import { scaleLinear } from 'd3-scale';
import { BarChartProps } from './barChart.interface';

interface RectsProps {
  bins: Array<Bin<Weather, number>>;
}

const RectsComponent: FunctionComponent<RectsProps> = (props) => {
  const { bins } = props;
  const { transform: xTransform } = useXTransformer();
  const { transform: yTransform } = useYTransformer();
  const dimension = useDimension();

  const barPadding = 1;

  return (
    <>
      {bins.map((value, index) => {
        const x = xTransform(value.x0 ?? 0) + barPadding / 2;
        const y = yTransform(value.length);
        const width =
          max([
            0,
            xTransform(value.x1 ?? 0) - xTransform(value.x0 ?? 0) - barPadding,
          ]) ?? 0;
        const height = dimension.height - y;

        const text = String(value.length);
        const xText = xTransform(value.x0 ?? 0) + width / 2;
        const yText = y - 5;

        return (
          <React.Fragment key={index}>
            <Rect
              x={x}
              y={y}
              width={width}
              height={height}
              fill="cornflowerblue"
            />
            <Text x={xText} y={yText} text={text} />
          </React.Fragment>
        );
      })}
    </>
  );
};

const Rects = memo(RectsComponent);

const BarChartComponent: FunctionComponent<BarChartProps> = (props) => {
  const { width, height } = props;
  const yAxisSize = 50;
  const xAxisSize = 30;

  const xDomain = useMemo<[number, number]>(() => {
    const [left, right] = extent(weatherList, (weather) => weather.humidity);
    return [left ?? 0, right ?? 0];
  }, []);

  const bins = useMemo(() => {
    const binsGenerator = histogram<Weather, number>()
      .domain(xDomain)
      .value((weather) => weather.humidity)
      .thresholds(12);

    return binsGenerator(weatherList);
  }, [xDomain]);

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

  return (
    <DimensionContext.Provider value={dimension}>
      <XTransformerContext.Provider value={xTransformer}>
        <YTransformerContext.Provider value={yTransformer}>
          <InteractiveStage disableYInteraction>
            <Layer>
              <Rects bins={bins} />
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
