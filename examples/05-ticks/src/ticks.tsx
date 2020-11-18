import React, { FunctionComponent, memo, useMemo } from 'react';
import { Tick, ticksList } from 'data/src';
import { Layer, Rect, Line, Group } from 'react-konva';
import { extent } from 'd3-array';
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
} from 'core/src';
import { scaleLinear } from 'd3-scale';
import { TicksChartProps } from './ticks.interface';

type DomainTick = Tick & {
  x0: number;
  x1: number;
};

interface TicksProps {
  ticks: DomainTick[];
}

const Ticks: FunctionComponent<TicksProps> = (props) => {
  const { ticks } = props;
  const xTransformer = useXTransformer();
  const yTransformer = useYTransformer();

  return (
    <>
      {ticks
        .filter((tick) => {
          return tick.open !== undefined;
        })
        .map((tick, index) => {
          const x0 = xTransformer.transform(tick.x0);
          const x1 = xTransformer.transform(tick.x1);
          const open = yTransformer.transform(tick.open);
          const close = yTransformer.transform(tick.close);
          const y0 = Math.min(open, close);
          const height = Math.max(open, close) - y0;
          const high = yTransformer.transform(tick.high);
          const low = yTransformer.transform(tick.low);

          const width = x1 - x0;
          return (
            <Group key={index}>
              <Rect
                x={x0}
                y={y0}
                width={width}
                height={height}
                fill="cornflowerblue"
              />
              <Line
                stroke="green"
                strokeWidth={1}
                points={[x0 + width / 2, high, x0 + width / 2, y0]}
              />
              <Line
                stroke="red"
                strokeWidth={1}
                points={[x0 + width / 2, y0 + height, x0 + width / 2, low]}
              />
            </Group>
          );
        })}
    </>
  );
};

const TicksChartComponent: FunctionComponent<TicksChartProps> = (props) => {
  const { width, height, barWidth, barPadding, amount } = props;
  const yAxisSize = 75;
  const xAxisSize = 30;

  const list = useMemo<DomainTick[]>(() => {
    return ticksList.slice(0, amount).map((tick, index) => {
      const x0 = barPadding + index * (barWidth + barPadding);
      const x1 = x0 + barWidth;

      return {
        x0,
        x1,
        ...tick,
      };
    });
  }, [barWidth, barPadding, amount]);

  const xDomain = useMemo<[number, number]>(() => {
    return [list[0].x0 ?? 0, list[list.length - 1].x1 ?? 0];
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
              <Ticks ticks={list} />
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
