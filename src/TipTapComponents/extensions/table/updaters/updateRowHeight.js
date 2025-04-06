import { zeroes } from "../helpers/zeroes";
import { TableMap } from "@tiptap/pm/tables";
export function updateRowHeight(view, cell, height) {
    const $cell = view.state.doc.resolve(cell);
    const table = $cell.node(-1), map = TableMap.get(table), start = $cell.start(-1);
    const row = Math.floor(map.map.indexOf($cell.pos - start) / map.height);
    const tr = view.state.tr;
    for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
        const mapIndex = rowIndex * map.height + rowIndex;
        if (rowIndex && map.map[mapIndex] == map.map[mapIndex - 1])
            continue;
        const pos = map.map[mapIndex];
        const attrs = table.nodeAt(pos).attrs;
        const index = attrs.rowspan == 1
            ? 0
            : rowIndex - Math.floor(map.colCount(pos) / map.height);
        const rowheight = attrs.rowheight
            ? attrs.rowheight.slice()
            : zeroes(attrs.rowspan);
        rowheight[index] = height;
        tr.setNodeMarkup(start + pos, null, Object.assign(Object.assign({}, attrs), { rowheight }));
    }
    if (tr.docChanged)
        view.dispatch(tr);
}
//# sourceMappingURL=updateRowHeight.js.map