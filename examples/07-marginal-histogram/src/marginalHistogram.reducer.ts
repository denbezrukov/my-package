import { Weather, weatherList } from 'data';

export interface Filter {
  from: Date;
  to: Date;
  color: string;
}

export interface MarginalHistogramState {
  weatherList: Weather[];
  selectedWeather: Weather | undefined;
  filter: Filter | undefined;
}

interface SetFilter {
  type: 'SET_FILTER';
  filter: Filter | undefined;
}

interface SetSelectedWeather {
  type: 'SET_WEATHER';
  selectedWeather: Weather | undefined;
}

export type MarginalHistogramAction = SetFilter | SetSelectedWeather;

export const initialState = {
  weatherList,
  selectedWeather: undefined,
  filter: undefined,
};

export const marginalHistogramReducer = (
  state: MarginalHistogramState,
  action: MarginalHistogramAction,
) => {
  switch (action.type) {
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.filter,
      };
    case 'SET_WEATHER':
      return {
        ...state,
        selectedWeather: action.selectedWeather,
      };
    default:
      return state;
  }
};
