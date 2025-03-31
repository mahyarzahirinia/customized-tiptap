import { Table } from "@tiptap/extension-table";
import { rowResizing } from "./table/rowresizing";

export const CustomTableExtension = Table.extend({
  renderHTML({ node, HTMLAttributes }) {
    return ["td", HTMLAttributes, 0];
  },

  parseHTML() {
    return [{ tag: "td" }, { tag: "th" }];
  },
  addProseMirrorPlugins() {
    const parentPlugins = this.parent?.() || [];

    return [
      ...parentPlugins,
      rowResizing({
        View: this.options.View,
      }),
    ];
  },
});
