import { Delaunay, Voronoi as VoronoiType } from 'd3-delaunay';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDimension, useXTransformer, useYTransformer } from 'core';
import { Path } from 'react-konva';

interface CellProps<P> {
  data: string;
  voronoi: VoronoiType<P>;
  index: number;
}

const Cell = <
  P extends {
    dewPoint: number;
    humidity: number;
  }
>(
  props: CellProps<P>,
) => {
  const { data, index, voronoi } = props;
  const [isHovered, setHovered] = useState(false);
  const onMouseEnter = useCallback(() => {
    setHovered(true);
    voronoi.neighbors(index);
  }, [setHovered, voronoi, index]);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, [setHovered]);

  const stroke = isHovered ? 'red' : 'salmon';
  const strokeWidth = isHovered ? 2 : 1;
  return (
    <Path
      key={data}
      data={data}
      fill="transparent"
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
        return <Cell key={data} data={data} voronoi={voronoi} index={index} />;
      })}
    </>
  );
};

export const Voronoi = memo(VoronoiComponent);
