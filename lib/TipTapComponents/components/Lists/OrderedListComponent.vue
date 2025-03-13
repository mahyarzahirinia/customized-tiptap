<script lang="ts" setup="">
import { defineProps, ref, computed, watch } from "vue";
import type { Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();

const orderedLists = [
  { title: "", value: "numbered", icon: "mdi-format-list-numbered" },
  { title: "", value: "lower-alpha", icon: "mdi-alphabet-latin" },
  { title: "", value: "lower-greek", icon: "mdi-alphabet-greek" },
  { title: "", value: "lower-roman", icon: "mdi-roman-numeral-4" },
  { title: "", value: "upper-alpha", icon: "mdi-alphabetical-variant" },
];
const selectedAction = ref<string | undefined>("numbered");

const applyAction = (value: string) => {
  if (!props.editor) return;
  if (value) {
    props.editor
      .chain()
      .focus()
      .toggleList("orderedList", "listItem")
      .updateAttributes("orderedList", { typeOfList: value })
      .run();
  }
};

watch(
  () => props.editor.getAttributes("textStyle").fontSize,
  (value) => {
    selectedFontSize.value = value;
  },
);
</script>

<template>
  <v-select
    v-model="selectedAction"
    :items="orderedLists"
    class="ol-select"
    density="compact"
    hide-details
    item-value="value"
    label=""
    menu-icon="mdi-chevron-down"
    variant="plain"
    @update:modelValue="applyAction"
  >
    <template v-slot:selection="{ item }">
      <div class="ol-select-item">
        <v-icon :icon="item.raw.icon"></v-icon>
      </div>
    </template>

    <template v-slot:item="{ item, props }">
      <v-list-item v-bind="{ ...props, title: undefined }">
        <v-icon :icon="item.raw.icon"></v-icon>
      </v-list-item>
    </template>
  </v-select>
</template>

<style lang="scss" scoped>
.ol-select {
  @apply relative bottom-1;
}
.ol-select-item {
  @apply flex gap-1 items-center justify-center;
}
:deep(.v-field__append-inner) {
  @apply translate-x-[14px];
}
</style>
