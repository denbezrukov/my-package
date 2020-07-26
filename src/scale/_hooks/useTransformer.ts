import { useContext } from 'react';
import { ScaleContext } from '../scale.constant';

export const useTransformer = () => {
  const scale = useContext(ScaleContext);

  if (scale) {
    return scale;
  }

  throw new Error('Scale is undefined');
};
