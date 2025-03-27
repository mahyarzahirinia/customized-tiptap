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

  if (event.clientY - top <= handleHeight) {
    activeCell = edgeCell(view, event, "top", handleHeight);
  } else if (bottom - event.clientY <= handleHeight) {
    activeCell = edgeCell(view, event, "bottom", handleHeight);
  }

  if (!lastRowResizable && activeCell !== -1) {
    const $cell = view.state.doc.resolve(activeCell);
    const table = $cell.node(-1);
    const map = TableMap.get(table);
    const tableStart = $cell.start(-1);
    const colIndex =
      map.colCount($cell.pos - tableStart) + $cell.nodeAfter!.attrs.colspan - 1;

    if (colIndex === map.height - 1) return;
  }

  if (activeCell !== pluginState.activeHandle) {
    updateHandle(view, activeCell);
  }
}
