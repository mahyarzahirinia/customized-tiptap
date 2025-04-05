import { EditorView } from "prosemirror-view";
import { updateRowsOnResize } from "../updaters/updateRowsOnResize";
import { TableMap } from "@tiptap/pm/tables";

export function displayRowHeight(
  view: EditorView,
  cell: number,
  height: number,
  cellMinHeight: number,
): void {
  const $cell = view.state.doc.resolve(cell);

  const table = $cell.node(-1),
    start = $cell.start(-1);

  const col =
    TableMap.get(table).colCount($cell.pos - start) +
    $cell.nodeAfter!.attrs.colspan -
    1;

  let dom: Node | null = view.domAtPos($cell.start(-1)).node;

  while (dom && dom.nodeName != "TABLE") {
    dom = dom.parentNode;
  }

  if (!dom) return;

  updateRowsOnResize(
    table,
    dom as HTMLTableElement,
    cellMinHeight,
    col,
    height,
    view,
  );
}
