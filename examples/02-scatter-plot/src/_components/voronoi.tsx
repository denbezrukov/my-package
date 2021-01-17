import { Delaunay, Voronoi as VoronoiType } from 'd3-delaunay';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDimension, useXTransformer, useYTransformer } from 'core';
import { Path } from 'react-konva';
import { line } from 'd3-shape';

interface CellProps<P> {
  index: number;
  data: string;
  voronoi: VoronoiType<P>;

  isNeighbor: boolean;
  onHover: (index: number | undefined, value: number[]) => void;
}

const Cell = <
  P extends {
    dewPoint: number;
    humidity: number;
  }
>(
  props: CellProps<P>,
) => {
  const { data, index, voronoi, isNeighbor, onHover } = props;
  const [isHovered, setHovered] = useState(false);
  const onMouseEnter = useCallback(() => {
    setHovered(true);
    onHover(index, [...voronoi.neighbors(index)]);
  }, [setHovered, voronoi, index, onHover]);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
    onHover(undefined, []);
  }, [setHovered, onHover]);

  const stroke = 'salmon';
  const strokeWidth = 1;
  const normalColor = isNeighbor ? '#cfc' : 'transparent';
  const fill = isHovered ? '#0f0' : normalColor;

  return (
    <Path
      key={data}
      data={data}
      fill={fill}
      strokeWidth={strokeWidth}
      stroke={stroke}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};

interface VoronoiProps {
  weatherList: {
    dewPoint: number;
    humidity: number;
  }[];
}

const VoronoiComponent: React.FunctionComponent<VoronoiProps> = (props) => {
  const { weatherList } = props;
  const { width, height } = useDimension();
  const xTransformer = useXTransformer();
  const yTransformer = useYTransformer();
  const [neighbors, setNeighbors] = useState<number[]>([]);
  const [centerIndex, setCenterIndex] = useState<number | undefined>(undefined);

  const onHover = useCallback(
    (index: number | undefined, value: number[]) => {
      setNeighbors(value);
      setCenterIndex(index);
    },
    [setNeighbors, setCenterIndex],
  );

  const voronoi = useMemo(() => {
    const delaunay = Delaunay.from(
      weatherList,
      (d) => xTransformer.transform(d.dewPoint),
      (d) => yTransformer.transform(d.humidity),
    );
    return delaunay.voronoi([0, 0, width, height]);
  }, [weatherList, width, height, xTransformer, yTransformer]);

  const lineGenerator = line()
    .x((d) => xTransformer.transform(d[0]))
    .y((d) => yTransformer.transform(d[1]));

  return (
    <>
      {weatherList.map((value, index) => {
        const data = voronoi.renderCell(index);
        const isNeighbor = neighbors.includes(index);

        return (
          <Cell
            key={`cell-${index}`}
            index={index}
            data={data}
            voronoi={voronoi}
            isNeighbor={isNeighbor}
            onHover={onHover}
          />
        );
      })}
      {centerIndex !== undefined &&
        neighbors.map((index) => {
          const weather = weatherList[index];
          const center = weatherList[centerIndex];

          const data = lineGenerator([
            [weather.dewPoint, weather.humidity],
            [center.dewPoint, center.humidity],
          ]);

          return data !== null ? (
            <Path
              data={data}
              fill="transparent"
              strokeWidth={1}
              stroke="#af9358"
            />
          ) : null;
        })}
    </>
  );
};

export const Voronoi = memo(VoronoiComponent);
