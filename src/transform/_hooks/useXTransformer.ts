import { useContext } from 'react';
import { XTransformerContext } from '../transform.constant';

export const useXTransformer = () => {
  const transformer = useContext(XTransformerContext);

  if (transformer) {
    return transformer;
  }

  throw new Error('Transformer is undefined');
};
