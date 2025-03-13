<script lang="ts" setup="">
import { defineProps, ref, computed } from "vue";
import type { Editor } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/vue-3";

const props = defineProps<{ editor: Editor }>();

const orderedLists = [
  { title: "", value: "numbered", icon: "mdi-format-list-numbered" },
  { title: "", value: "lower-alpha", icon: "mdi-alphabet-latin" },
  { title: "", value: "lower-greek", icon: "mdi-alphabet-greek" },
  { title: "", value: "lower-roman", icon: "mdi-roman-numeral-4" },
  { title: "", value: "upper-alpha", icon: "mdi-alphabetical-variant" },
];
const selectedAction = ref<string | undefined>("numbered");

const isActionActive = (value: string) => {
  if (!props.editor) return false;
  return props.editor.isActive(
    value === "ordered" ? "orderedList" : "listItem",
  );
};

// const isActionDisabled = (value: string) => {
//   if (!props.editor) return true;
//   switch (value) {
//     case "split":
//       return !props.editor.can().splitListItem("listItem");
//     case "indent-increase":
//       return !props.editor.can().sinkListItem("listItem");
//     case "indent-decrease":
//       return !props.editor.can().liftListItem("listItem");
//     default:
//       return false;
//   }
// };

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

//
// :class="{
// 'is-active': isActionActive(item.raw.value),
//     'is-disabled': isActionDisabled(item.raw.value),
// }"
// :disabled="isActionDisabled(item.raw.value)"
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
