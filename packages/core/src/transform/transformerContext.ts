import { createContext } from 'react';
import { Transformer } from './transform.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const XTransformerContext = createContext<Transformer<any> | undefined>(
  undefined,
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const YTransformerContext = createContext<Transformer<any> | undefined>(
  undefined,
);
