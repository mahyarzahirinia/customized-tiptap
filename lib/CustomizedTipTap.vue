<script lang="ts" setup>
import { ref, nextTick, computed, unref, onMounted, watch } from "vue";
import { type Editor } from "@tiptap/core";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from "lowlight";
// styles
import "./TipTapComponents/styles/tables.css";
import "./TipTapComponents/styles/anchor.css";
import "./TipTapComponents/styles/direction.css";
import "./TipTapComponents/styles/pagebreak.css";
import "./TipTapComponents/styles/mergefields.css";

import { useEditor, EditorContent } from "@tiptap/vue-3";

import { EditorView } from "prosemirror-view";
import Toolbar from "./TipTapComponents/Toolbar.vue";

// default nodes
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Image } from "@tiptap/extension-image";
import { Document } from "@tiptap/extension-document";
import { FontFamily } from "@tiptap/extension-font-family";
import { Text } from "@tiptap/extension-text";
import { Heading } from "@tiptap/extension-heading";
import { Paragraph } from "@tiptap/extension-paragraph";
import { LineHeight } from "./TipTapComponents/extensions/LineHeightExtension";
import { Indentation } from "./TipTapComponents/extensions/IndentionExtension";
import { Blockquote } from "@tiptap/extension-blockquote";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { HardBreak } from "@tiptap/extension-hard-break";
import { ListItem } from "@tiptap/extension-list-item";
// default marks
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Strike } from "@tiptap/extension-strike";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
// default extensions
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { History } from "@tiptap/extension-history";
// custom extensions
import { FontSizeExtension } from "./TipTapComponents/extensions/FontSizeExtension";
import { OrderedListExtension } from "./TipTapComponents/extensions/Lists/OrderedListExtension";
import { BulletListExtension } from "./TipTapComponents/extensions/Lists/BulletListExtension";
import { CustomLinkExtension } from "./TipTapComponents/extensions/LinkExtension";
import { DirectionWrapperExtension } from "./TipTapComponents/extensions/DirectionExtension";
import { CustomTableExtension } from "./TipTapComponents/extensions/CustomTableExtension";
import { ColorExtensionExtension } from "./TipTapComponents/extensions/ColorExtensionExtension";
import { HighlightExtension } from "./TipTapComponents/extensions/HighlightExtension";
import { FullscreenExtension } from "./TipTapComponents/extensions/FullscreenExtension";
import { PreviewExtension } from "./TipTapComponents/extensions/PreviewExtension";
import { PrintExtension } from "./TipTapComponents/extensions/PrintExtension";
import { PageBreakExtension } from "./TipTapComponents/extensions/PageBreakExtension";
import { AnchorExtension } from "./TipTapComponents/extensions/AnchorExtension";
import { TextAlignExtension } from "./TipTapComponents/extensions/AlignmentExtension";
import { LinkAnchorExtension } from "./TipTapComponents/extensions/LinkAnchorExtension";
import { MergeFieldsExtension } from "./TipTapComponents/extensions/MergeFieldsExtension";
import { ListItemExtension } from "./TipTapComponents/extensions/Lists/ListItemExtension";
import { CharacterCountExtension } from "./TipTapComponents/extensions/CharacterCountExtension";
import { useMergeFields } from "./TipTapComponents/components/MergeFields/useMergeFields";
import {
  CustomFloatingToolboxPlugin,
  FloatingToolboxPlugin,
} from "./TipTapComponents/extensions/FloatingToolBoxExtension";

// initializing lowlight
const lowlight = createLowlight(all);

// you can also register languages
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const editor = useEditor({
  enableContentCheck: true,
  onContentError({ editor, error, disableCollaboration }) {
    console.log("content error:", error, editor);
  },
  onCreate({ editor }) {
    console.log("Editor content:", editor.getJSON());
  },
  editorProps: {
    attributes: {
      class: "tiptap-editor-inside",
    },
  },
  extensions: [
    // Text,
    // ListItemExtension,
    // Document,
    // DirectionWrapperExtension,
    // TextAlign.configure({ types: ["heading", "paragraph"] }),
    // custom extensions
    TextAlignExtension,
    LinkAnchorExtension,
    AnchorExtension,
    PrintExtension,
    PreviewExtension,
    FullscreenExtension,
    HighlightExtension,
    ColorExtensionExtension,
    DirectionWrapperExtension,
    OrderedListExtension,
    BulletListExtension,
    FontSizeExtension,
    CustomLinkExtension,
    MergeFieldsExtension,
    PageBreakExtension,
    CustomTableExtension.configure({ resizable: true }),
    CustomFloatingToolboxPlugin,
    // ResizableTableCell,
    // ListItemExtension,
    // CharacterCountExtension,
    // default extensions
    Indentation.configure({
      types: ["paragraph", "heading"], // apply to paragraphs and headings
      step: 2, // 2em per indent step
      maxIndent: 10, // max 10em indent
    }),
    LineHeight.configure({ types: ["paragraph", "heading"] }),
    Image,
    // Table,
    TableHeader,
    TableRow,
    TableCell,
    FontFamily,
    Italic,
    Strike,
    CodeBlockLowlight.configure({ lowlight }), // use this instead of default
    Underline,
    Dropcursor,
    Gapcursor,
    History,
    TextStyle,
    Blockquote,
    Bold,
    Document,
    Heading,
    Paragraph,
    Text,
    // BulletList, // customized
    HardBreak,
    HorizontalRule, // customized
    ListItem, // customized
    // OrderedList, // customized
  ],
});

const mergeFields = useMergeFields(editor);

onMounted(() => {
  if (editor.value) {
    editor.value.setOptions({
      editorProps: {
        handleDOMEvents: {
          keyup: (view, event) => {
            mergeFields.handleKeyUp(view, event);
          },
        },
      },
    });
  }
});
</script>

<template>
  <div v-if="editor" class="tiptap-editor">
    <Toolbar :editor="editor" :mergeFields="mergeFields" />
    <editor-content :editor="editor" />
  </div>
</template>

<style lang="scss">
.tiptap-editor-inside {
  @apply prose prose-sm sm:prose lg:prose-lg xl:prose-2xl;
  @apply focus:outline-none;
  @apply w-full max-w-full;
  @apply rounded mx-auto h-96 overflow-y-auto;
}

.tiptap-editor {
  & * {
    font-family: "yekan", ".AppleSystemUIFont", sans-serif;
  }

  @apply p-4 border border-gray-200 border-solid rounded-md shadow-sm;

  &.normal-mode {
    @apply block;
  }

  &.fullscreen-mode {
    @apply fixed top-0 right-0 w-full h-full bg-white z-50 overflow-auto;
  }
}
</style>
