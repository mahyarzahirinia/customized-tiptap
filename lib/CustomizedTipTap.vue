<script lang="ts" setup>
import { ref, nextTick, computed } from "vue";
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
import { RowResizeExtension } from "./TipTapComponents/extensions/RowResizeExtension";
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

// initializing lowlight
const lowlight = createLowlight(all);

// you can also register languages
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

// Types ------------------------
type DataType = {
  title: string;
  label: string;
  value: string;
} | null;

const delimiter = "{{";
const showValues = ref(false);
const isDropdownShown = ref(false);
const selectedMergeField = ref();
const mergeFieldQuery = ref();
const isMergeFieldDropdownVisible = ref(false);
const mergeFieldDropdownPosition = ref({ x: 0, y: 0 });
const mergeFields = ref([
  { title: "نام", label: "name", value: "محمد ظهیری نیا", group: "مشخصات" },
  {
    title: "ایمیل",
    label: "email",
    value: "zahiriniamahyar@gmail.com",
    group: "اطلاعات تماس",
  },
  {
    title: "شماره تلفن",
    label: "phone",
    value: "09391398416",
    group: "اطلاعات تماس",
  },
]);

const editor = useEditor({
  enableContentCheck: true,
  onContentError({ editor, error, disableCollaboration }) {
    console.log("content error:", error, editor);
  },
  onCreate({ editor }) {
    console.log("Editor content:", editor.getJSON());
  },
  content: "",
  editorProps: {
    attributes: {
      class: "tiptap-editor-inside",
    },
    handleClick(view, pos, event) {
      // if clicked on the last node was a table create a p tag after it
      const { doc } = view.state;
      const lastNode = doc.content.lastChild;

      if (lastNode?.type.name === "table") {
        view.dispatch(
          view.state.tr.insert(
            doc.content.size,
            view.state.schema.nodes.paragraph.create(),
          ),
        );
        return true;
      }

      return false;
    },
    handleDOMEvents: {
      keyup: (view: EditorView, event: KeyboardEvent) => {
        const cursorPos = view.state.selection.from;
        if (cursorPos < 2) return false;

        // grab 2 last chars
        const textBeforeCursor = view.state.doc.textBetween(
          cursorPos - 2,
          cursorPos,
          "",
        );

        // check for every char when dropdown is open
        if (isMergeFieldDropdownVisible.value) {
          const lastTypedChar = event.key.length === 1 ? event.key : "";
          handleSearchUpdate(lastTypedChar);
        }

        // if {{ show dropdown
        if (textBeforeCursor === delimiter && !isDropdownShown.value) {
          showMergeFieldDropdown(view);
        } else {
          // else close it
          isMergeFieldDropdownVisible.value = false;
          isDropdownShown.value = false;
        }
      },
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
    MergeFieldsExtension.configure({ showValues }),
    PageBreakExtension,
    // RowResizeExtension,
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
    Table.configure({ resizable: true }),
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

const showMergeFieldDropdown = async (view: any) => {
  //show dropdown
  isMergeFieldDropdownVisible.value = true;
  //to remove the value of the searched item before opening up again
  selectedMergeField.value = "";

  //wait for the next tick to be synced and then set the coordinates accordingly
  await nextTick();
  const { from } = view.state.selection;
  const pos = view.coordsAtPos(from);
  mergeFieldDropdownPosition.value = { x: pos.left, y: pos.top + 20 };
};

const insertManually = (selected: DataType) => {
  if (!selected) return;

  editor.value
    ?.chain()
    .focus()
    .insertContent({
      type: "mergeField",
      attrs: {
        label: `${delimiter}${selected.label}}}`,
        title: selected.title,
        value: selected.value,
        showValues,
      },
    })
    .run();
};

const insertMergeField = (selected: DataType) => {
  if (!selected) return;

  editor.value
    ?.chain()
    .focus()
    .deleteRange({
      from: editor.value.state.selection.from - 2,
      to: editor.value.state.selection.from,
    }) // Remove "{{"
    .insertContent({
      type: "mergeField",
      attrs: {
        label: `${delimiter}${selected.label}}}`,
        title: selected.title,
        value: selected.value,
        showValues,
      },
    })
    .run();

  isMergeFieldDropdownVisible.value = false;
};

const filteredMergeFields = computed(() =>
  mergeFields.value.filter((field) =>
    field.title.includes(mergeFieldQuery.value || ""),
  ),
);

// to search
const handleSearchUpdate = (query: string) => {
  mergeFieldQuery.value = query;
  // this logic is to select the first item from the menu if open
  if (filteredMergeFields.value.length > 0) {
    selectedMergeField.value = filteredMergeFields.value[0];
  }
  selectedMergeField.value = null; // clear the selected item
};

// to enter from the list
const handleEnterPress = () => {
  if (selectedMergeField.value) {
    insertMergeField(selectedMergeField.value);
  }
};

const handleClose = () => {
  // a flag to show dropdown has opened
  isDropdownShown.value = true;
  isMergeFieldDropdownVisible.value = false;
  if (editor.value) {
    editor.value.commands.focus();
  }
};
</script>

<template>
  <div v-if="editor" class="tiptap-editor">
    <Toolbar :editor="editor" />

    <div class="merge-field-tool-box">
      <v-autocomplete
        v-model="selectedMergeField"
        :filter="() => true"
        :items="filteredMergeFields"
        :search="mergeFieldQuery"
        class="merge-field-input"
        clear-icon="mdi-close"
        clearable
        density="compact"
        item-title="title"
        item-value="label"
        label="افزودن فیلدها"
        return-object
        variant="plain"
        @update:search="handleSearchUpdate"
        @update:model-value="(obj: any) => insertManually(obj)"
        @keydown.enter="handleEnterPress"
        @keydown.escape="handleClose"
      />
      <v-switch
        v-model="showValues"
        class="c-switch"
        color="primary"
        hide-details
      />
    </div>

    <v-autocomplete
      v-if="isMergeFieldDropdownVisible"
      v-model="selectedMergeField"
      :filter="() => true"
      :items="filteredMergeFields"
      :search="mergeFieldQuery"
      :style="{
        top: `${mergeFieldDropdownPosition.y - 10}px`,
        left: `${mergeFieldDropdownPosition.x - 160}px`,
      }"
      autofocus
      class="m-autocomplete"
      density="compact"
      item-title="title"
      item-value="label"
      label=""
      menu
      return-object
      variant="underlined"
      @update:search="handleSearchUpdate"
      @update:model-value="(obj: any) => insertMergeField(obj)"
      @keydown.enter="handleEnterPress"
      @keydown.escape="handleClose"
      @keydown.delete="() => mergeFieldQuery === '' && handleClose()"
    />

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
.m-autocomplete {
  @apply absolute bg-transparent border rounded shadow p-1 w-[150px];
}

.merge-field-tool-box {
  @apply flex items-center max-w-56 m-2 flex max-h-12;

  .merge-field-input {
    @apply max-h-10;
  }

  .c-switch {
    @apply mx-4;
  }
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
