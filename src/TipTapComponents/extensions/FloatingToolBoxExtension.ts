import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";
import { DecorationSet } from "prosemirror-view";

const FloatingToolboxPluginKey = new PluginKey("floatingToolboxPlugin");

export function FloatingToolboxPlugin() {
  return new Plugin({
    key: FloatingToolboxPluginKey,

    state: {
      init() {
        return { show: false, boxPos: { from: 0, to: 0 } };
      },
      apply(tr, value, oldState, newState) {
        const { selection } = tr;
        if (selection.empty) return { show: false, boxPos: { from: 0, to: 0 } };
        return {
          show: true,
          boxPos: { from: selection.from, to: selection.to },
        };
      },
    },
    props: {
      decorations(state) {
        const myState = this.getState(state);

        return DecorationSet.empty;
      },
    },
  });
}

export const CustomFloatingToolboxPlugin = Extension.create({
  addProseMirrorPlugins() {
    return [FloatingToolboxPlugin()];
  },
});
