export function currentRowHeight(view, cellPos, { rowspan, rowHeight }) {
    const height = rowHeight && rowHeight[rowHeight.length - 1];
    if (height)
        return height;
    const dom = view.domAtPos(cellPos);
    const node = dom.node.childNodes[dom.offset];
    let domHeight = node.offsetHeight, parts = rowspan;
    if (rowHeight)
        for (let i = 0; i < rowspan; i++)
            if (rowHeight[i]) {
                domHeight -= rowHeight[i];
                parts--;
            }
    return domHeight / parts;
}
//# sourceMappingURL=currentRowHeight.js.map