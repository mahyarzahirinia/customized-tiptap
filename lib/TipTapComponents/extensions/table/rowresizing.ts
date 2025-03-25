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
        // this delegates to ResizeState.constructor
        const nodeViews = plugin.spec?.props?.nodeViews; // tries to access the nodeViews object defined in the plugin's props
        const tableName = tableNodeTypes(state.schema).table.name; // gets the name of the "table" node from the schema
        if (View && nodeViews) {
          // whenever ProseMirror renders a table node, it will
          nodeViews[tableName] = (node, view) => {
            // create a new instance of the View class (likely a custom table rendering class)
            return new View(node, defaultCellMinHeight, view);
          };
        }
        // activeHandle = -1 means no handle is active (hovered or grabbed)
        // dragging = false means the user is not dragging a row to resize
        return new ResizeState(-1, false); // initial state setup
      },
      apply(tr, prev) {
        // when transactions (tr) are applied, rowResizing calls ResizeState.apply()
        return prev.apply(tr);
      },
    },
    props: {
      // is where ProseMirror plugins hook into the editor's behavior and DOM
      attributes: (state): Record<string, string> => {
        // adds HTML attributes (like class) to the editor's outer <div> dynamically based on the plugin state
        const pluginState = rowResizingPluginKey.getState(state);
        return pluginState && pluginState.activeHandle > -1
          ? { class: "resize-cursor" }
          : {};
      },

      handleDOMEvents: {
        // defines custom event handlers for DOM events that happen in the editor
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
        // drawing UI elements like the resize handle
        const pluginState = rowResizingPluginKey.getState(state);
        if (pluginState && pluginState.activeHandle > -1) {
          // if a resize handle is active, it calls handleDecorations to generate decoration
          // elements (like a blue line showing where the resize happens)
          return handleDecorations(state, pluginState.activeHandle);
        }
      },

      // here, it's empty, but elsewhere (in init()), the table nodeView might be injected
      nodeViews: {},
    },
  });

  return plugin;
}

/**
 * @public
 */
export class ResizeState {
  // managing state of the resizing
  constructor(
    public activeHandle: number, // active handle
    public dragging: Dragging | false, // dragging state
  ) {}

  apply(tr: Transaction): ResizeState {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const state = this;
    // stores the current instance (this) in a state variable for easier referencing.
    const action = tr.getMeta(rowResizingPluginKey);
    // tries to fetch any metadata related to rowResizingPluginKey from the transaction.
    // metadata is how ProseMirror plugins pass custom instructions (like "start dragging" or "set active handle").
    if (action && action.setHandle != null)
      // Case 1 - Update the active handle
      // if the transaction carries a setHandle action.
      // example action: mouse moved near a handle — we activate that handle.
      return new ResizeState(action.setHandle, false);
    if (action && action.setDragging !== undefined)
      // Case 2 - Update dragging state
      // if the transaction carries a setDragging action
      // example: mouse down triggered dragging, or mouse up ended dragging.
      return new ResizeState(state.activeHandle, action.setDragging);
    if (state.activeHandle > -1 && tr.docChanged) {
      // Case 3 - Remap active handle if doc changed
      // if there's an active handle (> -1) && the document was changed
      // if yes, the handle's position might have shifted due to content changes — remap it.
      let handle = tr.mapping.map(state.activeHandle, -1);
      // maps the old handle position through the transaction's changes using tr.mapping.
      // -1 is the bias (direction hint) during mapping.
      if (!pointsAtCell(tr.doc.resolve(handle))) {
        // after remapping, it checks if the new handle position still points at a valid table cell.
        // if not, it deactivates the handle by setting it to -1.
        handle = -1;
      }
      // returns a new ResizeState with the (potentially remapped) handle and the current dragging state.
      return new ResizeState(handle, state.dragging);
    }

    return state;
    // Default case - No changes
    // if none of the above conditions matched, the state stays the same.
  }
}

// every time the mouse moves over the editor, this gets called.
function handleMouseMove(
  view: EditorView,
  event: MouseEvent,
  handleHeight: number,
  lastRowResizable: boolean,
): void {
  if (!view.editable) return;

  const pluginState = rowResizingPluginKey.getState(view.state);
  if (!pluginState) return;

  if (!pluginState.dragging) {
    // if editor was not in state of dragging
    const target = domCellAround(event.target as HTMLElement);
    // if mouse inside, the content of each cell and if outside the editor div
    let cell = -1;
    if (target) {
      const { top, bottom } = target.getBoundingClientRect();
      // getBoundingClientRect return the rectangle, including its padding and border-width.
      // The left, top, right, bottom, x, y, width, and height

      if (event.clientY - top <= handleHeight)
        // clientY: vertical position of the mouse relative to the viewport
        // event.clientY - top: How far is the mouse from the top edge of the cell?
        // basically: is the mouse pointer within the first handleHeight pixels from the top of the row or cell?
        cell = edgeCell(view, event, "top", handleHeight); // if not found -1
      else if (bottom - event.clientY <= handleHeight)
        cell = edgeCell(view, event, "bottom", handleHeight);
    }

    if (cell != pluginState.activeHandle) {
      // check if the detected cell has changed:
      if (!lastRowResizable && cell !== -1) {
        // lastRowResizable is a config flag
        // cell !== -1: confirms we’re over a valid row edge
        //
        // check if the last row is not resizable and we’re hovering over a valid cell
        // If the last row is locked and this might be the last row, we need to check if the cursor is near it

        // turns the numeric position cell into a ProseMirror ResolvedPos for easy node inspection
        const $cell = view.state.doc.resolve(cell);
        // node(-1) moves up to the ancestor node that is a table
        const table = $cell.node(-1);
        // TableMap provides information about the structure of the table (rows, columns, cell spans, etc.)
        const map = TableMap.get(table);
        // calculate where the table starts in the document: start(-1) gives the start position of the parent node (table)
        const tableStart = $cell.start(-1);
        // calculate the cell’s column index within the table:
        // map.colCount($cell.pos - tableStart): gets the column number of the cell
        // add the cell’s colspan (how many columns it spans) minus 1 (because colspan is inclusive)
        // this calculation determines the ending column of the current cell
        const col =
          map.colCount($cell.pos - tableStart) +
          $cell.nodeAfter!.attrs.colspan -
          1;

        if (col == map.height - 1) {
          // check if the cell is in the last row:
          return;
        }
      }

      updateHandle(view, cell);
    }
  }
}

// triggered when the mouse leaves the editor area.
function handleMouseLeave(view: EditorView): void {
  if (!view.editable) return;

  const pluginState = rowResizingPluginKey.getState(view.state);
  if (pluginState && pluginState.activeHandle > -1 && !pluginState.dragging)
    updateHandle(view, -1);
}

// triggered when the mouse is clicked down inside the editor.
function handleMouseDown(
  view: EditorView,
  event: MouseEvent,
  cellMinHeight: number,
  defaultCellMinHeight: number,
): boolean {
  if (!view.editable) return false;

  // get the window object (handles cases where editor runs in an iframe).
  const win = view.dom.ownerDocument.defaultView ?? window;

  // retrieve the plugin state which holds the active handle and dragging info.
  const pluginState = rowResizingPluginKey.getState(view.state);
  if (!pluginState || pluginState.activeHandle == -1 || pluginState.dragging)
    // early exit if:
    // plugin state is missing
    // no active handle detected (mouse isn’t near a resizable row)
    // already dragging
    return false;

  // get the target cell node where the resizing started (by document position).
  const cell = view.state.doc.nodeAt(pluginState.activeHandle)!;
  // calculate the current "height"
  const height = currentRowHeight(view, pluginState.activeHandle, cell.attrs);
  // dispatch a transaction to update plugin state:
  // sets the dragging mode active
  view.dispatch(
    view.state.tr.setMeta(rowResizingPluginKey, {
      setDragging: { startY: event.clientY, startHeight: height },
    }),
  );

  // called when mouseup happens
  function finish(event: MouseEvent) {
    // remove event listeners (cleanup)
    win.removeEventListener("mouseup", finish);
    win.removeEventListener("mousemove", move);

    const pluginState = rowResizingPluginKey.getState(view.state);
    if (pluginState?.dragging) {
      // check if dragging is still active (might not be if canceled)

      // perform the actual height update:
      updateRowHeight(
        view,
        pluginState.activeHandle,
        draggedHeight(pluginState.dragging, event, cellMinHeight),
      );

      // reset dragging state in the plugin
      view.dispatch(
        view.state.tr.setMeta(rowResizingPluginKey, { setDragging: null }),
      );
    }
  }

  // called on mousemove
  function move(event: MouseEvent): void {
    // if the mouse button is released while moving, end the drag immediately.
    if (!event.which) return finish(event);

    const pluginState = rowResizingPluginKey.getState(view.state);
    if (!pluginState) return;

    if (pluginState.dragging) {
      // if dragging, compute the new dragged height based on the mouse Y movement.
      const dragged = draggedHeight(pluginState.dragging, event, cellMinHeight);

      // display the row height change visually while dragging.
      displayRowHeight(
        view,
        pluginState.activeHandle,
        dragged,
        defaultCellMinHeight,
      );
    }
  }

  // display initial resizer line (current position) before dragging starts.
  displayRowHeight(
    view,
    pluginState.activeHandle,
    height,
    defaultCellMinHeight,
  );

  // attach global listeners to:
  // end the drag when the mouse is released
  // update the resizer line as the mouse moves
  win.addEventListener("mouseup", finish);
  win.addEventListener("mousemove", move);
  // prevent default behavior (avoid text selection while dragging).
  event.preventDefault();

  return true;
}

// compute the current row height of a cell
function currentRowHeight(
  view: EditorView,
  cellPos: number,
  { rowspan, rowHeight }: Attrs,
): number {
  // get the last value of the rowHeight array
  const height = rowHeight && rowHeight[rowHeight.length - 1];

  if (height) return height;

  // get the DOM node at the cell’s position — gives you { node, offset }.
  const dom = view.domAtPos(cellPos);
  // extract the actual HTML table cell DOM node.
  const node = dom.node.childNodes[dom.offset] as HTMLElement;

  let domHeight = node.offsetHeight,
    parts = rowspan;

  // loop through each spanned row:
  // If a width is defined for that row, subtract it from the total height
  // decrease parts accordingly
  if (rowHeight)
    for (let i = 0; i < rowspan; i++)
      if (rowHeight[i]) {
        domHeight -= rowHeight[i];
        parts--;
      }
  return domHeight / parts;
}

function domCellAround(target: HTMLElement | null): HTMLElement | null {
  // walks up the DOM tree to find the nearest <TD> or <TH> element (table cell) around the given target.
  while (target && target.nodeName != "TD" && target.nodeName != "TH") {
    // keep climbing up the DOM tree until a table cell is found or the root is reached.
    target =
      target.classList && target.classList.contains("ProseMirror")
        ? null
        : (target.parentNode as HTMLElement);
  }
  return target;
}

// determining which cell edge you’re resizing
function edgeCell(
  view: EditorView,
  event: MouseEvent,
  side: "top" | "bottom",
  handleHeight: number,
): number {
  // return: a position number of the cell's start (or -1 if not found / invalid)
  const offset = side === "top" ? handleHeight : -handleHeight;
  const found = view.posAtCoords({
    left: event.clientY,
    top: event.clientY + offset,
  });
  if (!found) return -1;
  const $cell = cellAround(view.state.doc.resolve(found.pos));
  // cellAround: walks up the node tree to locate the nearest table cell (<td> or <th>)
  if (!$cell) return -1;
  if (side === "bottom") return $cell.pos;
  // this position helps the resize logic know which cell’s bottom edge is being targeted
  const map = TableMap.get($cell.node(-1)),
    // ProseMirror’s table map (used for calculating cell positions)
    // node(-1): refers to the table node itself (since $cell is nested)
    start = $cell.start(-1);
  const index = map.map.indexOf($cell.pos - start);
  // get the index of this cell within the table map
  // map.map is a flat array of cell positions
  // $cell.pos - start: relative position of the cell within the table
  // used to figure out if this is the first column (top edge)
  return Math.floor(index / map.width) === 0
    ? -1
    : start + map.map[index - map.height];
  // index % map.width == 0: checks if the cell is in the first column
  // if true, can’t resize top (no cell to the top) → return -1
  // otherwise, return the position of the previous cell in the same column (to the top)
}

// compute the new row height based on how far the mouse moved
function draggedHeight(
  dragging: Dragging,
  event: MouseEvent,
  resizeMinHeight: number,
): number {
  const offset = event.clientY - dragging.startY;
  return Math.max(resizeMinHeight, dragging.startHeight + offset);
}

// update the handle
function updateHandle(view: EditorView, value: number): void {
  view.dispatch(
    view.state.tr.setMeta(rowResizingPluginKey, { setHandle: value }),
  );
}

// update a specific row’s height
function updateRowHeight(view: EditorView, cell: number, height: number): void {
  // cell: giving access to parent nodes and position info.
  const $cell = view.state.doc.resolve(cell);

  // giving access to parent nodes and position info.
  const table = $cell.node(-1),
    // map: get the table’s structure (TableMap helps map cells by index)
    map = TableMap.get(table),
    // start: position where the table starts in the document
    start = $cell.start(-1);

  // calculate the row index of the cell within the table
  // finds the cell’s index in the map.map array
  // divides by map.height to compute the row number
  const row = Math.floor(map.map.indexOf($cell.pos - start) / map.height);

  // create a new transaction to batch the updates.
  const tr = view.state.tr;

  // iterate over each column in the row
  for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
    // compute the linear index of the cell within map.map
    const mapIndex = rowIndex * map.height + rowIndex;

    // skip this cell if it is part of a rowspan continuation — i.e., it’s not the starting cell of a row span.
    if (rowIndex && map.map[mapIndex] == map.map[mapIndex - 1]) continue; // rowspan handled

    // get the document-relative position of the cell.
    const pos = map.map[mapIndex];
    // get the cell’s attributes (like colspan, rowspan, etc.)
    const attrs = table.nodeAt(pos)!.attrs as CellAttrs;

    // calculate the rowHeight array index where this height should be updated:
    // if rowspan == 1, it’s the first and only row
    // otherwise, compute based on how many columns the cell spans and the row position
    const index =
      attrs.rowspan == 1
        ? 0
        : rowIndex - Math.floor(map.colCount(pos) / map.height);

    // clone the existing rowHeight array if available, or initialize a new array filled with zeros for the rowspan.
    const rowHeight = attrs.rowHeight
      ? attrs.rowHeight.slice()
      : zeroes(attrs.rowspan);

    // set the new height at the correct index.
    rowHeight[index] = height;

    // apply the updated rowHeight back to the cell node using setNodeMarkup
    tr.setNodeMarkup(start + pos, null, { ...attrs, rowHeight });
  }

  if (tr.docChanged)
    // if the transaction resulted in document changes, dispatch the transaction to apply them.
    view.dispatch(tr);
}

// defines a function to visually display the row height change during dragging (temporary UI update).
function displayRowHeight(
  view: EditorView,
  cell: number,
  height: number,
  defaultCellMinHeight: number,
): void {
  // get the cell’s document-relative position and the table node
  const $cell = view.state.doc.resolve(cell);

  // get the parent table node and its start position in the document.
  const table = $cell.node(-1),
    start = $cell.start(-1);

  // calculate the target column index within the table
  // colCount: how many columns before this cell
  // add the cell’s colspan (minus one because index is 0-based)
  // this determines which column or part of the table needs to be updated
  const col =
    TableMap.get(table).colCount($cell.pos - start) +
    $cell.nodeAfter!.attrs.colspan -
    1;

  // find the DOM node at the start of the table in the document.
  let dom: Node | null = view.domAtPos($cell.start(-1)).node;

  while (dom && dom.nodeName != "TABLE") {
    // walk up the DOM tree to locate the <table> element.
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

// is responsible for creating ProseMirror decorations that visually indicate where row resizing handles should appear in a table.
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

  // Get absolute position within the table
  const posInTable = $cell.pos - start;

  // Find the cell's row and column
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

  // Special handling for first row
  if (row === 0) {
    for (let c = 0; c < map.width; c++) {
      const index = c; // First row has indices 0 to width-1
      const cellPos = map.map[index];
      const cellNode = table.nodeAt(cellPos);
      if (!cellNode) continue;

      // Always show handle for first row cells
      const pos = start + cellPos + cellNode.nodeSize - 1;
      const dom = document.createElement("div");
      dom.className = "row-resize-handle first-row-handle"; // Added special class

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

  // Original handling for other rows
  for (let colIndex = 0; colIndex < map.width; colIndex++) {
    const index = row * map.width + colIndex;
    if (index >= map.map.length || row === 0) continue; // Skip if first row (already handled)

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
