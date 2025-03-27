import { EditorView } from "prosemirror-view";
import { cellAround } from "@tiptap/pm/tables";
import { TableMap } from "@tiptap/pm/tables";

export function edgeCell(
  view: EditorView,
  event: MouseEvent,
  side: "top" | "bottom",
  handleHeight: number,
): number {
  const offset = side === "top" ? handleHeight : -handleHeight;
  const found = view.posAtCoords({
    left: event.clientY,
    top: event.clientY + offset,
  });
  if (!found) return -1;
  const $cell = cellAround(view.state.doc.resolve(found.pos));

  if (!$cell) return -1;
  if (side === "bottom") return $cell.pos;

  const map = TableMap.get($cell.node(-1)),
    start = $cell.start(-1);
  const index = map.map.indexOf($cell.pos - start);

  return Math.floor(index / map.width) === 0
    ? -1
    : start + map.map[index - map.height];
}
