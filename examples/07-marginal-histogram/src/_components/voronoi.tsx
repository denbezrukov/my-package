import { Delaunay } from 'd3-delaunay';
import React, { memo, useCallback, useMemo } from 'react';
import { useDimension, useXTransformer, useYTransformer } from 'core';
import { Path } from 'react-konva';
import { Weather } from 'data';
import {
  useAccessors,
  useSetSelectedWeather,
} from '../marginalHistogram.constant';

interface CellProps {
  index: number;
  data: string;
  onMouseMove: (index: number) => void;
  onMouseLeave?: () => void;
}

const Cell: React.FunctionComponent<CellProps> = (props) => {
  const { data, index, onMouseMove, onMouseLeave } = props;

  const handleMouseMove = useCallback(() => {
    onMouseMove(index);
  }, [onMouseMove, index]);

  const handleMouseLeave = useCallback(() => {
    onMouseLeave?.();
  }, [onMouseLeave]);

  return (
    <Path
      key={data}
      data={data}
      fill="transparent"
      onMouseMove={handleMouseMove}
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
  const setSelectedWeather = useSetSelectedWeather();

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

  const onMouseMove = useCallback(
    (index: number) => {
      const weather = weatherList[index];

      setSelectedWeather(weather);
    },
    [weatherList, setSelectedWeather],
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
            onMouseMove={onMouseMove}
          />
        );
      })}
    </>
  );
};

export const Voronoi = memo(VoronoiComponent);
