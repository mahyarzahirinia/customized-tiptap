import { EditorView } from "prosemirror-view";
import { rowResizingPluginKey } from "../rowresizing";
import { domCellAround } from "../helpers/domCellAround";
import { edgeCell } from "../helpers/edgeCell";
import { TableMap } from "@tiptap/pm/tables";
import { updateHandle } from "../updaters/updateHandle";

export function handleMouseMove(
  view: EditorView,
  event: MouseEvent,
  handleHeight: number,
  lastRowResizable: boolean,
): void {
  if (!view.editable) return;

  const pluginState = rowResizingPluginKey.getState(view.state);
  if (!pluginState || pluginState.dragging) return;

  const target = domCellAround(event.target as HTMLElement);
  if (!target) return;

  const { top, bottom } = target.getBoundingClientRect();
  let activeCell = -1;
  let rowIndex = -1;

  if (event.clientY - top <= handleHeight) {
    activeCell = edgeCell(view, event, "top", handleHeight);
  } else if (bottom - event.clientY <= handleHeight) {
    activeCell = edgeCell(view, event, "bottom", handleHeight);
  }

  if (lastRowResizable && activeCell > -1) {
    const $cell = view.state.doc.resolve(activeCell);
    const table = $cell.node(-1);
    const map = TableMap.get(table);
    const tableStart = $cell.start(-1);
    // Calculate the relative position of the cell within the table
    const cellPos = activeCell - tableStart;

    // Find the row index by searching the map array
    rowIndex = map.findCell(cellPos).top;

    // Check if the active cell belongs to the last row
    if (!lastRowResizable && rowIndex === map.height - 1) {
      return;
    }
  }

  if (activeCell !== pluginState.activeHandle) {
    updateHandle(view, activeCell, rowIndex);
  }
}
