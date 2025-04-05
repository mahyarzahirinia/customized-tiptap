import { type EditorProps } from "prosemirror-view";
import { type EditorOptions } from "@tiptap/vue-3";

export type TiptapExtensionName =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "paragraph"
  | "heading"
  | "blockquote"
  | "bulletList"
  | "orderedList"
  | "listItem"
  | "codeBlock"
  | "hardBreak"
  | "horizontalRule"
  | "image"
  | "link"
  | "textAlign"
  | "color"
  | "highlight"
  | "subscript"
  | "superscript"
  | "table"
  | "tableRow"
  | "tableHeader"
  | "tableCell"
  | "mergeFields"
  | "placeholder"
  | "characterCount"
  | "history"
  | "directionWrapper"
  | "lineHeight"
  | "indentation"
  | "preview"
  | "fullscreen"
  | "print"
  | "pageBreak"
  | "linkAnchor"
  | "directionWrapper"
  | "mergeFields";

export interface TiptapEditorCustomClasses {
  /**
   * Class for the root wrapper of the Tiptap editor.
   */
  editorContainer?: string;

  /**
   * Class for the internal content area of the editor.
   */
  editorContent?: string;

  /**
   * Class for normal (non-fullscreen) display mode.
   */
  normalMode?: string;

  /**
   * Class for fullscreen display mode.
   */
  fullscreenMode?: string;
}

/**
 * Props for CustomizedTiptap editor
 */
export interface CustomizedTiptapProps {
  /**
   * read-only mode.
   */
  readonly?: boolean;

  /**
   * The HTML content to initialize the editor with.
   */
  content?: string;

  /**
   * List of extension names to exclude from the editor.
   */
  excludedExtensions?: TiptapExtensionName[];

  /**
   * List of extension names to include (only these will be loaded).
   */
  includedExtensions?: TiptapExtensionName[];

  /**
   * Additional props to pass directly to the underlying Tiptap editor.
   */
  editorProps?: EditorProps;

  /**
   * Custom CSS classes for different editor elements.
   * e.g., `{ editorWrapper: 'my-custom-class' }`
   */
  customClasses?: TiptapEditorCustomClasses;

  /**
   * Custom Editor Options for Tiptap.
   */
  editorOptions?: EditorOptions;
}
