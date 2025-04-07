<script lang="ts" setup="">
import { defineProps, ref, watch } from "vue";
import type { Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();

const fontSizes = ref([
  { size: "8pt", label: "۸" },
  { size: "9pt", label: "۹" },
  { size: "10pt", label: "۱۰" },
  { size: "11pt", label: "۱۱" },
  { size: "12pt", label: "۱۲" },
  { size: "14pt", label: "۱۴" },
  { size: "16pt", label: "۱۶" },
  { size: "18pt", label: "۱۸" },
  { size: "20pt", label: "۲۰" },
  { size: "22pt", label: "۲۲" },
  { size: "24pt", label: "۲۴" },
  { size: "26pt", label: "۲۶" },
  { size: "28pt", label: "۲۸" },
  { size: "36pt", label: "۳۶" },
  { size: "48pt", label: "۴۸" },
  { size: "72pt", label: "۷۲" },
]);

const selectedFontSize = ref<string | undefined>();

const applyFontSize = (value: string) => {
  props.editor.chain().focus().setFontSize(value).run();
};

watch(
  () => props.editor.getAttributes("textStyle").fontSize,
  (value) => {
    selectedFontSize.value = value;
  },
);
</script>

<template>
  <div class="font-size-container">
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
      ><template v-slot:item="{ props, item }">
        <v-list-item
          v-bind="{ ...props, title: undefined }"
          :disabled="item.value === selectedFontSize"
          >{{ item.title }}
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>
