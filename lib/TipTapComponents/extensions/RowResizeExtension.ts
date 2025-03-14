import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, type PluginSpec } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

const rowResizePluginKey = new PluginKey("rowResize");

export const RowResizeExtension = Extension.create({
  name: "rowResize",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: rowResizePluginKey,
        view: (editorView: EditorView) => {
          let isResizing: boolean = false;
          let startY: number = 0;
          let initialHeight: number = 0;
          let targetRow: HTMLTableRowElement | null = null;

          // ایجاد یک handle برای تغییر اندازه
          function createResizeHandle(): HTMLDivElement {
            const handle = document.createElement("div");
            handle.className = "row-resize-handle";
            handle.style.position = "absolute";
            handle.style.height = "5px";
            handle.style.width = "100%";
            handle.style.bottom = "0";
            handle.style.cursor = "ns-resize";
            handle.style.background = "rgba(0, 0, 0, 0.2)";

            console.log("createResizeHandle");

            return handle;
          }

          function attachHandlesToRows(): void {
            const rows = editorView.dom.querySelectorAll("tr");
            console.log("attachHandlesToRows");
            rows.forEach((row) => {
              const existingHandle = row.querySelector(".row-resize-handle");
              if (!existingHandle) {
                const handle = createResizeHandle();
                row.appendChild(handle);

                handle.addEventListener("mousedown", (event: MouseEvent) => {
                  event.preventDefault();
                  isResizing = true;
                  startY = event.clientY;
                  targetRow = row as HTMLTableRowElement;
                  initialHeight = targetRow.getBoundingClientRect().height;

                  document.addEventListener("mousemove", mousemoveHandler);
                  document.addEventListener("mouseup", mouseupHandler);
                });
              }
            });
          }

          function mousemoveHandler(event: MouseEvent): void {
            if (!isResizing || !targetRow) return;

            console.log("mousemoveHandler");

            const diff = event.clientY - startY;
            const newHeight = Math.max(20, initialHeight + diff); // حداقل ارتفاع 20 پیکسل

            targetRow.style.height = `${newHeight}px`;
            targetRow.style.minHeight = `${newHeight}px`;
          }

          function mouseupHandler(): void {
            if (isResizing) {
              console.log("mouseupHandler");

              isResizing = false;
              document.removeEventListener("mousemove", mousemoveHandler);
              document.removeEventListener("mouseup", mouseupHandler);
              targetRow = null; // این خط مهم است تا مرجع سطر ذخیره نشود
            }
          }

          return {
            update() {
              attachHandlesToRows();
            },
            destroy() {
              document.removeEventListener("mousemove", mousemoveHandler);
              document.removeEventListener("mouseup", mouseupHandler);
            },
          };
        },
      } as PluginSpec<any>),
    ];
  },
});
