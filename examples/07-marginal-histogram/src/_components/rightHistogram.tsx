import React, { FunctionComponent, memo } from 'react';
import { useYTransformer } from 'core';
import { yAccessor } from '../marginalHistogram.constant';
import { Histogram } from './histogram';

const RightHistogramComponent: FunctionComponent = () => {
  const { transform } = useYTransformer<number>();

  return <Histogram accessor={yAccessor} transform={transform} />;
};

export const RightHistogram = memo(RightHistogramComponent);
