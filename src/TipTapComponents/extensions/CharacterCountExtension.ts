import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet, type EditorView } from "prosemirror-view";

const characterCountPluginKey = new PluginKey("characterCountPlugin");

const characterCountPlugin = new Plugin({
  key: characterCountPluginKey,

  props: {
    decorations: (state) => {
      return DecorationSet.create(state.doc, [
        Decoration.widget(0, () => {
          const div = document.createElement("div");
          div.style.position = "absolute";
          div.style.bottom = "0";
          div.textContent = `تعداد کاراکتر ها: ${state.doc.textContent.length}`;
          return div;
        }),
      ]);
    },
  },
  // state: {
  //   init: (oldState, state) => {
  //     return { characterCount: state.doc.textContent.length };
  //   },
  //   apply: (tr, pluginState, oldState, newState) => {
  //     return { characterCount: newState.doc.textContent.length };
  //   },
  // },
});

export const CharacterCountExtension = Extension.create({
  name: "characterCount",

  addProseMirrorPlugins() {
    return [characterCountPlugin];
  },

  addStorage() {
    return {
      characterCount: (view: EditorView) => {
        return (
          characterCountPluginKey.getState(view.state)?.characterCount || 0
        );
      },
    };
  },
});
