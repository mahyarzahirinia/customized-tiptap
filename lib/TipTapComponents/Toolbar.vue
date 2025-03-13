<script lang="ts" setup="">
import { defineProps, reactive, ref } from "vue";
import { type Editor } from "@tiptap/core";
import Table from "./components/Table.vue";
import Button from "./components/Button.vue";
import Heading from "./components/Heading.vue";
import FontSelection from "./components/FontSelection.vue";
import FontSizeSelection from "./components/FontSizeSelection.vue";
import Alignments from "./components/Alignments.vue";
import HeadingButtons from "./components/HeadingButtons.vue";
import OrderedOrderedListComponent from "./components/Lists/OrderedListComponent.vue";
import UnOrderedOrderedListComponent from "./components/Lists/UnOrderedListComponent.vue";
import LinkComponent from "./components/LinkComponent.vue";
import HTMLExportModal from "./modals/HTMLExportModal.vue";
import ColorModal from "./modals/ColorModal.vue";
import GroupButtons from "./components/GroupButtons.vue";
import LineHeight from "./components/LineHeight.vue";
import Indention from "./components/Indention.vue";
import ColorAndHighlight from "./components/ColorAndHighlight.vue";
import SpecialCharacters from "./components/SpecialCharacters.vue";
import Emojis from "./components/Emojis.vue";
import CodeExport from "./components/CodeExport.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Preview from "./components/PreviewComponent.vue";
import AnchorComponent from "./components/AnchorComponent.vue";

const props = defineProps<{ editor: Editor }>();

const showModal = reactive<{
  exportModal: boolean;
  colorModal: boolean;
  showPanel: boolean;
}>({
  exportModal: false,
  colorModal: false,
  showPanel: true,
});
const selectedColor = ref("#000000");

// color -----------------------
const applyColor = () => {
  props.editor.chain().focus().setColor(selectedColor.value).run();
  showModal.colorModal = false;
};

// directions ------------------
const setTextDirection = (direction: "ltr" | "rtl") => {
  props.editor.commands.setDirection(direction);
};
</script>

<template>
  <div class="toolbar">
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
      <Heading :editor="editor" />
      <FontSelection :editor="editor" />
      <FontSizeSelection :editor="editor" />
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
      <Alignments :editor="editor" />
      <OrderedOrderedListComponent :editor="editor" />
      <UnOrderedOrderedListComponent :editor="editor" />
    </div>

    <GroupButtons>
      <LinkComponent :editor="editor" />
      <Table :editor="editor" />
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
          <LineHeight :editor="editor" />
        </GroupButtons>
        <GroupButtons>
          <Indention :editor="editor" />
        </GroupButtons>

        <GroupButtons>
          <ColorAndHighlight :editor="editor" />
        </GroupButtons>

        <GroupButtons>
          <SpecialCharacters :editor="editor" />
          <Emojis :editor="editor" />
        </GroupButtons>

        <GroupButtons>
          <CodeExport :editor="editor" />
          <Fullscreen :editor="editor" />
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
          <Button text="شکست صفحه" @click="editor.commands.insertPageBreak()">
            <v-icon icon="mdi-format-page-break" />
          </Button>
          <AnchorComponent :editor="editor" />
          <!--          <Button text="JSON" @click="">-->
          <!--            <v-icon icon="mdi-code-json" />-->
          <!--          </Button>-->
        </GroupButtons>

        <GroupButtons>
          <Button text="راست به چپ" @click="setTextDirection('rtl')">
            <v-icon icon="mdi-format-pilcrow-arrow-left" />
          </Button>
          <Button text="چپ به راست" @click="setTextDirection('ltr')">
            <v-icon icon="mdi-format-pilcrow-arrow-right" />
          </Button>
        </GroupButtons>
        <!--        -->
        <!--        <Button-->
        <!--          :class="{ 'is-active': props.editor.isActive('paragraph') }"-->
        <!--          @click="props.editor.chain().focus().setParagraph().run()"-->
        <!--        >-->
        <!--          <v-icon icon="mdi-format-paragraph" />-->
        <!--        </Button>-->
        <!--        <HeadingButtons :editor="editor" />-->

        <!--        <Button-->
        <!--          :class="{ 'is-active': editor.isActive('codeBlock') }"-->
        <!--          @click="props.editor.chain().focus().toggleCodeBlock().run()"-->
        <!--        >-->
        <!--          <v-icon icon="mdi-code-braces" />-->
        <!--        </Button>-->
        <!--        <Button-->
        <!--          :class="{ 'is-active': props.editor.isActive('codeBlock') }"-->
        <!--          @click="exportHtml"-->
        <!--        >-->
        <!--          <v-icon icon="mdi-xml" />-->
        <!--        </Button>-->
        <!--        <Button-->
        <!--          :class="{ 'is-active': props.editor.isActive('blockquote') }"-->
        <!--          @click="props.editor.chain().focus().toggleBlockquote().run()"-->
        <!--        >-->
        <!--          <v-icon icon="mdi-format-quote-close" />-->
        <!--        </Button>-->
        <!--        <Button @click="props.editor.chain().focus().setHorizontalRule().run()">-->
        <!--          <v-icon icon="mdi-minus" />-->
        <!--        </Button>-->

        <!--      :class="{-->
        <!--        'is-active': props.editor.isActive('textStyle', { color: '#958DF1' }),-->
        <!--      }"-->
        <!--        <Button @click="showModal.colorModal = true">-->
        <!--          <v-icon icon="mdi-palette" />-->
        <!--        </Button>-->
      </div>
    </v-expand-transition>
  </div>

  <!--  modals-->
  <div>
    <ColorModal
      v-model:selected="selectedColor"
      v-model:showColorModal="showModal.colorModal"
      :applyColor="applyColor"
    />
  </div>
</template>

<style lang="scss">
.toolbar {
  @apply flex gap-4 flex-wrap items-center pb-1;
  @apply w-full;

  .tools-group {
    @apply w-64 flex gap-1;
    @apply p-0.5 border-2 border-solid border-gray-200 rounded-md;
  }
}
</style>
