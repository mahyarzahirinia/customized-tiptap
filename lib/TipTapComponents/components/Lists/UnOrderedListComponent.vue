<script lang="ts" setup>
import { defineProps, ref } from "vue";
import type { Editor } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/vue-3";

const props = defineProps<{ editor: Editor }>();

// 🟢 unordered list options
const unorderedLists = [
  { title: "", value: "disc", icon: "mdi-format-list-bulleted" },
  { title: "", value: "circle", icon: "mdi-circle-medium" },
  { title: "", value: "square", icon: "mdi-square-medium" },
];

const selectedAction = ref<string | undefined>("disc");

const isActionActive = (value: string) => {
  if (!props.editor) return false;
  return props.editor.isActive("bulletList");
};

const applyAction = (value: string) => {
  if (!props.editor) return;
  if (value) {
    props.editor
      .chain()
      .focus()
      .toggleList("bulletList", "listItem")
      .updateAttributes("bulletList", { typeOfList: value })
      .run();
  }
};
</script>

<template>
  <v-select
    v-model="selectedAction"
    :items="unorderedLists"
    class="relative bottom-1"
    density="compact"
    hide-details
    item-value="value"
    label=""
    menu-icon="mdi-chevron-down"
    variant="plain"
    @update:modelValue="applyAction"
  >
    <template v-slot:selection="{ item }">
      <div class="flex gap-1 items-center justify-center">
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
:deep(.v-field__append-inner) {
  @apply translate-x-[14px];
}
</style>
