<script lang="ts" setup="">
import { defineProps, ref } from "vue";
import type { Editor } from "@tiptap/core";
import { LineHeight } from "../extensions/LineHeightExtension"; // import custom extension if needed

const props = defineProps<{ editor: Editor }>();

// line height options
const lineHeights = [
  { title: "1", value: "1" },
  { title: "1.5", value: "1.5" },
  { title: "2", value: "2" },
  { title: "2.5", value: "2.5" },
  { title: "3", value: "3" },
];

const selectedLineHeight = ref<string | undefined>("1");

const applyLineHeight = (value: string) => {
  if (!props.editor) return;

  props.editor.chain().focus().setLineHeight(value).run();
};
</script>

<template>
  <v-tooltip location="bottom" text="ارتفاع خط">
    <template v-slot:activator="{ props }">
      <v-select
        v-model="selectedLineHeight"
        :items="lineHeights"
        class="relative right-5"
        density="compact"
        hide-details
        item-value="value"
        menu-icon="mdi-chevron-down"
        prepend-icon="mdi-format-line-height"
        v-bind="props"
        variant="plain"
        @update:modelValue="applyLineHeight"
      />
    </template>
  </v-tooltip>
</template>

<style scoped>
:deep(.v-field__append-inner) {
  @apply translate-x-[14px];
}

:deep(.v-input__prepend) {
}
</style>
