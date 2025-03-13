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
          printWindow.document.write(`
            <html>
              <head>
                <title>چاپ</title>
                <style>
                  body { font-family: yekan, sahel,serif; padding: 20px; }
                  .prose { max-width: 100%; }
                </style>
              </head>
              <body class="prose">
                ${htmlContent}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          printWindow.close();

          return true;
        },
    } as Partial<RawCommands>;
  },
});
