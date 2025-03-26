import { Attrs, Node as ProsemirrorNode } from "prosemirror-model";
import { EditorState, Plugin, PluginKey, Transaction } from "prosemirror-state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  NodeView,
} from "prosemirror-view";
import { tableNodeTypes } from "@tiptap/pm/tables";
import { TableMap } from "@tiptap/pm/tables";
import { TableView, updateColumnsOnResize } from "@tiptap/pm/tables";
import { cellAround, pointsAtCell } from "@tiptap/pm/tables";
import { updateRowsOnResize } from "./updateRowsOnResize";
export type CellAttrs = {
  colspan?: number;
  rowspan?: number;
  colWidth?: number[];
  rowHeight?: number[];
};

/**
 * @public
 */
export const rowResizingPluginKey = new PluginKey<ResizeState>(
  "tableRowResizing",
);

/**
 * @public
 */
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

/**
 * @public
 */
export type Dragging = { startY: number; startHeight: number };

interface DraggingState {
  startY: number;
  startHeight: number;
  rowCells: number[];
  tableStart: number;
  row: number;
}

/**
 * @public
 */
export function rowResizing({
  handleHeight = 5,
  cellMinHeight = 25,
  defaultCellMinHeight = 100,
  View = TableView,
  lastRowResizable = true,
}: RowResizingOptions = {}): Plugin {
  const plugin = new Plugin<ResizeState>({
    key: rowResizingPluginKey,
    state: {
      init(_, state) {
        const nodeViews = plugin.spec?.props?.nodeViews;
        const tableName = tableNodeTypes(state.schema).table.name;
        if (View && nodeViews) {
          nodeViews[tableName] = (node, view) => {
            return new View(node, defaultCellMinHeight, view);
          };
        }

        return new ResizeState(-1, false);
      },
      apply(tr, prev) {
        return prev.apply(tr);
      },
    },
    props: {
      attributes: (state): Record<string, string> => {
        const pluginState = rowResizingPluginKey.getState(state);
        return pluginState && pluginState.activeHandle > -1
          ? { class: "resize-cursor" }
          : {};
      },

      handleDOMEvents: {
        mousemove: (view, event) => {
          handleMouseMove(view, event, handleHeight, lastRowResizable);
        },
        mouseleave: (view) => {
          handleMouseLeave(view);
        },
        mousedown: (view, event) => {
          handleMouseDown(view, event, cellMinHeight, defaultCellMinHeight);
        },
      },

      decorations: (state) => {
        const pluginState = rowResizingPluginKey.getState(state);
        if (pluginState && pluginState.activeHandle > -1) {
          return handleDecorations(state, pluginState.activeHandle);
        }
      },

      nodeViews: {},
    },
  });

  return plugin;
}

/**
 * @public
 */
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

function handleMouseMove(
  view: EditorView,
  event: MouseEvent,
  handleHeight: number,
  lastRowResizable: boolean,
): void {
  if (!view.editable) return;

  const pluginState = rowResizingPluginKey.getState(view.state);
  if (!pluginState || pluginState.dragging) return;

  const target = domCellAround(event.target as HTMLElement);
  if (!target) return;

  const { top, bottom } = target.getBoundingClientRect();
  let activeCell = -1;

  if (event.clientY - top <= handleHeight) {
    activeCell = edgeCell(view, event, "top", handleHeight);
  } else if (bottom - event.clientY <= handleHeight) {
    activeCell = edgeCell(view, event, "bottom", handleHeight);
  }

  if (!lastRowResizable && activeCell !== -1) {
    const $cell = view.state.doc.resolve(activeCell);
    const table = $cell.node(-1);
    const map = TableMap.get(table);
    const tableStart = $cell.start(-1);
    const colIndex =
      map.colCount($cell.pos - tableStart) + $cell.nodeAfter!.attrs.colspan - 1;

    if (colIndex === map.height - 1) return;
  }

  if (activeCell !== pluginState.activeHandle) {
    updateHandle(view, activeCell);
  }
}

function handleMouseLeave(view: EditorView): void {
  if (!view.editable) return;

  const pluginState = rowResizingPluginKey.getState(view.state);
  if (!pluginState) return;

  if (pluginState.activeHandle > -1 && !pluginState.dragging) {
    updateHandle(view, -1);
  }
}

function handleMouseDown(
  view: EditorView,
  event: MouseEvent,
  cellMinHeight: number,
  defaultCellMinHeight: number,
): boolean {
  if (!view.editable) return false;

  const win = view.dom.ownerDocument.defaultView ?? window;
  const pluginState = rowResizingPluginKey.getState(view.state);

  if (!pluginState || pluginState.activeHandle === -1) return false;
  if (pluginState.dragging) return false;

  const $cell = view.state.doc.resolve(pluginState.activeHandle);
  const table = $cell.node(-1);
  if (!table) return false;

  const tableStart = $cell.start(-1);
  const map = TableMap.get(table);
  const cellPos = $cell.pos - tableStart;

  let row = 0;
  for (let i = 0; i < map.map.length; i++) {
    if (
      map.map[i] <= cellPos &&
      cellPos < map.map[i] + table.nodeAt(map.map[i])!.nodeSize
    ) {
      row = Math.floor(i / map.width);
      break;
    }
  }

  const rowCells: number[] = [];
  for (let col = 0; col < map.width; col++) {
    const index = row * map.width + col;
    if (index >= map.map.length) continue;
    rowCells.push(map.map[index]);
  }

  const cellNode = $cell.nodeAfter;
  if (!cellNode) return false;

  const height = currentRowHeight(
    view,
    pluginState.activeHandle,
    cellNode.attrs,
  );

  view.dispatch(
    view.state.tr.setMeta(rowResizingPluginKey, {
      setDragging: {
        startY: event.clientY,
        startHeight: height,
        rowCells,
        tableStart,
        row,
      } as DraggingState,
    }),
  );

  const finish = (event: MouseEvent) => {
    win.removeEventListener("mouseup", finish);
    win.removeEventListener("mousemove", move);

    const currentState = rowResizingPluginKey.getState(view.state);
    if (!currentState?.dragging) return;

    const dragged = draggedHeight(currentState.dragging, event, cellMinHeight);

    const draggingState = currentState.dragging as DraggingState;

    draggingState.rowCells.forEach((cellPos) => {
      updateRowHeight(view, draggingState.tableStart + cellPos, dragged);
    });

    view.dispatch(
      view.state.tr.setMeta(rowResizingPluginKey, { setDragging: null }),
    );
  };

  const move = (event: MouseEvent) => {
    if (!(event.buttons & 1)) return finish(event);

    const currentState = rowResizingPluginKey.getState(view.state);
    if (!currentState?.dragging) return;

    const dragged = draggedHeight(currentState.dragging, event, cellMinHeight);
    const draggingState = currentState.dragging as DraggingState;

    draggingState.rowCells.forEach((cellPos) => {
      displayRowHeight(
        view,
        draggingState.tableStart + cellPos,
        dragged,
        defaultCellMinHeight,
      );
    });
  };

  rowCells.forEach((cellPos) => {
    displayRowHeight(view, tableStart + cellPos, height, defaultCellMinHeight);
  });

  win.addEventListener("mouseup", finish);
  win.addEventListener("mousemove", move);
  event.preventDefault();
  return true;
}

function currentRowHeight(
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

function domCellAround(target: HTMLElement | null): HTMLElement | null {
  while (target && target.nodeName != "TD" && target.nodeName != "TH") {
    target =
      target.classList && target.classList.contains("ProseMirror")
        ? null
        : (target.parentNode as HTMLElement);
  }
  return target;
}

function edgeCell(
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

function draggedHeight(
  dragging: Dragging,
  event: MouseEvent,
  resizeMinHeight: number,
): number {
  const offset = event.clientY - dragging.startY;
  return Math.max(resizeMinHeight, dragging.startHeight + offset);
}

function updateHandle(view: EditorView, value: number): void {
  view.dispatch(
    view.state.tr.setMeta(rowResizingPluginKey, { setHandle: value }),
  );
}

function updateRowHeight(view: EditorView, cell: number, height: number): void {
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

function displayRowHeight(
  view: EditorView,
  cell: number,
  height: number,
  defaultCellMinHeight: number,
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
    dom.firstChild as HTMLTableRowElement,
    dom as HTMLTableElement,
    defaultCellMinHeight,
    col,
    height,
  );
}

function zeroes(n: number = 1): 0[] {
  return Array(n).fill(0);
}

export function handleDecorations(
  state: EditorState,
  cell: number,
): DecorationSet {
  const decorations = [];
  const $cell = state.doc.resolve(cell);
  const table = $cell.node(-1);
  if (!table) {
    return DecorationSet.empty;
  }

  const map = TableMap.get(table);
  const start = $cell.start(-1);

  const posInTable = $cell.pos - start;

  let row = 0;
  let col = 0;
  for (let i = 0; i < map.map.length; i++) {
    if (
      map.map[i] <= posInTable &&
      posInTable < map.map[i] + table.nodeAt(map.map[i])!.nodeSize
    ) {
      row = Math.floor(i / map.width);
      col = i % map.width;
      break;
    }
  }

  if (row === 0) {
    for (let c = 0; c < map.width; c++) {
      const index = c;
      const cellPos = map.map[index];
      const cellNode = table.nodeAt(cellPos);
      if (!cellNode) continue;

      const pos = start + cellPos + cellNode.nodeSize - 1;
      const dom = document.createElement("div");
      dom.className = "row-resize-handle first-row-handle";

      if (rowResizingPluginKey.getState(state)?.dragging) {
        decorations.push(
          Decoration.node(
            start + cellPos,
            start + cellPos + cellNode.nodeSize,
            {
              class: "row-resize-dragging",
            },
          ),
        );
      }
      decorations.push(Decoration.widget(pos, dom));
    }
  }

  for (let colIndex = 0; colIndex < map.width; colIndex++) {
    const index = row * map.width + colIndex;
    if (index >= map.map.length || row === 0) continue;

    const cellPos = map.map[index];
    const cellNode = table.nodeAt(cellPos);
    if (!cellNode) continue;

    if (colIndex === map.width - 1 || map.map[index] !== map.map[index + 1]) {
      const pos = start + cellPos + cellNode.nodeSize - 1;
      const dom = document.createElement("div");
      dom.className = "row-resize-handle";

      if (rowResizingPluginKey.getState(state)?.dragging) {
        decorations.push(
          Decoration.node(
            start + cellPos,
            start + cellPos + cellNode.nodeSize,
            {
              class: "row-resize-dragging",
            },
          ),
        );
      }
      decorations.push(Decoration.widget(pos, dom));
    }
  }

  return DecorationSet.create(state.doc, decorations);
}
