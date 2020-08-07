import { useContext } from 'react';
import { YTransformerContextFactory } from '../transformerContext';

export const useYTransformer = <Domain>() => {
  const transformer = useContext(YTransformerContextFactory<Domain>());

  if (transformer) {
    return transformer;
  }

  throw new Error('Transformer is undefined');
};
