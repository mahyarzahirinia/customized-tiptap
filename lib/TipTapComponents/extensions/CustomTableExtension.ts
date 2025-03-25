import { Table } from "@tiptap/extension-table";
import { rowResizing } from "./table/rowresizing";

export const CustomTableExtension = Table.extend({
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
