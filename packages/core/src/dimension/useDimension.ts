import { useContext } from 'react';
import { DimensionContext } from './dimensionContext';

export const useDimension = () => {
  const dimension = useContext(DimensionContext);

  if (dimension) {
    return dimension;
  }

  throw new Error('Dimension is undefined');
};
