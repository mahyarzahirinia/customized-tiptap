import { EditorView } from "prosemirror-view";
import { rowResizingPluginKey } from "../rowresizing";
import { updateHandle } from "../updaters/updateHandle";

export function handleMouseLeave(view: EditorView): void {
  if (!view.editable) return;

  const pluginState = rowResizingPluginKey.getState(view.state);
  if (!pluginState) return;

  if (pluginState.activeHandle > -1 && !pluginState.dragging) {
    updateHandle(view, -1);
  }
}
