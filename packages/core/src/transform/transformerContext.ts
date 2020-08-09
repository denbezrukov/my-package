import { createContext } from 'react';
import { Transformer } from './transform.interface';

export const XTransformerContext = createContext<Transformer<any> | undefined>(
  undefined,
);
export const YTransformerContext = createContext<Transformer<any> | undefined>(
  undefined,
);
