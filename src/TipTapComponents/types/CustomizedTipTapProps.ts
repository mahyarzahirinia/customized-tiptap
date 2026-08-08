import { type EditorProps } from "prosemirror-view";
import { type Editor, type EditorOptions } from "@tiptap/vue-3";
// import { MergeFieldType } from "../components/MergeFields/useMergeFields";
import { Ref } from "vue";

export type TiptapExtensionName =
  // Custom extensions
  | "textAlign"
  | "linkAnchor"
  | "idSetter"
  | "print"
  | "preview"
  | "fullscreen"
  | "highlight"
  | "color"
  | "directionWrapper"
  | "listItem"
  | "orderedList"
  | "bulletList"
  | "fontSize"
  | "link"
  | "mergeFields"
  | "pageBreak"
  | "table"
  | "customTableRow"
  | "customTableHeader"
  | "floatingToolboxPlugin"
  | "imageResize"
  | "indentation"
  | "lineHeight"
  | "characterCount"
  | "customTextBlock"
  // Built-in extensions
  | "tableCell"
  | "fontFamily"
  | "italic"
  | "strike"
  | "codeBlockLowlight"
  | "underline"
  | "dropcursor"
  | "gapcursor"
  | "history"
  | "textStyle"
  | "blockquote"
  | "bold"
  | "doc"
  | "heading"
  | "paragraph"
  | "text"
  | "hardBreak"
  | "horizontalRule"
  // Additional extensions that might be used
  | "image"
  | "tableRow"
  | "tableHeader"
  | "placeholder"
  | "subscript"
  | "superscript";

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
 * Allowed preset names for the editor
 */
export type TiptapPresetName =
  | "minimal"
  | "basic"
  | "full-feature"
  | "writing"
  | "tables";

// New grouped type for merge fields
export interface GroupedMergeFields {
  group: string;
  entries: Array<{
    title: string;
    value: string;
    name?: string;
  }>;
}

export interface BasicMergeField {
  title: string;
  name?: string;
  value?: string;
  label?: string;
  group?: string;
}

export type MergeFieldInputType = "default" | "basic";

export type TiptapLanguage = "fa" | "en";

export interface TiptapFontFamilyOption {
  title: string;
  value: string;
}

export type MergeFieldsData = Array<GroupedMergeFields | BasicMergeField>;

/**
 * CustomizedTipTapProps for CustomizedTiptap editor
 */
export interface CustomizedTipTapProps {
  /**
   * read-only mode.
   */
  readonly?: boolean;

  /**
   * The HTML content to initialize the editor with 2-way bound.
   */
  modelValue?: string;

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

  /**
   * Merge Fields Data Array.
   * Accepts either a flat array (legacy) or a grouped array (preferred).
   */
  mergeFieldsData?: MergeFieldsData;

  /**
   * Controls which merge field input UI to render in the toolbar.
   * - 'default': grouped merge fields with custom dropdown
   * - 'basic': flat list using Vuetify autocomplete
   */
  inputType?: MergeFieldInputType;

  /**
   * Exposed ref Instance Of The Editor
   */
  editorRef?: Ref<Editor | null>;

  /**
   * If true, advanced components in the toolbar will be lazy loaded. If false, they will be eagerly loaded.
   */
  lazyloadAdvancedComponents?: boolean;

  /**
   * UI language for editor controls.
   * Supports Persian (`fa`) and English (`en`).
   */
  language?: TiptapLanguage;

  /**
   * Font family used by editable content.
   * The editor UI uses a language-aware font stack.
   * Consumers are responsible for loading custom fonts in their app CSS.
   */
  fontFamily?: string;

  /**
   * Font options shown in the toolbar font-family selector.
   * The option values should match loaded CSS font-family names.
   */
  fontFamilyOptions?: TiptapFontFamilyOption[];

  /**
   * If true, renders a toolbar control that toggles between Persian and English.
   */
  showLanguageToggle?: boolean;

  /**
   * Name of a preset to load a predefined set of extensions. Overrides included/excludedExtensions if provided.
   * Supported: 'minimal', 'basic', 'full-feature', 'writing', 'tables'
   */
  preset?: TiptapPresetName;
}
