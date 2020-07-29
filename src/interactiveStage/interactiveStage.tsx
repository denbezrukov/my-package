import React, { FunctionComponent, memo, useCallback, useMemo } from 'react';
import { Stage } from 'react-konva';
import { InteractiveStageProps } from './interactiveStage.interface';
import { useTransformerState } from '../transform/_hooks/useTransformerState';
import { TransformerConfig } from '../transform/transform.interface';
import {
  XTransformerContext,
  YTransformerContext,
} from '../transform/transformerContext';
import {
  DragInteraction,
  useDragInteraction,
} from '../transform/_hooks/useDragInteraction';

const InteractiveStageComponent: FunctionComponent<InteractiveStageProps> = (
  props,
) => {
  const { xDomain, yDomain, children, dimension, ...restProps } = props;
  const { width, height, xAxisSize, yAxisSize } = dimension;

  const xTransformerConfig = useMemo<TransformerConfig>(() => {
    return {
      domain: xDomain,
      range: [0, (width ?? 0) - yAxisSize],
    };
  }, [xDomain, width, yAxisSize]);

  const xTransformer = useTransformerState(xTransformerConfig);

  const yTransformerConfig = useMemo<TransformerConfig>(() => {
    return {
      domain: yDomain,
      range: [0, (height ?? 0) - xAxisSize],
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
      <XTransformerContext.Provider value={xTransformer}>
        <YTransformerContext.Provider value={yTransformer}>
          {children}
        </YTransformerContext.Provider>
      </XTransformerContext.Provider>
    </Stage>
  );
};

export const InteractiveStage = memo(InteractiveStageComponent);
