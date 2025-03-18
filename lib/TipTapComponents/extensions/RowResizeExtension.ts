import { Extension } from "@tiptap/core";
import { rowResizing, rowResizingPluginKey } from "./table/rowresizing";

export const RowResizeExtension = Extension.create({
  key: rowResizingPluginKey,

  addProseMirrorPlugins() {
    return [rowResizing()];
  },
});
