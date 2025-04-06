import { rowResizingPluginKey } from "../rowresizing";
export function updateHandle(view, value, rowIndex) {
    view.dispatch(view.state.tr.setMeta(rowResizingPluginKey, {
        setHandle: value,
        setRowIndex: rowIndex,
    }));
}
//# sourceMappingURL=updateHandle.js.map