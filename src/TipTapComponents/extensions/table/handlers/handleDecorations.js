import { Decoration, DecorationSet } from "prosemirror-view";
import { rowResizingPluginKey } from "../rowresizing";
import { TableMap } from "@tiptap/pm/tables";
export function handleDecorations(state, cell) {
    var _a, _b;
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
        if (map.map[i] <= posInTable &&
            posInTable < map.map[i] + table.nodeAt(map.map[i]).nodeSize) {
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
            if (!cellNode)
                continue;
            // Always show handle for first row cells
            const pos = start + cellPos + cellNode.nodeSize - 1;
            const dom = document.createElement("div");
            dom.className = "row-resize-handle first-row-handle"; // Added special class
            if ((_a = rowResizingPluginKey.getState(state)) === null || _a === void 0 ? void 0 : _a.dragging) {
                decorations.push(Decoration.node(start + cellPos, start + cellPos + cellNode.nodeSize, {
                    class: "row-resize-dragging",
                }));
            }
            decorations.push(Decoration.widget(pos, dom));
        }
    }
    // Original handling for other rows
    for (let colIndex = 0; colIndex < map.width; colIndex++) {
        const index = row * map.width + colIndex;
        if (index >= map.map.length || row === 0)
            continue; // Skip if first row (already handled)
        const cellPos = map.map[index];
        const cellNode = table.nodeAt(cellPos);
        if (!cellNode)
            continue;
        if (colIndex === map.width - 1 || map.map[index] !== map.map[index + 1]) {
            const pos = start + cellPos + cellNode.nodeSize - 1;
            const dom = document.createElement("div");
            dom.className = "row-resize-handle";
            if ((_b = rowResizingPluginKey.getState(state)) === null || _b === void 0 ? void 0 : _b.dragging) {
                decorations.push(Decoration.node(start + cellPos, start + cellPos + cellNode.nodeSize, {
                    class: "row-resize-dragging",
                }));
            }
            decorations.push(Decoration.widget(pos, dom));
        }
    }
    return DecorationSet.create(state.doc, decorations);
}
//# sourceMappingURL=handleDecorations.js.map