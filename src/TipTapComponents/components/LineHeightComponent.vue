<script lang="ts" setup="">
import { onMounted, ref, watch } from "vue";
import type { Editor } from "@tiptap/core";
import { LineHeight } from "../extensions/LineHeightExtension"; // import custom extension if needed
import { useTiptapI18n } from "../i18n";

const props = defineProps<{ editor: Editor }>();
const { t } = useTiptapI18n();

// line height options
const lineHeights = [
  { title: "۱", value: "1" },
  { title: "۱.۵", value: "1.5" },
  { title: "۲", value: "2" },
  { title: "۲.۵", value: "2.5" },
  { title: "۳", value: "3" },
];

const selectedLineHeight = ref<string | undefined>("1");

const applyLineHeight = (value: string) => {
  if (!props.editor) return;

  props.editor.chain().focus().setLineHeight(value).run();
};

watch(
  () => props.editor?.state?.selection, // watch selection changes
  () => {
    if (!props.editor) return;

    const editor = props.editor;

    // check if heading is active, else assume paragraph
    const activeType = editor.isActive("heading") ? "heading" : "paragraph";

    const { lineHeight } = editor.getAttributes(activeType);

    const value = lineHeight || "1";

    if (selectedLineHeight.value !== value) {
      selectedLineHeight.value = value;
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <v-tooltip location="bottom" :text="t('lineHeight')">
    <template v-slot:activator="{ props }">
      <v-select
        v-model="selectedLineHeight"
        :items="lineHeights"
        class="lh-select"
        density="compact"
        hide-details
        item-value="value"
        item-title="title"
        menu-icon="mdi-chevron-down"
        prepend-icon="mdi-format-line-height"
        v-bind="props"
        variant="plain"
        @update:modelValue="applyLineHeight"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item class="list-item" v-bind="{ ...props, title: undefined }"
            >{{ item.title }}
          </v-list-item>
        </template>
      </v-select>
    </template>
  </v-tooltip>
</template>

<style scoped lang="scss">
.list-item {
  font-family: var(--tiptap-editor-font);
}

.lh-select {
  position: relative;
  right: 1.25rem;
  margin-left: 1.5rem;
}

:deep(.v-field__append-inner) {
  transform: translateX(0.75rem);
}

:deep(.v-field) {
  border: none !important;
  background: transparent !important;
}

:deep(.v-input__prepend) {
  font-size: 0.9rem;
  transform: translate(0rem, 0.05rem);
  margin-left: 0.5rem;
}
</style>
