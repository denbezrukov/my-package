import React, {
  FunctionComponent,
  memo,
  useCallback,
  useMemo,
  useReducer,
} from 'react';
import { Layer, Path, Rect, Ring, Stage } from 'react-konva';
import { Weather, weatherList } from 'data';
import { extent } from 'd3-array';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateRainbow } from 'd3-scale-chromatic';
import {
  DimensionContext,
  InteractiveStage,
  useTransformerState,
  XTransformerContext,
  YTransformerContext,
} from 'core';
import { Delaunay } from 'd3-delaunay';
import Konva from 'konva';
import { HistogramProps } from './marginalHistogram.interface';
import { Dots } from './_components/dots';
import { XAxis } from './_components/xAxis';
import { YAxis } from './_components/yAxis';
import {
  AccessorsContext,
  ColorScaleContext,
  MarginalHistogramDispatchContext,
  MarginalHistogramStateContext,
} from './marginalHistogram.constant';
import { TopHistogram } from './_components/topHistogram';
import { RightHistogram } from './_components/rightHistogram';
import { Legend } from './_components/legend';
import {
  initialState,
  marginalHistogramReducer,
} from './marginalHistogram.reducer';

const MarginalHistogramComponent: FunctionComponent<HistogramProps> = (
  props,
) => {
  const { width, height, isVoronoiVisible } = props;
  const yAxisSize = 50;
  const xAxisSize = 50;

  const accessors = useMemo(
    () => ({
      xAccessor: (weather: Weather) => weather.temperatureMin,
      yAccessor: (weather: Weather) => weather.temperatureMax,
      colorAccessor: (weather: Weather) => new Date(weather.date),
    }),
    [],
  );

  const [state, dispatch] = useReducer(marginalHistogramReducer, initialState);

  const dateExtent = useMemo(() => {
    const [left, right] = extent(weatherList.map(accessors.colorAccessor));
    return [left?.getTime() ?? 0, right?.getTime() ?? 0];
  }, [accessors]);

  const temperaturesExtent = useMemo(() => {
    const [left, right] = extent([
      ...weatherList.map(accessors.xAccessor),
      ...weatherList.map(accessors.yAccessor),
    ]);

    return [left ?? 0, right ?? 0];
  }, [accessors]);

  const dimension = useMemo(
    () => ({
      width,
      height,
      yAxisSize,
      xAxisSize,
    }),
    [width, height, xAxisSize, yAxisSize],
  );

  const xTransformerConfig = useMemo(
    () => ({
      scale: scaleLinear()
        .domain(temperaturesExtent)
        .range([yAxisSize + 15, width - 15 ?? 0])
        .nice(),
    }),
    [temperaturesExtent, width, yAxisSize],
  );

  const xTransformer = useTransformerState(xTransformerConfig);

  const yTransformerConfig = useMemo(
    () => ({
      scale: scaleLinear()
        .domain(temperaturesExtent)
        .range([(height ?? 0) - xAxisSize, 15])
        .nice(),
    }),
    [temperaturesExtent, height, xAxisSize],
  );

  const yTransformer = useTransformerState(yTransformerConfig);

  const colorScale = useMemo(
    () =>
      scaleSequential()
        .domain(dateExtent)
        .interpolator((d) => interpolateRainbow(-d)),
    [dateExtent],
  );

  const onMouseLeave = useCallback(() => {
    dispatch({
      type: 'SET_WEATHER',
      selectedWeather: undefined,
    });
  }, [dispatch]);

  const voronoi = useMemo(() => {
    const delaunay = Delaunay.from(
      weatherList,
      (d) => xTransformer.transform(accessors.xAccessor(d)),
      (d) => yTransformer.transform(accessors.yAccessor(d)),
    );
    return delaunay.voronoi([0, 0, width, height]);
  }, [width, height, xTransformer, yTransformer, accessors]);

  const onMouseMove = useCallback(
    (event: Konva.KonvaEventObject<MouseEvent>) => {
      const { offsetX, offsetY } = event.evt;
      const index = voronoi.delaunay.find(offsetX, offsetY);
      const weather = weatherList[index];

      dispatch({
        type: 'SET_WEATHER',
        selectedWeather: weather,
      });
    },
    [voronoi, dispatch],
  );

  const containerStyle = {
    backgroundColor: '#f8f9fa',
    height: height * 1.2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'flex-end',
  };

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <div style={columnStyle}>
          <Stage width={dimension.width} height={80}>
            <MarginalHistogramStateContext.Provider value={state}>
              <XTransformerContext.Provider value={xTransformer}>
                <AccessorsContext.Provider value={accessors}>
                  <Layer>
                    <TopHistogram />
                  </Layer>
                </AccessorsContext.Provider>
              </XTransformerContext.Provider>
            </MarginalHistogramStateContext.Provider>
          </Stage>

          <DimensionContext.Provider value={dimension}>
            <XTransformerContext.Provider value={xTransformer}>
              <YTransformerContext.Provider value={yTransformer}>
                <InteractiveStage>
                  <MarginalHistogramDispatchContext.Provider value={dispatch}>
                    <MarginalHistogramStateContext.Provider value={state}>
                      <ColorScaleContext.Provider value={colorScale}>
                        <AccessorsContext.Provider value={accessors}>
                          <Layer
                            onMouseLeave={onMouseLeave}
                            onMouseMove={onMouseMove}
                          >
                            <Rect width={width} height={height} fill="white" />
                            <Dots />
                            {state.selectedWeather && (
                              <Ring
                                x={xTransformer.transform(
                                  accessors.xAccessor(state.selectedWeather),
                                )}
                                y={yTransformer.transform(
                                  accessors.yAccessor(state.selectedWeather),
                                )}
                                innerRadius={7}
                                outerRadius={9}
                                fill="#6F1E51"
                              />
                            )}
                          </Layer>
                          {isVoronoiVisible && (
                            <Layer>
                              <Path
                                data={voronoi.render()}
                                strokeWidth={1}
                                stroke="#5758BB"
                                listening={false}
                                perfectDrawEnabled={false}
                                hitStrokeWidth={0}
                              />
                            </Layer>
                          )}
                          <Layer>
                            <Legend />
                            <XAxis />
                            <YAxis />
                          </Layer>
                        </AccessorsContext.Provider>
                      </ColorScaleContext.Provider>
                    </MarginalHistogramStateContext.Provider>
                  </MarginalHistogramDispatchContext.Provider>
                </InteractiveStage>
              </YTransformerContext.Provider>
            </XTransformerContext.Provider>
          </DimensionContext.Provider>
        </div>

        <Stage width={80} height={dimension.height}>
          <MarginalHistogramStateContext.Provider value={state}>
            <YTransformerContext.Provider value={yTransformer}>
              <AccessorsContext.Provider value={accessors}>
                <Layer x={80} rotation={90}>
                  <RightHistogram />
                </Layer>
              </AccessorsContext.Provider>
            </YTransformerContext.Provider>
          </MarginalHistogramStateContext.Provider>
        </Stage>
      </div>
    </div>
  );
};

export const MarginalHistogram = memo(MarginalHistogramComponent);
