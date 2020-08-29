import React, {
  FunctionComponent,
  memo,
  useMemo,
  useContext,
  createContext,
} from 'react';
import { weatherList } from 'data';
import { Layer, Circle } from 'react-konva';
import { extent } from 'd3-array';
import {
  DimensionContext,
  InteractiveStage,
  useTransformerState,
  useXTransformer,
  useYTransformer,
  Grid,
  BottomAxis,
  LeftAxis,
  YTransformerContext,
  XTransformerContext,
} from 'core';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { SecondProps } from './second.interface';

const ColorScaleContext = createContext<
  ScaleLinear<string, string> | undefined
>(undefined);

const useColorScale = () => {
  const scale = useContext(ColorScaleContext);

  if (scale) {
    return scale;
  }

  throw new Error('Color scale is undefined');
};

const Dots: FunctionComponent = () => {
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

const SecondChartComponent: FunctionComponent<SecondProps> = (props) => {
  const { width, height } = props;
  const yAxisSize = 50;
  const xAxisSize = 30;

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
        .range([yAxisSize, width ?? 0])
        .nice(),
    };
  }, [xDomain, width, yAxisSize]);

  const xTransformer = useTransformerState(xTransformerConfig);

  const yTransformerConfig = useMemo(() => {
    return {
      scale: scaleLinear()
        .domain(yDomain)
        .range([(height ?? 0) + xAxisSize, 0])
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
                <Dots />
              </Layer>
              <Layer>
                <BottomAxis />
                <LeftAxis />
              </Layer>
            </ColorScaleContext.Provider>
          </InteractiveStage>
        </YTransformerContext.Provider>
      </XTransformerContext.Provider>
    </DimensionContext.Provider>
  );
};

export const SecondChart = memo(SecondChartComponent);
