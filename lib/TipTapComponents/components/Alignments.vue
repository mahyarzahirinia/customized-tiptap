<script lang="ts" setup="">
import { defineProps, ref } from "vue";
import type { Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();

const textAlignments = [
  { title: "چپ چین", value: "left", icon: "mdi-format-align-left" },
  { title: "وسط چین", value: "center", icon: "mdi-format-align-center" },
  { title: "راست چین", value: "right", icon: "mdi-format-align-right" },
  { title: "خود چین", value: "justify", icon: "mdi-format-align-justify" },
];

const selectedAlignment = ref<string | undefined>("right");

const applyAlignment = (value: string) => {
  if (!props.editor) return;

  props.editor.chain().focus().setTextAlign(value).run();
};
</script>

<template>
  <v-select
    v-model="selectedAlignment"
    :items="textAlignments"
    class="relative bottom-1 right-1"
    density="compact"
    hide-details
    item-value="value"
    menu-icon="mdi-chevron-down"
    variant="plain"
    @update:modelValue="applyAlignment"
  >
    <template v-slot:selection="{ item }">
      <div class="flex gap-1 items-center justify-center">
        <v-icon :icon="item.raw.icon"></v-icon>
      </div>
    </template>

    <!-- Dropdown list icon display -->
    <template v-slot:item="{ item, props }">
      <v-list-item v-bind="{ ...props, title: undefined }">
        <v-icon :icon="item.raw.icon"></v-icon>
      </v-list-item>
    </template>
  </v-select>
</template>

<style scoped>
:deep(.v-field__append-inner) {
  @apply translate-x-[14px];
}
</style>
