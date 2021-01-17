import { Delaunay } from 'd3-delaunay';
import React, { memo, useCallback, useMemo } from 'react';
import { useDimension, useXTransformer, useYTransformer } from 'core';
import { Path } from 'react-konva';
import { Weather } from 'data';
import { useAccessors, useSetHoverPoint } from '../marginalHistogram.constant';

interface CellProps {
  index: number;
  data: string;
  onMouseEnter: (index: number) => void;
  onMouseLeave?: () => void;
}

const Cell: React.FunctionComponent<CellProps> = (props) => {
  const { data, index, onMouseEnter, onMouseLeave } = props;

  const handleMouseEnter = useCallback(() => {
    onMouseEnter(index);
  }, [onMouseEnter, index]);

  const handleMouseLeave = useCallback(() => {
    onMouseLeave?.();
  }, [onMouseLeave]);

  return (
    <Path
      key={data}
      data={data}
      fill="transparent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

interface VoronoiProps {
  weatherList: Weather[];
}

const VoronoiComponent: React.FunctionComponent<VoronoiProps> = (props) => {
  const { weatherList } = props;
  const { width, height } = useDimension();
  const { xAccessor, yAccessor } = useAccessors();
  const setHoverPoint = useSetHoverPoint();

  const xTransformer = useXTransformer();
  const yTransformer = useYTransformer();

  const voronoi = useMemo(() => {
    const delaunay = Delaunay.from(
      weatherList,
      (d) => xTransformer.transform(xAccessor(d)),
      (d) => yTransformer.transform(yAccessor(d)),
    );
    return delaunay.voronoi([0, 0, width, height]);
  }, [
    weatherList,
    width,
    height,
    xTransformer,
    yTransformer,
    xAccessor,
    yAccessor,
  ]);

  const onMouseEnter = useCallback(
    (index: number) => {
      const weather = weatherList[index];
      const x = xTransformer.transform(xAccessor(weather));
      const y = yTransformer.transform(yAccessor(weather));

      setHoverPoint({ x, y });
    },
    [
      weatherList,
      setHoverPoint,
      xTransformer,
      yTransformer,
      xAccessor,
      yAccessor,
    ],
  );

  return (
    <>
      {weatherList.map((value, index) => {
        const data = voronoi.renderCell(index);

        return (
          <Cell
            key={`cell-${index}`}
            index={index}
            data={data}
            onMouseEnter={onMouseEnter}
          />
        );
      })}
    </>
  );
};

export const Voronoi = memo(VoronoiComponent);
