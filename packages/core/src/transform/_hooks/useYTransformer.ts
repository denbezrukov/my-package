import { useContext } from 'react';
import { YTransformerContext } from '../transformerContext';

export const useYTransformer = () => {
  const transformer = useContext(YTransformerContext);

  if (transformer) {
    return transformer;
  }

  throw new Error('Transformer is undefined');
};
