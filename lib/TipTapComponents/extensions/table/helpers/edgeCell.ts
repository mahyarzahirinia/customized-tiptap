import { EditorView } from "prosemirror-view";
import { cellAround } from "@tiptap/pm/tables";
import { TableMap } from "@tiptap/pm/tables";

/**
 * Get the position of the edge cell in a table based on mouse event
 * @param view - The ProseMirror editor view
 * @param event - The mouse event
 * @param side - The side of the cell (top or bottom)
 * @param handleHeight - The height of the handle
 * @returns The position of the edge cell or -1 if not found
 */
export function edgeCell(
  view: EditorView,
  event: MouseEvent,
  side: "top" | "bottom",
  handleHeight: number,
): number {
  // If checking the top, the offset is positive (handleHeight).
  // If checking the bottom, the offset is negative (-handleHeight).
  //
  const offset = side === "top" ? handleHeight : -handleHeight;

  // posAtCoords determines the document position closest to the given screen coordinates.
  // event.clientY + offset shifts the position based on whether we’re checking the top or bottom edge.
  //
  const found = view.posAtCoords({
    left: event.clientX,
    top: event.clientY + offset,
  });
  if (!found) return -1;

  // cellAround: A helper function that finds the table cell node surrounding a given position.
  // resolve(found.pos): Converts the found position into a resolved position.
  // cellAround(...): Finds the table cell surrounding this position.
  //
  const $cell = cellAround(view.state.doc.resolve(found.pos));
  if (!$cell) return -1;

  // If checking the bottom and there is a node after the current cell (i.e., another cell below it), return the current cell’s position.
  // This ensures that the full cell size is considered when calculating boundaries.
  //
  if (side === "bottom" && $cell.nodeAfter?.nodeSize) return $cell.pos; // fix: always add full cell size

  // TableMap: A utility that provides information about table structure, such as cell positions.
  // map: Retrieves the table's structure using TableMap.get(). The node(-1) moves up to the table node.
  // start: Gets the starting position of the table.
  //
  const map = TableMap.get($cell.node(-1)),
    start = $cell.start(-1);

  // Finds the index of the current cell inside the table map.
  //
  const index = map.map.indexOf($cell.pos - start);

  // Math.floor(index / map.width) === 0: Checks if the cell is in the first row.
  // If true, return -1 (invalid case, no edge above).
  // Otherwise, it returns the position of the cell directly above the current one.
  //
  return Math.floor(index / map.width) === 0
    ? -1
    : start + map.map[index - map.height];
}
