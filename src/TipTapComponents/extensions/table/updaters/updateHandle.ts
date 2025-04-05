import { EditorView } from "prosemirror-view";
import { rowResizingPluginKey } from "../rowresizing";

export function updateHandle(
  view: EditorView,
  value: number,
  rowIndex?: number,
): void {
  view.dispatch(
    view.state.tr.setMeta(rowResizingPluginKey, {
      setHandle: value,
      setRowIndex: rowIndex,
    }),
  );
}
