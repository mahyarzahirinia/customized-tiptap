import { rowResizingPluginKey } from "../rowresizing";
import { updateHandle } from "../updaters/updateHandle";
export function handleMouseLeave(view) {
    if (!view.editable)
        return;
    const pluginState = rowResizingPluginKey.getState(view.state);
    if (!pluginState)
        return;
    if (pluginState.activeHandle > -1 && !pluginState.dragging) {
        updateHandle(view, -1);
    }
}
//# sourceMappingURL=handleMouseLeave.js.map