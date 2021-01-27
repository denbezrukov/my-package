import React, { FunctionComponent, memo } from 'react';
import { useXTransformer } from 'core';
import { xAccessor } from '../marginalHistogram.constant';
import { Histogram } from './histogram';

const TopHistogramComponent: FunctionComponent = () => {
  const { transform } = useXTransformer<number>();

  return <Histogram accessor={xAccessor} transform={transform} />;
};

export const TopHistogram = memo(TopHistogramComponent);
