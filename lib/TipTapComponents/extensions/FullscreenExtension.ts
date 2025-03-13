import { Extension, type CommandProps, type RawCommands } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    Fullscreen: {
      toggleFullscreen: () => ReturnType;
    };
  }
}

export const FullscreenExtension = Extension.create({
  name: "fullscreen",

  addStorage() {
    return {
      isFullscreen: false,
    };
  },

  addCommands() {
    return {
      toggleFullscreen:
        () =>
        ({ editor }: CommandProps) => {
          const editorEl = editor.options.element.closest(".tiptap-editor");
          if (!editorEl) return false;

          if (this.storage.isFullscreen) {
            // exit fullscreen
            editorEl.classList.remove("fullscreen-mode");
            this.storage.isFullscreen = false;
          } else {
            // enter fullscreen
            editorEl.classList.add("fullscreen-mode");
            this.storage.isFullscreen = true;
          }

          return true;
        },
    } as Partial<RawCommands>;
  },
});
