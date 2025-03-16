import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { type EditorView } from "prosemirror-view";

const characterCountPluginKey = new PluginKey("characterCountPlugin");

const characterCountPlugin = new Plugin({
  key: characterCountPluginKey,
  view: () => ({
    update: (view: EditorView) => {
      const characterCount = view.state.doc.textContent.length;
      console.log("characterCount:", characterCount);
    },
  }),
});

export const CharacterCountExtension = Extension.create({
  name: "characterCount",

  addProseMirrorPlugins() {
    return [characterCountPlugin];
  },
});
