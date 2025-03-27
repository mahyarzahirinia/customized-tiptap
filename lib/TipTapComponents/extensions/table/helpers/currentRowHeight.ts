import { EditorView } from "prosemirror-view";
import { Attrs } from "prosemirror-model";

export function currentRowHeight(
  view: EditorView,
  cellPos: number,
  { rowspan, rowHeight }: Attrs,
): number {
  const height = rowHeight && rowHeight[rowHeight.length - 1];

  if (height) return height;

  const dom = view.domAtPos(cellPos);

  const node = dom.node.childNodes[dom.offset] as HTMLElement;

  let domHeight = node.offsetHeight,
    parts = rowspan;

  if (rowHeight)
    for (let i = 0; i < rowspan; i++)
      if (rowHeight[i]) {
        domHeight -= rowHeight[i];
        parts--;
      }
  return domHeight / parts;
}
