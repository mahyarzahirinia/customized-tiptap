<script lang="ts" setup="">
import { defineProps, ref } from "vue";
import type { Editor } from "@tiptap/core";
import Button from "../components/Button.vue";

const props = defineProps<{ editor: Editor }>();

const fontSizes = ref([
  { size: "8px", label: "۸" },
  { size: "9px", label: "۹" },
  { size: "10px", label: "۱۰" },
  { size: "11px", label: "۱۱" },
  { size: "12px", label: "۱۲" },
  { size: "14px", label: "۱۴" },
  { size: "16px", label: "۱۶" },
  { size: "18px", label: "۱۸" },
  { size: "20px", label: "۲۰" },
  { size: "22px", label: "۲۲" },
  { size: "24px", label: "۲۴" },
  { size: "26px", label: "۲۶" },
  { size: "28px", label: "۲۸" },
  { size: "36px", label: "۳۶" },
  { size: "48px", label: "۴۸" },
  { size: "72px", label: "۷۲" },
]);

const selectedFontSize = ref<string | undefined>("16px");

const applyFontSize = (value: string) => {
  props.editor.chain().focus().setFontSize(value).run();
};
</script>

<template>
  <div class="flex items-center">
    <v-autocomplete
      v-model="selectedFontSize"
      :item-title="'label'"
      :item-value="'size'"
      :items="fontSizes"
      :label="!selectedFontSize ? 'اندازه' : ''"
      class="font-size-box"
      density="compact"
      hide-details
      menu-icon=""
      variant="plain"
      @update:model-value="applyFontSize"
    />
  </div>
</template>

<style scoped>
.font-size-box {
  @apply w-16 relative bottom-1;
}
</style>
