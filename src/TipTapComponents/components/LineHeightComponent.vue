<script lang="ts" setup="">
import { computed, ref, watch } from "vue";
import type { Editor } from "@tiptap/core";
import { useTiptapI18n } from "../i18n";

const props = defineProps<{ editor: Editor }>();
const { language, t } = useTiptapI18n();

const lineHeightValues = ["1", "1.5", "2", "2.5", "3"];

const formatLineHeight = (value: string) =>
  new Intl.NumberFormat(language.value === "fa" ? "fa-IR" : "en-US", {
    maximumFractionDigits: 1,
    useGrouping: false,
  }).format(Number(value));

const lineHeights = computed(() =>
  lineHeightValues.map((value) => ({
    title: formatLineHeight(value),
    value,
  }))
);

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
        prepend-icon="ct-line-height"
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
  width: 4.25rem;
  min-width: 4.25rem;
}

:deep(.ct-select__control) {
  min-height: 2rem;
  height: 2rem;
  padding: 0 0.35rem;
  gap: 0.2rem;
}

:deep(.v-field) {
  border: none !important;
  background: transparent !important;
}

:deep(.ct-select__input) {
  width: 1.25rem;
  flex: 0 1 1.25rem;
  text-align: center;
  font-size: 0.82rem;
  padding: 0;
}

:deep(.ct-icon) {
  width: 1rem;
  height: 1rem;
}

:deep(.ct-select__menu) {
  min-width: 4.25rem;
}
</style>
