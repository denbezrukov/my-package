import { useCallback, useRef } from 'react';
import Konva from 'konva';
import { Point } from '../scale.interface';

export type MouseMove = (event: MouseEvent, prevPoint: Point) => void;

export const useMouseMove = (callback: MouseMove) => {
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
      // eslint-disable-next-line no-param-reassign
      event.cancelBubble = true;
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
