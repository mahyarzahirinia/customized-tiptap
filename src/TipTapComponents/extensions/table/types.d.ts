import { PluginKey } from "prosemirror-state";
import { Node as ProsemirrorNode } from "prosemirror-model";
import { EditorView, NodeView } from "prosemirror-view";
import { ResizeState } from "./rowresizing";

export type CellAttrs = {
  colspan?: number;
  rowspan?: number;
  colWidth?: number[];
  rowheight?: number[];
};

export type RowResizingOptions = {
  handleHeight?: number;
  cellMinHeight?: number;
  defaultCellMinHeight?: number;
  lastRowResizable?: boolean;
  View?:
    | (new (
        node: ProsemirrorNode,
        cellMinHeight: number,
        view: EditorView,
      ) => NodeView)
    | null;
};

export type Dragging = { startY: number; startHeight: number; row?: number };

interface DraggingState {
  startY: number;
  startHeight: number;
  rowCells: number[];
  tableStart: number;
  row: number;
}
