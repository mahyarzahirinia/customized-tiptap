import { TableRow } from "@tiptap/extension-table-row";

export const CustomTableRow = TableRow.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      rowheight: {
        default: 30,
        parseHTML: (element) => element.getAttribute("data-rowheight") || 25,
        renderHTML: (attributes) => ({
          "data-rowheight": attributes.rowheight,
          style: `height: ${attributes.rowheight}px`,
        }),
      },
    };
  },
});
