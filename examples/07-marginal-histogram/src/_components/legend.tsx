import React, { memo, useMemo, useState, useCallback } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { interpolateRainbow } from 'd3-scale-chromatic';
import { useDimension, TopTick, getTextSize } from 'core';
import { scaleLinear } from 'd3-scale';
import Konva from 'konva';
import { median } from 'd3-array';
import { useColorScale } from '../marginalHistogram.constant';

const LegendComponent: React.FunctionComponent = () => {
  const { width, height } = useDimension();
  const colorScale = useColorScale();

  const legendWidth = 250;
  const legendHeight = 30;
  const legendHighlightBarWidth = legendWidth * 0.05;

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

  const [pivot, setPivot] = useState<number | undefined>(undefined);

  const onMouseMove = useCallback(
    (event: Konva.KonvaEventObject<MouseEvent>) => {
      setPivot(event.evt.offsetX - event.currentTarget.getClientRect().x);
    },
    [setPivot],
  );

  const onMouseLeave = useCallback(() => {
    setPivot(undefined);
  }, [setPivot]);

  const formatterHighlight = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
  });

  const minDateToHighlight = new Date(
    legendTickScale.invert((pivot ?? 0) - legendHighlightBarWidth / 2),
  );
  const maxDateToHighlight = new Date(
    legendTickScale.invert((pivot ?? 0) + legendHighlightBarWidth / 2),
  );

  const text = [
    formatterHighlight.format(minDateToHighlight),
    formatterHighlight.format(maxDateToHighlight),
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

      {pivot === undefined ? (
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
          x={median([
            0,
            pivot - legendHighlightBarWidth / 2,
            legendWidth - legendHighlightBarWidth,
          ])}
        >
          <Text
            align="center"
            x={legendHighlightBarWidth - textSize.width / 2}
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
