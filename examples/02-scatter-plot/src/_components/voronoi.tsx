import { Delaunay } from 'd3-delaunay';
import React, { memo, useMemo } from 'react';
import { useDimension, useXTransformer, useYTransformer } from 'core';
import { Path } from 'react-konva';

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

  const voronoi = useMemo(() => {
    const delaynay = Delaunay.from(
      weatherList,
      (d) => xTransformer.transform(d.dewPoint),
      (d) => yTransformer.transform(d.humidity),
    );
    return delaynay.voronoi([0, 0, width, height]);
  }, [weatherList, width, height, xTransformer, yTransformer]);

  return (
    <>
      {weatherList.map((value, index) => {
        const data = voronoi.renderCell(index);
        return (
          <Path
            key={data}
            data={data}
            fill="transparent"
            strokeWidth={1}
            stroke="salmon"
          />
        );
      })}
    </>
  );
};

export const Voronoi = memo(VoronoiComponent);
