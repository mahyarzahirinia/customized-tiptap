import { Dragging } from "../types";

export function draggedHeight(
  dragging: Dragging,
  event: MouseEvent,
  resizeMinHeight: number,
): number {
  const offset = event.clientY - dragging.startY;
  return Math.max(resizeMinHeight, dragging.startHeight + offset);
}
