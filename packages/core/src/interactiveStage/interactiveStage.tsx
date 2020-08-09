import React, { FunctionComponent, memo, useCallback, useMemo } from 'react';
import { Stage } from 'react-konva';
import { scaleLinear } from 'd3-scale';
import { InteractiveStageProps } from './interactiveStage.interface';
import { useTransformerState } from '../transform/_hooks/useTransformerState';
import {
  XTransformerContext,
  YTransformerContext,
} from '../transform/transformerContext';
import {
  DragInteraction,
  useDragInteraction,
} from '../transform/_hooks/useDragInteraction';
import { DimensionContext } from '../dimension/dimensionContext';

const InteractiveStageComponent: FunctionComponent<InteractiveStageProps> = (
  props,
) => {
  const { xDomain, yDomain, children, dimension, ...restProps } = props;
  const { width, height, xAxisSize, yAxisSize } = dimension;

  const xTransformerConfig = useMemo(() => {
    return {
      scale: scaleLinear()
        .domain(xDomain)
        .range([0, (width ?? 0) - yAxisSize]),
    };
  }, [xDomain, width, yAxisSize]);

  const xTransformer = useTransformerState(xTransformerConfig);

  const yTransformerConfig = useMemo(() => {
    return {
      scale: scaleLinear()
        .domain(yDomain)
        .range([(height ?? 0) + xAxisSize, 0]),
    };
  }, [yDomain, height, xAxisSize]);

  const yTransformer = useTransformerState(yTransformerConfig);

  const onMove: DragInteraction = useCallback(
    (event, point) => {
      const { clientX, clientY } = event;
      xTransformer.setShift((shift) => {
        return shift + clientX - point.x;
      });
      yTransformer.setShift((shift) => {
        return shift + clientY - point.y;
      });
    },
    [yTransformer, xTransformer],
  );
  const onMouseDown = useDragInteraction(onMove);

  const onDblClick = useCallback(() => {
    xTransformer.setShift(() => 0);
    yTransformer.setShift(() => 0);
  }, [yTransformer, xTransformer]);

  return (
    <Stage
      {...restProps}
      onMouseDown={onMouseDown}
      onDblClick={onDblClick}
      width={width}
      height={height}
    >
      <DimensionContext.Provider value={dimension}>
        <XTransformerContext.Provider value={xTransformer}>
          <YTransformerContext.Provider value={yTransformer}>
            {children}
          </YTransformerContext.Provider>
        </XTransformerContext.Provider>
      </DimensionContext.Provider>
    </Stage>
  );
};

export const InteractiveStage = memo(InteractiveStageComponent);
