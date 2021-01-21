import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { ScaleSequential } from 'd3-scale';
import { Weather } from 'data';

export const ColorScaleContext = createContext<
  ScaleSequential<string> | undefined
>(undefined);

export const useColorScale = () => {
  const scale = useContext(ColorScaleContext);

  if (scale) {
    return scale;
  }

  throw new Error('Color scale is undefined');
};

interface Accessors {
  xAccessor: (weather: Weather) => number;
  yAccessor: (weather: Weather) => number;
  colorAccessor: (weather: Weather) => Date;
}

export const AccessorsContext = createContext<Accessors | undefined>(undefined);

export const useAccessors = () => {
  const accessors = useContext(AccessorsContext);

  if (accessors) {
    return accessors;
  }

  throw new Error('Accessors context is undefined');
};

export interface Point {
  x: number;
  y: number;
}

export const SelectedWeatherContext = createContext<Weather | undefined>(
  undefined,
);

export const useSelectedWeather = () => useContext(SelectedWeatherContext);

export interface Filter {
  from: Date;
  to: Date;
  color: string;
}

export const SetFilterContext = createContext<
  Dispatch<SetStateAction<Filter | undefined>> | undefined
>(undefined);

export const useSetFilter = () => {
  const setFilter = useContext(SetFilterContext);

  if (setFilter) {
    return setFilter;
  }

  throw new Error('Set filter is undefined');
};