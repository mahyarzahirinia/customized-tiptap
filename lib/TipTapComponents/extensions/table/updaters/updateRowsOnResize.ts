import { Node as ProseMirrorNode } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import { updateRowsOnTransaction } from "./updateRowsOnTransaction";

export function updateRowsOnResize(
  node: ProseMirrorNode,
  table: HTMLTableElement,
  cellMinHeight: number,
  overrideRow?: number,
  overrideValue?: number,
  view?: EditorView,
): void {
  let totalHeight = 0;
  const rows = table.rows;
  const calculatedHeights: number[] = [];
  const tr = view?.state?.tr;

  for (let rowIndex = 0; rowIndex < node.childCount; rowIndex++) {
    const rowNode = node.child(rowIndex);
    const rowHeight =
      overrideRow === rowIndex
        ? overrideValue
        : rowNode.attrs.rowheight || cellMinHeight;
    calculatedHeights[rowIndex] = rowHeight;

    if (view && tr && overrideRow === rowIndex) {
      updateRowsOnTransaction(view, node, rowIndex, rowHeight);
    }
  }

  calculatedHeights.forEach((height, index) => {
    if (rows[index] && rows[index].style.height !== `${height}px`) {
      rows[index].style.height = `${height}px`;
    }
  });

  totalHeight = calculatedHeights.reduce((acc, cur) => acc + cur, 0);
  table.style.height = "";
  table.style.minHeight = `${totalHeight}px`;
}
