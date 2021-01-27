import React, { memo, useMemo, useCallback } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { interpolateRainbow } from 'd3-scale-chromatic';
import { useDimension, TopTick, getTextSize, rafDebounce } from 'core';
import { scaleLinear } from 'd3-scale';
import Konva from 'konva';
import { median } from 'd3-array';
import {
  useColorScale,
  useMarginalHistogramDispatch,
  useMarginalHistogramState,
} from '../marginalHistogram.constant';

const LegendComponent: React.FunctionComponent = () => {
  const { width, height } = useDimension();
  const colorScale = useColorScale();
  const dispatch = useMarginalHistogramDispatch();
  const { filter } = useMarginalHistogramState();

  const legendWidth = 250;
  const legendHeight = 30;
  const legendHighlightBarWidth = legendWidth * 0.15;

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

  const onMouseMove = useMemo(
    () =>
      rafDebounce((event: Konva.KonvaEventObject<MouseEvent>) => {
        const x = event.evt.offsetX - (width - legendWidth - 40);
        const point =
          median([
            0,
            x - legendHighlightBarWidth / 2,
            legendWidth - legendHighlightBarWidth,
          ]) ?? 0;

        const to = new Date(
          legendTickScale.invert((point ?? 0) + legendHighlightBarWidth / 2),
        );
        const from = new Date(
          legendTickScale.invert((point ?? 0) - legendHighlightBarWidth / 2),
        );
        const date = new Date(legendTickScale.invert(point));
        const color = colorScale(date);

        dispatch({
          type: 'SET_FILTER',
          filter: {
            to,
            from,
            color,
          },
        });
      }),
    [
      dispatch,
      width,
      legendHighlightBarWidth,
      legendTickScale,
      colorScale,
      legendWidth,
    ],
  );

  const onMouseLeave = useCallback(() => {
    onMouseMove.cancel();
    dispatch({
      type: 'SET_FILTER',
      filter: undefined,
    });
  }, [dispatch, onMouseMove]);

  const formatterHighlight = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
  });

  const text = [
    formatterHighlight.format(filter?.to),
    formatterHighlight.format(filter?.from),
  ].join(' - ');

  const textSize = getTextSize(text);

  return (
    <Group x={width - legendWidth - 40} y={height - 100}>
      <Rect
        height={legendHeight}
        width={legendWidth}
        fillLinearGradientStartPoint={gradient.start}
        fillLinearGradientEndPoint={gradient.end}
        fillLinearGradientColorStops={gradient.stops}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />

      {filter === undefined ? (
        <Group y={5}>
          {legendTickScale.ticks(3).map((tick, index) => {
            const date = new Date(tick);
            const tickText = formatter.format(date);
            const x = legendTickScale(tick);
            const key = `${x}:${index}`;

            return <TopTick key={key} x={x} y={0} text={tickText} />;
          })}
        </Group>
      ) : (
        <Group
          listening={false}
          x={legendTickScale(filter.to) - legendHighlightBarWidth / 2}
        >
          <Text
            align="center"
            x={(legendHighlightBarWidth - textSize.width) / 2}
            y={-(textSize.height + 5)}
            text={text}
          />
          <Rect
            height={legendHeight}
            width={legendHighlightBarWidth}
            fill="rgba(2, 255, 255, 0.3)"
            strokeWidth={2}
            stroke="white"
          />
        </Group>
      )}
    </Group>
  );
};

export const Legend = memo(LegendComponent);
