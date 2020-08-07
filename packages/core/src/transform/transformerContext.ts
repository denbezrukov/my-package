import { createContext, useContext } from 'react';
import { Transformer } from './transform.interface';


export const createTransformerContext = <Domain>() => {
  const context = createContext<Transformer<Domain> | undefined>(undefined);

  const useTransformer = () => {
    const transformer = useContext(context);

    if (transformer) {
      return transformer;
    }

    throw new Error('Transformer is undefined');
  };

  return [useTransformer, context] as const;
}

export const XTransformerContextFactory = <Domain>() => createContext<Transformer<Domain> | undefined>(
  undefined,
);
export const YTransformerContextFactory = <Domain>() => createContext<Transformer<Domain> | undefined>(
  undefined,
);
