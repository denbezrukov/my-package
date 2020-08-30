import { createContext, useContext } from 'react';
import { ScaleLinear } from 'd3-scale';

export const ColorScaleContext = createContext<
  ScaleLinear<string, string> | undefined
>(undefined);

export const useColorScale = () => {
  const scale = useContext(ColorScaleContext);

  if (scale) {
    return scale;
  }

  throw new Error('Color scale is undefined');
};
