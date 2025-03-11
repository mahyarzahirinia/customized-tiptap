import {
  Extension,
  generateHTML,
  Editor,
  type RawCommands,
} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

export const PreviewExtension = Extension.create({
  name: "preview",

  addCommands() {
    return {
      generateHTML:
        () =>
        ({ editor }: { editor: Editor }) => {
          return generateHTML(editor.getJSON(), [StarterKit]);
        },
    } as Partial<RawCommands>;
  },
});
