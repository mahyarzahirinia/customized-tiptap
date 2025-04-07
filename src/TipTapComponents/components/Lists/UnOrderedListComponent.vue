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

const selectedUnorderedListType = ref<string | undefined>("disc");

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
    v-model="selectedUnorderedListType"
    :items="unorderedLists"
    class="ul-select"
    density="compact"
    hide-details
    item-value="value"
    label=""
    menu-icon="mdi-chevron-down"
    variant="plain"
    @update:modelValue="applyAction"
  >
    <template v-slot:selection="{ item }">
      <div class="ul-select-item">
        <v-icon :icon="item.raw.icon"></v-icon>
      </div>
    </template>

    <template v-slot:item="{ item, props }">
      <v-list-item v-bind="{ ...props, title: undefined }">
        <v-icon
          :icon="item.raw.icon"
          :disabled="item.value === selectedUnorderedListType"
        ></v-icon>
      </v-list-item>
    </template>
  </v-select>
</template>

<style lang="scss" scoped>
.ul-select {
  position: relative;
  bottom: 0.25rem;
  left: 0;
}
.ul-select-item {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
}
:deep(.v-field__append-inner) {
  transform: translateX(0.5rem);
}
</style>
