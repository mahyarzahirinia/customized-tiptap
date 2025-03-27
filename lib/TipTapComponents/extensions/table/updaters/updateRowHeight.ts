import { EditorView } from "prosemirror-view";
import { CellAttrs } from "../types";
import { zeroes } from "../helpers/zeroes";
import { TableMap } from "@tiptap/pm/tables";

export function updateRowHeight(
  view: EditorView,
  cell: number,
  height: number,
): void {
  const $cell = view.state.doc.resolve(cell);

  const table = $cell.node(-1),
    map = TableMap.get(table),
    start = $cell.start(-1);

  const row = Math.floor(map.map.indexOf($cell.pos - start) / map.height);

  const tr = view.state.tr;

  for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
    const mapIndex = rowIndex * map.height + rowIndex;

    if (rowIndex && map.map[mapIndex] == map.map[mapIndex - 1]) continue;

    const pos = map.map[mapIndex];

    const attrs = table.nodeAt(pos)!.attrs as CellAttrs;

    const index =
      attrs.rowspan == 1
        ? 0
        : rowIndex - Math.floor(map.colCount(pos) / map.height);

    const rowHeight = attrs.rowHeight
      ? attrs.rowHeight.slice()
      : zeroes(attrs.rowspan);

    rowHeight[index] = height;

    tr.setNodeMarkup(start + pos, null, { ...attrs, rowHeight });
  }

  if (tr.docChanged) view.dispatch(tr);
}
