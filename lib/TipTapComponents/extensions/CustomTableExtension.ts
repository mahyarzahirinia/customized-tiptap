import { Table } from "@tiptap/extension-table";
import { rowResizing } from "./table/rowresizing";

export const CustomTableExtension = Table.extend({
  addProseMirrorPlugins() {
    console.log("RowResizeExtension loaded and working");
    return [rowResizing()];
  },
});
