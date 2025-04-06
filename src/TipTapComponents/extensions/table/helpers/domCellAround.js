/**
  This helper function finds the nearest table cell (td or th) i.e cells
  ** td: Table Data Cell
  ** th: Table Header Cell
*/
export function domCellAround(target) {
    while (target && target.nodeName != "TD" && target.nodeName != "TH") {
        target =
            target.classList && target.classList.contains("ProseMirror")
                ? null
                : target.parentNode;
    }
    return target;
}
//# sourceMappingURL=domCellAround.js.map