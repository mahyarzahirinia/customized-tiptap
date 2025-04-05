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
const selectedOrderedListType = ref<string | undefined>("numbered");
const isActive = computed(() => props.editor.isActive("orderedList"));
const isSinked = computed(() => {
  return props.editor.can().sinkListItem("listItem");
});

const applyAction = (value: string) => {
  if (!props.editor) return;

  if (isSinked) {
    props.editor.chain().focus().liftListItem("listItem").run();
  }

  if (value) {
    props.editor
      .chain()
      .focus()
      .sinkListItem("listItem")
      .toggleList("orderedList", "listItem")
      .updateAttributes("orderedList", { typeOfList: value })
      .run();
  }
};

watch(
  () => props.editor.getAttributes("textStyle").fontSize,
  (value) => {
    selectedOrderedListType.value = value;
  },
);
</script>

<template>
  <v-select
    v-model="selectedOrderedListType"
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
        <v-icon
          :icon="item.raw.icon"
          :disabled="item.value === selectedOrderedListType"
        ></v-icon>
      </v-list-item>
    </template>
  </v-select>
</template>

<style lang="scss" scoped>
.ol-select {
  @apply relative bottom-1 left-0;
}
.ol-select-item {
  @apply flex gap-1 items-center justify-center;
}
:deep(.v-field__append-inner) {
  @apply translate-x-[0.5rem];
}
</style>
