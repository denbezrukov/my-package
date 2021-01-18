import React, { memo, useMemo } from 'react';
import { Group, Rect } from 'react-konva';
import { interpolateRainbow } from 'd3-scale-chromatic';
import { useDimension, TopTick } from 'core';
import { scaleLinear } from 'd3-scale';
import { useColorScale } from '../marginalHistogram.constant';

const LegendComponent: React.FunctionComponent = () => {
  const { width, height } = useDimension();
  const colorScale = useColorScale();

  const legendWidth = 250;
  const legendHeight = 26;

  const legendTickScale = useMemo(
    () => scaleLinear().domain(colorScale.domain()).range([0, legendWidth]),
    [legendWidth, colorScale],
  );

  const gradient = useMemo(() => {
    const numberOfGradientStops = 10;

    const stops = Array.from(Array(10).keys()).map(
      (value, i) => i / (numberOfGradientStops - 1),
    );

    return {
      start: {
        x: 0,
        y: legendHeight / 2,
      },
      end: {
        x: legendWidth,
        y: legendHeight / 2,
      },
      stops: stops.flatMap((stop) => [stop, interpolateRainbow(-stop)]),
    };
  }, [legendWidth, legendHeight]);

  const formatter = new Intl.DateTimeFormat('en', { month: 'short' });

  return (
    <Group x={width - legendWidth - 20} y={height - 90}>
      <Rect
        height={legendHeight}
        width={legendWidth}
        fillLinearGradientStartPoint={gradient.start}
        fillLinearGradientEndPoint={gradient.end}
        fillLinearGradientColorStops={gradient.stops}
      />
      <Group y={5}>
        {legendTickScale.ticks(3).map((tick, index) => {
          const date = new Date(tick);
          const text = formatter.format(date);
          const x = legendTickScale(tick);
          const key = `${x}:${index}`;

          return <TopTick key={key} x={x} y={0} text={text} />;
        })}
      </Group>
    </Group>
  );
};

export const Legend = memo(LegendComponent);
