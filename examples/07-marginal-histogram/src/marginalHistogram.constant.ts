import { createContext, Dispatch, useContext, useMemo } from 'react';
import { ScaleSequential } from 'd3-scale';
import { Weather } from 'data';
import {
  MarginalHistogramAction,
  MarginalHistogramState,
} from './marginalHistogram.reducer';

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

export const MarginalHistogramStateContext = createContext<
  MarginalHistogramState | undefined
>(undefined);

export const useMarginalHistogramState = () => {
  const state = useContext(MarginalHistogramStateContext);

  if (state) {
    return state;
  }

  throw new Error('state context is undefined');
};

export const MarginalHistogramDispatchContext = createContext<
  Dispatch<MarginalHistogramAction> | undefined
>(undefined);

export const useMarginalHistogramDispatch = () => {
  const dispatch = useContext(MarginalHistogramDispatchContext);

  if (dispatch) {
    return dispatch;
  }

  throw new Error('dispatch context is undefined');
};

export const xAccessor = (weather: Weather) => weather.temperatureMin;
export const yAccessor = (weather: Weather) => weather.temperatureMax;
export const colorAccessor = (weather: Weather) => new Date(weather.date);

export const useFilteredWeatherList = () => {
  const { weatherList, filter } = useMarginalHistogramState();

  return useMemo(
    () =>
      weatherList.map((weather) => {
        const date = colorAccessor(weather);
        const isWithinRange =
          filter !== undefined
            ? date >= filter.from && date <= filter.to
            : true;
        return {
          ...weather,
          isWithinRange,
        };
      }),
    [weatherList, filter],
  );
};
