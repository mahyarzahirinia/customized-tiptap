<script lang="ts" setup="">
import { defineProps, reactive, ref } from "vue";
import { type Editor } from "@tiptap/core";
import TableComponent from "./components/TableComponent.vue";
import Button from "./components/Button.vue";
import HeadingComponent from "./components/HeadingComponent.vue";
import FontSelectionComponent from "./components/FontSelectionComponent.vue";
import FontSizeSelectionComponent from "./components/FontSizeSelectionComponent.vue";
import AlignmentsComponent from "./components/AlignmentsComponent.vue";
import HeadingButtonsComponent from "./components/HeadingButtonsComponent.vue";
import OrderedOrderedListComponent from "./components/Lists/OrderedListComponent.vue";
import UnOrderedOrderedListComponent from "./components/Lists/UnOrderedListComponent.vue";
import LinkComponentComponent from "./components/LinkComponentComponent.vue";
import HTMLExportModal from "./modals/HTMLExportModal.vue";
// import ColorModal from "./modals/ColorModal.vue";
import GroupButtons from "./components/GroupButtons.vue";
import LineHeightComponent from "./components/LineHeightComponent.vue";
import IndentionComponent from "./components/IndentionComponent.vue";
import ColorAndHighlightComponent from "./components/ColorAndHighlightComponent.vue";
import SpecialCharactersComponent from "./components/SpecialCharactersComponent.vue";
import EmojisComponent from "./components/EmojisComponent.vue";
import CodeExportComponent from "./components/CodeExportComponent.vue";
import FullscreenComponent from "./components/FullscreenComponent.vue";
import Preview from "./components/PreviewComponent.vue";
import AnchorComponent from "./components/AnchorComponent.vue";
import DirectionComponent from "./components/DirectionComponent.vue";
import PageBreakComponent from "./components/PageBreakComponent.vue";
import CodeBlockComponent from "./components/CodeBlockComponent.vue";

const props = defineProps<{ editor: Editor }>();

const showModal = reactive<{
  exportModal: boolean;
  showPanel: boolean;
}>({
  exportModal: false,
  showPanel: true,
});
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
        :class="{ 'is-active': props.editor.isActive('bold') }"
        :disabled="!props.editor.can().chain().focus().toggleBold().run()"
        text="بولد"
        @click="props.editor.chain().focus().toggleBold().run()"
      >
        <v-icon icon="mdi-format-bold" />
      </Button>
      <Button
        :class="{ 'is-active': props.editor.isActive('italic') }"
        :disabled="!props.editor.can().chain().focus().toggleItalic().run()"
        text="ایتالیک"
        @click="props.editor.chain().focus().toggleItalic().run()"
      >
        <v-icon icon="mdi-format-italic" />
      </Button>
      <Button
        :class="{ 'is-active': props.editor.isActive('underline') }"
        :disabled="!props.editor.can().chain().focus().toggleUnderline().run()"
        text="زیرخط‌دار"
        @click="props.editor.chain().focus().toggleUnderline().run()"
      >
        <v-icon icon="mdi-format-underline" />
      </Button>

      <Button
        :class="{ 'is-active': props.editor.isActive('strike') }"
        :disabled="!props.editor.can().chain().focus().toggleStrike().run()"
        text="خط‌خورده"
        @click="props.editor.chain().focus().toggleStrike().run()"
      >
        <v-icon icon="mdi-format-strikethrough-variant" />
      </Button>
    </GroupButtons>

    <div class="tools-group">
      <AlignmentsComponent :editor="editor" />
      <OrderedOrderedListComponent :editor="editor" />
      <UnOrderedOrderedListComponent :editor="editor" />
    </div>

    <GroupButtons>
      <LinkComponentComponent :editor="editor" />
      <TableComponent :editor="editor" />
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
        <GroupButtons>
          <LineHeightComponent :editor="editor" />
        </GroupButtons>
        <GroupButtons>
          <IndentionComponent :editor="editor" />
        </GroupButtons>

        <GroupButtons>
          <CodeBlockComponent :editor="editor" />
          <ColorAndHighlightComponent :editor="editor" />
        </GroupButtons>

        <GroupButtons>
          <SpecialCharactersComponent :editor="editor" />
          <EmojisComponent :editor="editor" />
        </GroupButtons>

        <GroupButtons>
          <CodeExportComponent :editor="editor" />
          <FullscreenComponent :editor="editor" />
          <Preview :editor="editor" />
        </GroupButtons>

        <GroupButtons>
          <Button disabled text="ذخیره" @click="">
            <v-icon icon="mdi-content-save-outline" />
          </Button>
          <Button text="چاپ" @click="editor.commands.print()">
            <v-icon icon="mdi-printer" />
          </Button>
        </GroupButtons>

        <GroupButtons>
          <PageBreakComponent :editor="editor" />
          <AnchorComponent :editor="editor" />
          <!--          <Button text="JSON" @click="">-->
          <!--            <v-icon icon="mdi-code-json" />-->
          <!--          </Button>-->
        </GroupButtons>

        <GroupButtons>
          <DirectionComponent :editor="editor" />
        </GroupButtons>
      </div>
    </v-expand-transition>
  </div>
</template>

<style lang="scss" scoped>
.toolbar-container {
  @apply m-2;
}
.toolbar {
  @apply flex gap-4 flex-wrap items-center pb-1;
  @apply w-full;

  .tools-group {
    @apply w-60 flex gap-1;
    @apply p-0.5 border border-solid border-gray-200 rounded-md;
  }
}
</style>
