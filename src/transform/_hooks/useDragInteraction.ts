import { useCallback, useRef } from 'react';
import Konva from 'konva';
import { Point } from '../transform.interface';

export type DragInteraction = (event: MouseEvent, prevPoint: Point) => void;

export const useDragInteraction = (callback: DragInteraction) => {
  const point = useRef<Point | null>(null);

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      const { clientX, clientY } = event;

      callback(event, point.current ?? { x: 0, y: 0 });

      point.current = {
        x: clientX,
        y: clientY,
      };
    },
    [point, callback],
  );

  return useCallback(
    (event: Konva.KonvaEventObject<MouseEvent>) => {
      const { clientX, clientY } = event.evt;
      point.current = {
        x: clientX,
        y: clientY,
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [point, onMouseMove],
  );
};
