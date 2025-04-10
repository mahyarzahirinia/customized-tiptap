import { EditorView } from "prosemirror-view";
import { Node as ProseMirrorNode } from "prosemirror-model";

export function updateRowsOnTransaction(
  view: EditorView,
  parent: ProseMirrorNode,
  rowIndex: number,
  newHeight: number,
): void {
  const { state, dispatch } = view;
  const { doc } = state;

  // Step 1: Find the parent's position in the document
  let parentPos = -1;
  doc.descendants((node, pos) => {
    if (node === parent) {
      parentPos = pos;
      return false; // Stop traversal
    }
    return true;
  });

  if (parentPos === -1) {
    console.error("Parent node not found in the document.");
    return;
  }

  // Step 2: Calculate the row's position
  if (rowIndex < 0 || rowIndex >= parent.childCount) {
    console.error(`Invalid rowIndex: ${rowIndex}`);
    return;
  }

  let rowPos = parentPos + 1; // Start of parent's content
  for (let i = 0; i < rowIndex; i++) {
    rowPos += parent.child(i).nodeSize;
  }

  // Step 3: Retrieve the row node and update its attributes
  const rowNode = parent.child(rowIndex);
  if (!rowNode) {
    console.error(`Row at index ${rowIndex} not found.`);
    return;
  }

  // Avoid unnecessary transaction if the height hasn't changed
  if (rowNode.attrs.rowheight === newHeight) {
    return;
  }

  const tr = state.tr.setNodeMarkup(rowPos, null, {
    ...rowNode.attrs,
    rowheight: newHeight,
  });

  dispatch(tr);
}
