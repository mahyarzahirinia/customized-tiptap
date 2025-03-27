import { Node as ProseMirrorNode } from "prosemirror-model";

export function updateRowsOnResize(
  node: ProseMirrorNode,
  table: HTMLTableElement,
  cellMinHeight: number,
  overrideRow?: number,
  overrideValue?: number,
): void {
  let totalHeight = 0;
  const rows = table.rows;
  const calculatedHeights: number[] = [];

  for (let row = 0; row < node.childCount; row++) {
    const rowNode = node.child(row);
    const rowHeight =
      overrideRow === row
        ? (overrideValue ?? cellMinHeight) // Fallback if overrideValue is undefined
        : rowNode.attrs.rowheight || cellMinHeight;
    calculatedHeights[row] = rowHeight;
  }

  calculatedHeights.forEach((height, index) => {
    if (Array.isArray(rows) && index >= rows.length) return; // Bounds check
    const row = rows[index];
    const currentHeight = row.style.height;
    // Only update if the height is different (ignoring units)
    if (currentHeight !== `${height}px` && currentHeight !== `${height}`) {
      row.style.height = `${height}px`;
    }
  });

  totalHeight = calculatedHeights.reduce((acc, cur) => acc + cur, 0);
  table.style.height = "";
  table.style.minHeight = `${totalHeight}px`;
}
