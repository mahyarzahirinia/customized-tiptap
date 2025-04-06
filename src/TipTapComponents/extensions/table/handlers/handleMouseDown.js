import { rowResizingPluginKey } from "../rowresizing";
import { TableMap } from "@tiptap/pm/tables";
import { currentRowHeight } from "../helpers/currentRowHeight";
import { draggedHeight } from "../helpers/draggedHeight";
import { updateRowHeight } from "../updaters/updateRowHeight";
import { displayRowHeight } from "../helpers/displayRowHeight";
export function handleMouseDown(view, event, cellMinHeight, defaultCellMinHeight) {
    var _a;
    if (!view.editable)
        return false;
    const win = (_a = view.dom.ownerDocument.defaultView) !== null && _a !== void 0 ? _a : window;
    const pluginState = rowResizingPluginKey.getState(view.state);
    if (!pluginState || pluginState.activeHandle === -1)
        return false;
    if (pluginState.dragging)
        return false;
    const $cell = view.state.doc.resolve(pluginState.activeHandle);
    const table = $cell.node(-1);
    if (!table)
        return false;
    const tableStart = $cell.start(-1);
    const map = TableMap.get(table);
    const cellPos = $cell.pos - tableStart;
    let row = 0;
    for (let i = 0; i < map.map.length; i++) {
        if (map.map[i] <= cellPos &&
            cellPos < map.map[i] + table.nodeAt(map.map[i]).nodeSize) {
            row = Math.floor(i / map.width);
            break;
        }
    }
    const rowCells = [];
    for (let col = 0; col < map.width; col++) {
        const index = row * map.width + col;
        if (index >= map.map.length)
            continue;
        rowCells.push(map.map[index]);
    }
    const cellNode = $cell.nodeAfter;
    if (!cellNode)
        return false;
    const height = currentRowHeight(view, pluginState.activeHandle, cellNode.attrs);
    view.dispatch(view.state.tr.setMeta(rowResizingPluginKey, {
        setDragging: {
            startY: event.clientY,
            startHeight: height,
            rowCells,
            tableStart,
            row,
        },
    }));
    const finish = (event) => {
        win.removeEventListener("mouseup", finish);
        win.removeEventListener("mousemove", move);
        const currentState = rowResizingPluginKey.getState(view.state);
        if (!(currentState === null || currentState === void 0 ? void 0 : currentState.dragging))
            return;
        const dragged = draggedHeight(currentState.dragging, event, cellMinHeight);
        const draggingState = currentState.dragging;
        draggingState.rowCells.forEach((cellPos) => {
            updateRowHeight(view, draggingState.tableStart + cellPos, dragged);
        });
        view.dispatch(view.state.tr.setMeta(rowResizingPluginKey, { setDragging: null }));
    };
    const move = (event) => {
        if (!(event.buttons & 1))
            return finish(event);
        const currentState = rowResizingPluginKey.getState(view.state);
        if (!(currentState === null || currentState === void 0 ? void 0 : currentState.dragging))
            return;
        const dragged = draggedHeight(currentState.dragging, event, cellMinHeight);
        const draggingState = currentState.dragging;
        draggingState.rowCells.forEach((cellPos) => {
            displayRowHeight(view, draggingState.tableStart + cellPos, dragged, defaultCellMinHeight);
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
//# sourceMappingURL=handleMouseDown.js.map