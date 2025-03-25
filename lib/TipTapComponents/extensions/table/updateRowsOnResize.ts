import { Node as ProseMirrorNode } from "prosemirror-model";

export function updateRowsOnResize(
  node: ProseMirrorNode,
  rowgroup: HTMLTableRowElement,
  table: HTMLTableElement,
  defaultCellMinHeight: number,
  overrideRow?: number,
  overrideValue?: number,
): void {
  let totalHeight = 0; // Tracks total table height
  let fixedHeight = true; // Indicates whether all row heights are fixed
  let nextDOM = rowgroup.firstChild as HTMLElement; // First row in the row group
  const firstRow = node.firstChild; // First row node in ProseMirror table
  if (!firstRow) return; // Exit if no rows exist

  for (let i = 0, row = 0; i < node.childCount; i++, row++) {
    const rowNode = node.child(i); // Get the current row node
    const { rowspan, rowheight } = rowNode.attrs as {
      rowspan: number;
      rowheight?: number[];
    };
    for (let j = 0; j < rowspan; j++, row++) {
      const hasHeight =
        overrideRow == row ? overrideValue : rowheight && rowheight[j];
      const cssHeight = hasHeight ? hasHeight + "px" : "";
      totalHeight += hasHeight || defaultCellMinHeight; // Sum up the heights
      if (!hasHeight) fixedHeight = false; // If any row lacks a fixed height, mark it false

      if (!nextDOM) {
        // Create a new row element if needed
        const newRow = document.createElement("tr");
        newRow.style.height = cssHeight;
        rowgroup.appendChild(newRow);
      } else {
        // Update existing row height
        if (nextDOM.style.height !== cssHeight) {
          nextDOM.style.height = cssHeight;
        }
        nextDOM = nextDOM.nextSibling as HTMLElement;
      }
    }
  }

  // Remove any extra row elements beyond the expected number
  while (nextDOM) {
    const after = nextDOM.nextSibling;
    nextDOM.parentNode?.removeChild(nextDOM);
    nextDOM = after as HTMLElement;
  }

  // Adjust the table height based on whether all rows have fixed heights
  if (fixedHeight) {
    table.style.height = totalHeight + "px";
    table.style.minHeight = "";
  } else {
    table.style.height = "";
    table.style.minHeight = totalHeight + "px";
  }
}
