import { EditorView } from "prosemirror-view";
import { DraggingState } from "../types";
import { rowResizingPluginKey } from "../rowresizing";
import { TableMap } from "@tiptap/pm/tables";
import { currentRowHeight } from "../helpers/currentRowHeight";
import { draggedHeight } from "../helpers/draggedHeight";
import { updateRowHeight } from "../updaters/updateRowHeight";
import { displayRowHeight } from "../helpers/displayRowHeight";

export function handleMouseDown(
  view: EditorView,
  event: MouseEvent,
  cellMinHeight: number,
  defaultCellMinHeight: number,
): boolean {
  if (!view.editable) return false;

  const win = view.dom.ownerDocument.defaultView ?? window;
  const pluginState = rowResizingPluginKey.getState(view.state);

  if (!pluginState || pluginState.activeHandle === -1) return false;
  if (pluginState.dragging) return false;

  const $cell = view.state.doc.resolve(pluginState.activeHandle);
  const table = $cell.node(-1);
  if (!table) return false;

  const tableStart = $cell.start(-1);
  const map = TableMap.get(table);
  const cellPos = $cell.pos - tableStart;

  let row = 0;
  for (let i = 0; i < map.map.length; i++) {
    if (
      map.map[i] <= cellPos &&
      cellPos < map.map[i] + table.nodeAt(map.map[i])!.nodeSize
    ) {
      row = Math.floor(i / map.width);
      break;
    }
  }

  const rowCells: number[] = [];
  for (let col = 0; col < map.width; col++) {
    const index = row * map.width + col;
    if (index >= map.map.length) continue;
    rowCells.push(map.map[index]);
  }

  const cellNode = $cell.nodeAfter;
  if (!cellNode) return false;

  const height = currentRowHeight(
    view,
    pluginState.activeHandle,
    cellNode.attrs,
  );

  view.dispatch(
    view.state.tr.setMeta(rowResizingPluginKey, {
      setDragging: {
        startY: event.clientY,
        startHeight: height,
        rowCells,
        tableStart,
        row,
      } as DraggingState,
    }),
  );

  const finish = (event: MouseEvent) => {
    win.removeEventListener("mouseup", finish);
    win.removeEventListener("mousemove", move);

    const currentState = rowResizingPluginKey.getState(view.state);
    if (!currentState?.dragging) return;

    const dragged = draggedHeight(currentState.dragging, event, cellMinHeight);

    const draggingState = currentState.dragging as DraggingState;

    draggingState.rowCells.forEach((cellPos) => {
      updateRowHeight(view, draggingState.tableStart + cellPos, dragged);
    });

    view.dispatch(
      view.state.tr.setMeta(rowResizingPluginKey, { setDragging: null }),
    );
  };

  const move = (event: MouseEvent) => {
    if (!(event.buttons & 1)) return finish(event);

    const currentState = rowResizingPluginKey.getState(view.state);
    if (!currentState?.dragging) return;

    const dragged = draggedHeight(currentState.dragging, event, cellMinHeight);
    const draggingState = currentState.dragging as DraggingState;

    draggingState.rowCells.forEach((cellPos) => {
      displayRowHeight(
        view,
        draggingState.tableStart + cellPos,
        dragged,
        defaultCellMinHeight,
      );
    });
  };

  rowCells.forEach((cellPos) => {
    displayRowHeight(view, tableStart + cellPos, height, defaultCellMinHeight);
  });

  win.addEventListener("mouseup", finish);
  win.addEventListener("mousemove", move);
  event.preventDefault();
  return true;
}
