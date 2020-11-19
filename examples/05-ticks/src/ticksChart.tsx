import React, { FunctionComponent, memo, useMemo } from 'react';
import { ticksList } from 'data/src';
import { Layer } from 'react-konva';
import { extent } from 'd3-array';
import {
  DimensionContext,
  InteractiveStage,
  useTransformerState,
  Grid,
  BottomAxis,
  RightAxis,
  YTransformerContext,
  XTransformerContext,
} from 'core/src';
import { scaleLinear } from 'd3-scale';
import { DomainTick, TicksChartProps } from './ticksChart.interface';
import { Tick } from './_components/tick';

const TicksChartComponent: FunctionComponent<TicksChartProps> = (props) => {
  const { width, height, barWidth, barPadding, start, end } = props;
  const yAxisSize = 75;
  const xAxisSize = 30;

  const list = useMemo<DomainTick[]>(() => {
    return ticksList
      .slice(start, end)
      .map((tick, index) => {
        const x0 = barPadding + index * (barWidth + barPadding);
        const x1 = x0 + barWidth;

        return {
          x0,
          x1,
          ...tick,
        };
      })
      .filter((tick) => {
        return tick.open !== undefined;
      });
  }, [barWidth, barPadding, start, end]);

  const xDomain = useMemo<[number, number]>(() => {
    return [list[0]?.x0 ?? 0, list[list.length - 1]?.x1 ?? 0];
  }, [list]);

  const yDomain = useMemo<[number, number]>(() => {
    const values = list.flatMap((tick) => {
      return [tick.close, tick.open, tick.high, tick.low];
    });
    const [min, max] = extent(values);
    return [min ?? 0, max ?? 0];
  }, [list]);

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
        .range([(height ?? 0) - xAxisSize - 15, 15])
        .nice(),
    };
  }, [yDomain, height, xAxisSize]);

  const yTransformer = useTransformerState(yTransformerConfig);

  return (
    <DimensionContext.Provider value={dimension}>
      <XTransformerContext.Provider value={xTransformer}>
        <YTransformerContext.Provider value={yTransformer}>
          <InteractiveStage>
            <Layer>
              <Grid />
              {list.map((tick, index) => {
                return <Tick key={index} tick={tick} />;
              })}
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

export const TicksChart = memo(TicksChartComponent);
