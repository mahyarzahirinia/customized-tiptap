<script lang="ts" setup="">
import { defineProps, reactive, ref, defineAsyncComponent } from "vue";
import { type Editor } from "@tiptap/core";

import TableComponent from "./components/TableComponent.vue";
import Button from "./components/Button.vue";
import HeadingComponent from "./components/HeadingComponent.vue";
import FontSelectionComponent from "./components/FontSelectionComponent.vue";
import FontSizeSelectionComponent from "./components/FontSizeSelectionComponent.vue";
import AlignmentsComponent from "./components/AlignmentsComponent.vue";
import OrderedOrderedListComponent from "./components/Lists/OrderedListComponent.vue";
import UnOrderedOrderedListComponent from "./components/Lists/UnOrderedListComponent.vue";
import LinkComponentComponent from "./components/LinkComponentComponent.vue";
import GroupButtons from "./components/GroupButtons.vue";
// import MergeFieldsToolbarSearch from "./components/MergeFields/MergeFieldsToolbarSearch.vue";
// import HeadingButtonsComponent from "./components/HeadingButtonsComponent.vue";

const LineHeightComponent = defineAsyncComponent(
  () => import("./components/LineHeightComponent.vue"),
);
const IndentionComponent = defineAsyncComponent(
  () => import("./components/IndentionComponent.vue"),
);
const CodeBlockComponent = defineAsyncComponent(
  () => import("./components/CodeBlockComponent.vue"),
);
const ColorAndHighlightComponent = defineAsyncComponent(
  () => import("./components/ColorAndHighlightComponent.vue"),
);
const EmojisComponent = defineAsyncComponent(
  () => import("./components/EmojisComponent.vue"),
);
const SpecialCharactersComponent = defineAsyncComponent(
  () => import("./components/SpecialCharactersComponent.vue"),
);
const CodeExportComponent = defineAsyncComponent(
  () => import("./components/CodeExportComponent.vue"),
);
const FullscreenComponent = defineAsyncComponent(
  () => import("./components/FullscreenComponent.vue"),
);
const Preview = defineAsyncComponent(
  () => import("./components/PreviewComponent.vue"),
);
const PageBreakComponent = defineAsyncComponent(
  () => import("./components/PageBreakComponent.vue"),
);
const AnchorComponent = defineAsyncComponent(
  () => import("./components/AnchorComponent.vue"),
);
const DirectionComponent = defineAsyncComponent(
  () => import("./components/DirectionComponent.vue"),
);
const MergeFieldsHiddenInlineSearch = defineAsyncComponent(
  () => import("./components/MergeFields/MergeFieldsHiddenInlineSearch.vue"),
);
const Autocomplete = defineAsyncComponent(
  () => import("./components/Autocomplete.vue"),
);

import { type useMergeFields } from "./components/MergeFields/useMergeFields";
import { type Module } from "./config";

const props = defineProps<{
  editor: Editor;
  mergeFields: ReturnType<typeof useMergeFields>;
  extensions: Module;
}>();

const extensionNames = new Set(props.extensions.map((ext) => ext.name));

function hasExtension(name: string): boolean {
  return extensionNames.has(name);
}

const showModal = reactive<{
  exportModal: boolean;
  showPanel: boolean;
}>({
  exportModal: false,
  showPanel: false,
});

const { showValues } = props.mergeFields;
</script>

<template>
  <div class="toolbar-container toolbar">
    <GroupButtons>
      <Button
        :disabled="!props.editor.can().chain().focus().undo().run()"
        text="بازگشت"
        @click="props.editor.chain().focus().undo().run()"
      >
        <v-icon icon="mdi-undo-variant" />
      </Button>
      <Button
        :disabled="!props.editor.can().chain().focus().redo().run()"
        text="پیش‌روی"
        @click="props.editor.chain().focus().redo().run()"
      >
        <v-icon icon="mdi-redo-variant" />
      </Button>
    </GroupButtons>

    <GroupButtons>
      <Button
        text="شکستن خط"
        @click="props.editor.chain().focus().setHardBreak().run()"
      >
        <v-icon icon="mdi-keyboard-return" />
      </Button>
      <Button
        text="پاک کردن صفحه"
        @click="props.editor.chain().focus().clearContent().run()"
      >
        <v-icon icon="mdi-backspace" />
      </Button>
    </GroupButtons>

    <div class="tools-group">
      <HeadingComponent :editor="editor" />
      <FontSelectionComponent :editor="editor" />
      <FontSizeSelectionComponent :editor="editor" />
    </div>

    <GroupButtons>
      <Button
        v-if="hasExtension('bold')"
        :class="{ 'is-active': props.editor.isActive('bold') }"
        :disabled="!props.editor.can().chain().focus().toggleBold().run()"
        text="بولد"
        @click="props.editor.chain().focus().toggleBold().run()"
      >
        <v-icon icon="mdi-format-bold" />
      </Button>
      <Button
        v-if="hasExtension('italic')"
        :class="{ 'is-active': props.editor.isActive('italic') }"
        :disabled="!props.editor.can().chain().focus().toggleItalic().run()"
        text="ایتالیک"
        @click="props.editor.chain().focus().toggleItalic().run()"
      >
        <v-icon icon="mdi-format-italic" />
      </Button>
      <Button
        v-if="hasExtension('underline')"
        :class="{ 'is-active': props.editor.isActive('underline') }"
        :disabled="!props.editor.can().chain().focus().toggleUnderline().run()"
        text="زیرخط‌دار"
        @click="props.editor.chain().focus().toggleUnderline().run()"
      >
        <v-icon icon="mdi-format-underline" />
      </Button>

      <Button
        v-if="hasExtension('strike')"
        :class="{ 'is-active': props.editor.isActive('strike') }"
        :disabled="!props.editor.can().chain().focus().toggleStrike().run()"
        text="خط‌خورده"
        @click="props.editor.chain().focus().toggleStrike().run()"
      >
        <v-icon icon="mdi-format-strikethrough-variant" />
      </Button>
    </GroupButtons>

    <div class="tools-group">
      <AlignmentsComponent :editor="editor" v-if="hasExtension('textAlign')" />
      <OrderedOrderedListComponent
        :editor="editor"
        v-if="hasExtension('orderedList')"
      />
      <UnOrderedOrderedListComponent
        :editor="editor"
        v-if="hasExtension('bulletList')"
      />
    </div>

    <GroupButtons>
      <LinkComponentComponent :editor="editor" v-if="hasExtension('link')" />
      <TableComponent :editor="editor" v-if="hasExtension('table')" />
    </GroupButtons>

    <!-- toggle transition -->
    <GroupButtons>
      <Button text="بیشتر" @click="showModal.showPanel = !showModal.showPanel">
        <v-icon icon="mdi-dots-horizontal" />
      </Button>
    </GroupButtons>

    <!-- transition section -->
    <v-expand-transition>
      <div v-if="showModal.showPanel" class="toolbar">
        <GroupButtons v-if="hasExtension('lineHeight')">
          <LineHeightComponent :editor="editor" />
        </GroupButtons>
        <GroupButtons v-if="hasExtension('indentation')">
          <IndentionComponent :editor="editor" />
        </GroupButtons>

        <GroupButtons>
          <CodeBlockComponent
            :editor="editor"
            v-if="hasExtension('codeBlock')"
          />
          <ColorAndHighlightComponent
            :editor="editor"
            v-if="hasExtension('color')"
          />
        </GroupButtons>

        <GroupButtons>
          <SpecialCharactersComponent :editor="editor" />
          <EmojisComponent :editor="editor" />
        </GroupButtons>

        <GroupButtons>
          <CodeExportComponent :editor="editor" />
          <FullscreenComponent
            :editor="editor"
            v-if="hasExtension('fullscreen')"
          />
          <Preview :editor="editor" v-if="hasExtension('lineHeight')" />
        </GroupButtons>

        <GroupButtons>
          <Button disabled text="ذخیره" @click="">
            <v-icon icon="mdi-content-save-outline" />
          </Button>
          <Button
            text="چاپ"
            @click="editor.commands.print()"
            v-if="hasExtension('print')"
          >
            <v-icon icon="mdi-printer" />
          </Button>
        </GroupButtons>

        <GroupButtons>
          <PageBreakComponent
            :editor="editor"
            v-if="hasExtension('pageBreak')"
          />
          <AnchorComponent :editor="editor" v-if="hasExtension('linkAnchor')" />
        </GroupButtons>

        <GroupButtons>
          <DirectionComponent
            :editor="editor"
            v-if="hasExtension('directionWrapper')"
          />
        </GroupButtons>

        <!--        <MergeFieldsToolbarSearch-->
        <!--          :editor="editor"-->
        <!--          :mergeFields="props.mergeFields"-->
        <!--        />-->
        <MergeFieldsHiddenInlineSearch
          :editor="editor"
          :mergeFields="props.mergeFields"
          v-if="hasExtension('mergeFields')"
        />

        <div class="merge-field-tool-box" v-if="hasExtension('mergeFields')">
          <Autocomplete :editor="editor" :mergeFields="props.mergeFields" />
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<style lang="scss" scoped>
.toolbar-container {
  border-radius: 0.5rem;
}

.toolbar {
  display: flex; /* flex */
  gap: 0.5rem; /* gap-4 */
  flex-wrap: wrap; /* flex-wrap */
  align-items: center; /* items-center */
  width: 100%; /* w-full */

  .tools-group {
    width: 15rem; /* w-60 */
    display: flex; /* flex */
    gap: 0.25rem; /* gap-1 */
    padding: 0.125rem; /* p-0.5 */
    border: 1px solid #b3b7b8; /* border + border-gray-200 */
    border-radius: 0.375rem; /* rounded-md */
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    background-color: white;
  }
}

.merge-field-tool-box {
  display: flex; /* flex */
  align-items: center; /* items-center */
  margin-left: 0.5rem; /* mx-2 => both left and right */
  margin-right: 0.5rem;
  max-height: 2rem; /* max-h-12 */

  .merge-field-input {
    max-height: 2rem; /* max-h-10 */
  }
}
</style>
