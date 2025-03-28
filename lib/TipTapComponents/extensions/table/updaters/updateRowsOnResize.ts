import { Node as ProseMirrorNode } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import { updateRowsOnTransaction } from "./updateRowsOnTransaction";
import { rowResizingPluginKey } from "../rowresizing";

export function updateRowsOnResize(
  node: ProseMirrorNode,
  table: HTMLTableElement,
  cellMinHeight: number,
  overrideRow?: number,
  overrideValue?: number,
  view?: EditorView,
): void {
  if (!view) return;
  const pluginState = rowResizingPluginKey.getState(view?.state);
  // @ts-ignore
  const activeRowIndex = pluginState?.dragging.row ?? -1; // Ensure a valid index

  if (
    activeRowIndex === undefined ||
    activeRowIndex < 0 ||
    activeRowIndex >= node.childCount
  ) {
    return; // No valid row to resize
  }

  const rowNode = node.child(activeRowIndex);
  const newHeight = overrideValue ?? rowNode.attrs.rowheight ?? cellMinHeight;

  if (view && view.state.tr) {
    updateRowsOnTransaction(view, node, activeRowIndex, newHeight);
  }

  // Apply height only to the active row
  const rows = table.rows;
  if (
    rows[activeRowIndex] &&
    rows[activeRowIndex].style.height !== `${newHeight}px`
  ) {
    rows[activeRowIndex].style.height = `${newHeight}px`;
  }
}
