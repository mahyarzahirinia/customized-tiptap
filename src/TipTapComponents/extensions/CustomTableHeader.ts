import { TableHeader } from "@tiptap/extension-table-header";

export const CustomTableHeader = TableHeader.extend({
  renderHTML({ node, HTMLAttributes }) {
    return ["td", HTMLAttributes, 0]; // force th to render as td
  },

  parseHTML() {
    return [{ tag: "td" }, { tag: "th" }]; // treat both td and th as headers
  },
});
