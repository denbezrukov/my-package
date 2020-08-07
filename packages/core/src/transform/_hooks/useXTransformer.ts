import { useContext } from 'react';
import { XTransformerContextFactory } from '../transformerContext';

export const useXTransformer = <Domain>() => {
  const transformer = useContext(XTransformerContextFactory<Domain>());

  if (transformer) {
    return transformer;
  }

  throw new Error('Transformer is undefined');
};
