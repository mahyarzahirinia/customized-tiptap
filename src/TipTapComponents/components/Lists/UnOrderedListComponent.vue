<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import type { Editor } from "@tiptap/core";

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
      .toggleList("bulletList", "listItem")
      .updateAttributes("bulletList", { typeOfList: value })
      .run();
  }
};

onMounted(() => {
  props.editor.on("transaction", () => {
    const { editor } = props;

    // get current list type from bulletList
    const type = editor.getAttributes("bulletList").typeOfList || "disc";

    if (selectedUnorderedListType.value !== type) {
      selectedUnorderedListType.value = type;
    }
  });
});
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
  >
    <template v-slot:selection="{ item }">
      <div class="ul-select-item">
        <v-icon :icon="item.raw.icon"></v-icon>
      </div>
    </template>

    <template v-slot:item="{ item, props }">
      <v-list-item
        v-bind="{ ...props, title: undefined }"
        @click="() => applyAction(item.value)"
      >
        <v-icon :icon="item.raw.icon"></v-icon>
      </v-list-item>
    </template>
  </v-select>
</template>

<style lang="scss" scoped>
.ul-select {
  border-inline-start: 1px solid;
  border-color: rgba(0, 0, 0, 0.12);
  width: 4rem;

  &:deep(.v-field__input),
  &:deep(.v-field__append-inner) {
    padding: unset;
  }

  &:deep(.v-field__append-inner) {
    transform: none;
  }

  &:deep(.v-field) {
    border: none !important;
    background: transparent !important;
  }
}

.ul-select-item {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
}
</style>
