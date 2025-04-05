import { Dragging } from "./types";
import { Transaction } from "prosemirror-state";
import { rowResizingPluginKey } from "./rowresizing";
import { pointsAtCell } from "@tiptap/pm/tables";

export class ResizeState {
  constructor(
    public activeHandle: number,
    public dragging: Dragging | false,
  ) {}

  apply(tr: Transaction): ResizeState {
    const state = this;

    const action = tr.getMeta(rowResizingPluginKey);

    if (action && action.setHandle != null)
      return new ResizeState(action.setHandle, false);
    if (action && action.setDragging !== undefined)
      return new ResizeState(state.activeHandle, action.setDragging);
    if (state.activeHandle > -1 && tr.docChanged) {
      let handle = tr.mapping.map(state.activeHandle, -1);

      if (!pointsAtCell(tr.doc.resolve(handle))) {
        handle = -1;
      }

      return new ResizeState(handle, state.dragging);
    }

    return state;
  }
}
