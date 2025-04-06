import { updateRowsOnTransaction } from "./updateRowsOnTransaction";
import { rowResizingPluginKey } from "../rowresizing";
export function updateRowsOnResize(node, table, cellMinHeight, overrideRow, overrideValue, view) {
    var _a, _b;
    if (!view)
        return;
    const pluginState = rowResizingPluginKey.getState(view === null || view === void 0 ? void 0 : view.state);
    // @ts-ignore
    const activeRowIndex = (_a = pluginState === null || pluginState === void 0 ? void 0 : pluginState.dragging.row) !== null && _a !== void 0 ? _a : -1; // Ensure a valid index
    if (activeRowIndex === undefined ||
        activeRowIndex < 0 ||
        activeRowIndex >= node.childCount) {
        return; // No valid row to resize
    }
    const rowNode = node.child(activeRowIndex);
    const newHeight = (_b = overrideValue !== null && overrideValue !== void 0 ? overrideValue : rowNode.attrs.rowheight) !== null && _b !== void 0 ? _b : cellMinHeight;
    if (view && view.state.tr) {
        updateRowsOnTransaction(view, node, activeRowIndex, newHeight);
    }
    // Apply height only to the active row
    const rows = table.rows;
    if (rows[activeRowIndex] &&
        rows[activeRowIndex].style.height !== `${newHeight}px`) {
        rows[activeRowIndex].style.height = `${newHeight}px`;
    }
}
//# sourceMappingURL=updateRowsOnResize.js.map