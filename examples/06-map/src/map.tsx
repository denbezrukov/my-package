import React, { FunctionComponent, memo, useCallback, useMemo, useState } from 'react';
import { Layer, Path, Stage } from 'react-konva';
import * as geo from 'd3-geo';
import { extent, max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { MapProps } from './map.interface';
import { countryList, countryInfo } from 'data';

interface CountryProps {
  fill: string;
  data: string;
}

const CountryComponent: FunctionComponent<CountryProps> = (props) => {
  const { fill, data } = props;

  const [isHover, setHover] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setHover(true);
  }, [setHover]);

  const handleMouseLeave = useCallback(() => {
    setHover(false);
  }, [setHover]);

  return (
    <Path
      fill={isHover ? 'cornflowerblue' : fill}
      troke="transparent"
      data={data}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    />
  );
};

const Country = memo(CountryComponent);

const MapComponent: FunctionComponent<MapProps> = (props) => {
  const { width, projection } = props;
  const margin = {
    top: 10,
    right: 40,
    bottom: 40,
    left: 40,
  };

  const boundedWidth = width - margin.left - margin.right;

  console.log((geo as any)[projection]);
  const sphere = { type: 'Sphere' as const };
  const geoProjection = ((geo as any)[projection] as any)().fitWidth(boundedWidth, sphere);
  const pathGenerator = geo.geoPath(geoProjection);
  const [[], [, y1]] = pathGenerator.bounds(sphere);

  const dimension = useMemo(
    () => {
      const boundedWidth = width - margin.left - margin.right;
      const boundedHeight = y1;
      const height = boundedHeight + margin.top + margin.bottom;

      return {
        width,
        boundedWidth,
        boundedHeight,
        height,
        margin,
      };
    },
    [margin, boundedWidth, width, y1],
  );

  const earth = pathGenerator(sphere);
  const graticule = geo.geoGraticule10();
  const graticuleData = pathGenerator(graticule);

  const metric = 'Population growth (annual %)';
  const metricDataByCountry = countryInfo
    .filter(info => {
      return info['Series Name'] === metric;
    })
    .reduce((res, info) => {
      res[info['Country Code']] = +info['2017 [YR2017]'] || 0;
      return res;
    }, {} as any);
  const metricValues = Object.values(metricDataByCountry);
  const metricValueExtent = extent(metricValues as any) as any;
  const maxChange = max([-metricValueExtent[0], metricValueExtent[1]]);
  const colorScale = scaleLinear()
    .domain([-maxChange, 0, maxChange])
    .range(['indigo', 'white', 'darkgreen'] as any);

  return (
    <Stage
      width={dimension.width}
      height={dimension.height}
    >
      <Layer
        x={dimension.margin.left}
        y={dimension.margin.top}
      >
        {
          earth && (<Path data={earth} fill="#e2f1f1" stroke="transparent"/>)
        }
        {
          graticuleData && (<Path data={graticuleData} fill="transparent" strokeWidth={1} stroke="#cadddd"/>)
        }
        {
          countryList.map((country, index) => {
            const data = pathGenerator(country as any);
            const metricValue = metricDataByCountry[country.properties.ADM0_A3_IS] || 0;

            const fill = colorScale(metricValue) as any;
            return data && (<Country key={index} fill={fill} data={data}/>);
          })
        }
      </Layer>
    </Stage>
  );
};

export const Map = memo(MapComponent);
