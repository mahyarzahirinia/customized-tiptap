<script lang="ts" setup="">
import { defineProps, ref } from "vue";
import type { Editor } from "@tiptap/core";
import { LineHeight } from "../extensions/LineHeightExtension"; // import custom extension if needed

const props = defineProps<{ editor: Editor }>();

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
</script>

<template>
  <v-tooltip location="bottom" text="ارتفاع خط">
    <template v-slot:activator="{ props }">
      <v-select
        v-model="selectedLineHeight"
        :items="lineHeights"
        class="lh-select"
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
.lh-select {
  position: relative;
  right: 1.25rem;
  margin-left: 1rem;
}

:deep(.v-field__append-inner) {
  transform: translateX(0.875rem);
}

:deep(.v-input__prepend) {
  position: relative;
  left: 0.375rem;
  margin-left: 1rem;
}
</style>
