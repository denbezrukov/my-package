import React, { FunctionComponent, memo, useCallback } from 'react';
import { Stage } from 'react-konva';
import { InteractiveStageProps } from './interactiveStage.interface';
import {
  XTransformerContext,
  YTransformerContext,
} from '../transform/transformerContext';
import {
  DragInteraction,
  useDragInteraction,
} from '../transform/_hooks/useDragInteraction';
import { DimensionContext } from '../dimension/dimensionContext';
import { useXTransformer } from '../transform/_hooks/useXTransformer';
import { useYTransformer } from '../transform/_hooks/useYTransformer';
import { useDimension } from '../dimension/useDimension';

const InteractiveStageComponent: FunctionComponent<InteractiveStageProps> = (
  props,
) => {
  const { children, ...restProps } = props;

  const xTransformer = useXTransformer();
  const yTransformer = useYTransformer();
  const dimension = useDimension();

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
      width={dimension.width}
      height={dimension.height}
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
