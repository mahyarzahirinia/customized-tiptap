<script lang="ts" setup>
import { ref, nextTick, computed } from "vue";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from "lowlight";

import {
  type EditorOptions,
  Editor,
  useEditor,
  EditorContent,
} from "@tiptap/vue-3";

import { EditorView } from "prosemirror-view";
import StarterKit from "@tiptap/starter-kit";
import MergeField from "./TipTapComponents/extensions/MergeFields";
import Toolbar from "./TipTapComponents/Toolbar.vue";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
// import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Document } from "@tiptap/extension-document";
import { FontFamily } from "@tiptap/extension-font-family";
// import { CustomTextBlock } from "./TipTapComponents/extensions/CustomHeadings";
import { FontSize } from "./TipTapComponents/extensions/FontSize";
import { OrderedList } from "./TipTapComponents/extensions/Lists/OrderedList";
import { BulletList } from "./TipTapComponents/extensions/Lists/BulletList";
import LinkComponent from "./TipTapComponents/components/LinkComponent.vue";
import { CustomLink } from "./TipTapComponents/extensions/Link";
import { ListItem } from "./TipTapComponents/extensions/Lists/ListItem";
import { Text } from "@tiptap/extension-text";
import { Heading } from "@tiptap/extension-heading";
import { Paragraph } from "@tiptap/extension-paragraph";
import RowResizeExtension from "./TipTapComponents/extensions/RowResizeExtension";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { DirectionWrapperExtension } from "./TipTapComponents/extensions/Direction";
import { LineHeight } from "./TipTapComponents/extensions/LineHeightExtension";
import { Indentation } from "./TipTapComponents/extensions/IndentionExtension";
import { ColorExtension } from "./TipTapComponents/extensions/ColorExtension";
import { HighlightExtension } from "./TipTapComponents/extensions/HighlightExtension";
import { Fullscreen } from "./TipTapComponents/extensions/Fullscreen";
import { PreviewExtension } from "./TipTapComponents/extensions/Preview";
import { PrintExtension } from "./TipTapComponents/extensions/Print";
import { PageBreak } from "./TipTapComponents/extensions/PageBreak";
import { Anchor } from "./TipTapComponents/extensions/Anchor";
import { ExtendedTextAlign } from "./TipTapComponents/extensions/AlignmentExtension";
import { LinkAnchor } from "./TipTapComponents/extensions/LinkAnchor";

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
      class: "inside-editor",
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
    // Color.configure({ types: [TextStyle.name, ListItem.name] }),
    // TextStyle.configure({ types: [ListItem.name] }),

    // we need to add prose utility class from tailwind typography to customize
    // our own tags p, h1 through h6
    // Text,
    // Paragraph,
    // ListItem,
    // Document,
    // DirectionWrapperExtension,
    // CodeBlockLowlight.configure({ lowlight }),
    ExtendedTextAlign,
    LinkAnchor,
    Anchor,
    PageBreak,
    PrintExtension,
    PreviewExtension,
    Fullscreen,
    HighlightExtension,
    ColorExtension,
    DirectionWrapperExtension,
    Indentation.configure({
      types: ["paragraph", "heading"], // apply to paragraphs and headings
      step: 2, // 2em per indent step
      maxIndent: 10, // max 10em indent
    }),
    LineHeight.configure({ types: ["paragraph", "heading"] }),
    // Color,
    OrderedList,
    BulletList,
    FontSize,
    TextStyle,
    Heading,
    Paragraph,
    // TextAlign.configure({ types: ["heading", "paragraph"] }),
    Image,
    Table.configure({ resizable: true }),
    TableHeader.extend({
      content: "text*",
    }),
    TableRow,
    TableCell.extend({
      content: "text*",
    }),
    RowResizeExtension, // extension
    // ResizableTableCell,
    CustomLink,
    Underline,
    FontFamily,
    StarterKit.configure({
      // paragraph: false,
      // heading: false,
      bulletList: false,
      orderedList: false,
    }),
    MergeField.configure({ showValues }),
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
        class="merge-field"
        clear-icon="mdi-close"
        clearable
        density="compact"
        item-title="title"
        item-value="label"
        label="افزودن فیلدها"
        return-object
        variant="underlined"
        @update:search="handleSearchUpdate"
        @update:model-value="(obj: any) => insertManually(obj)"
        @keydown.enter="handleEnterPress"
        @keydown.escape="handleClose"
      />

      <v-switch
        v-model="showValues"
        append-icon="mdi-information-outline"
        class="c-switch"
        color="primary"
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
  </div>

  <editor-content :editor="editor" />
</template>

<style lang="scss">
.inside-editor {
  @apply prose prose-sm sm:prose lg:prose-lg xl:prose-2xl;
  @apply focus:outline-none;
  @apply w-full max-w-full;
  @apply rounded p-4 mx-auto max-h-60 h-60 overflow-y-auto;
}
.m-autocomplete {
  @apply absolute bg-transparent border rounded shadow p-1 w-[150px];
}

.merge-field-tool-box {
  @apply mt-2 flex gap-4;

  .merge-field {
    @apply max-w-36 max-h-16;
  }

  .c-switch {
    @apply ml-4;
  }
}

.tiptap-editor {
  font-family: "yekan", "Roboto", sans-serif;

  &.normal-mode {
    @apply block;
  }

  &.fullscreen-mode {
    @apply fixed w-[100vw] h-[100vh] bg-white z-[5000] p-1 overflow-y-auto;
  }
}
</style>
