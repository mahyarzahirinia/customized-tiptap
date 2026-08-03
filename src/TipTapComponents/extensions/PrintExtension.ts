import { Extension, Editor, type RawCommands } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    PrintExtension: {
      print: () => ReturnType;
    };
  }
}

export const PrintExtension = Extension.create({
  name: "print",

  addCommands() {
    return {
      print:
        () =>
        ({ editor }: { editor: Editor }) => {
          const htmlContent = editor.getHTML();

          const printWindow = window.open("", "_blank")!;
          if (!printWindow) return false;

          const doc = printWindow.document;

          // Create the HTML structure
          const html = doc.createElement("html");
          const head = doc.createElement("head");
          const title = doc.createElement("title");
          title.textContent = "چاپ";

          // include all current styles
          // debugger;
          document
            .querySelectorAll('style, link[rel="stylesheet"]')
            .forEach((el) => {
              head.appendChild(el.cloneNode(true));
            });

          const style = doc.createElement("style");
          style.textContent = `
            body { font-family: var(--tiptap-editor-font); padding: 20px; }
            .prose { max-width: 100%; }
            hr[data-type="pagebreak"] {
              border-top: 2px dashed;
              margin-top: 2.5rem;
              margin-bottom: 2.5rem;
            }
            @media print {
              hr[data-type="pagebreak"] {
                padding: 0;
                margin-top: 0;
                margin-bottom: 0;
                border: 0;
                break-before: page;
                page-break-before: always;
              }
            }
          `;

          head.appendChild(title);
          head.appendChild(style);

          const body = doc.createElement("body");
          body.className = "prose";
          body.innerHTML = htmlContent;

          html.appendChild(head);
          html.appendChild(body);

          // Write the structure to the document
          doc.replaceChild(html, doc.documentElement);

          doc.close();
          printWindow.focus();
          printWindow.print();
          // printWindow.close();

          return true;
        },
    } as Partial<RawCommands>;
  },
});
