<script lang="ts" setup="">
import { ref, computed, onMounted } from "vue";
import type { Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();

const orderedLists = [
  { title: "", value: "numbered", icon: "mdi-format-list-numbered" },
  { title: "", value: "lower-alpha", icon: "mdi-alphabet-latin" },
  { title: "", value: "lower-greek", icon: "mdi-alphabet-greek" },
  { title: "", value: "lower-roman", icon: "mdi-roman-numeral-4" },
  { title: "", value: "upper-alpha", icon: "mdi-alphabetical-variant" },
];
const selectedOrderedListType = ref<string | undefined>("default");
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

onMounted(() => {
  props.editor.on("transaction", () => {
    const { editor } = props;

    // get current list type from orderedList
    const type = editor.getAttributes("orderedList").typeOfList || "numbered";

    if (selectedOrderedListType.value !== type) {
      selectedOrderedListType.value = type;
    }
  });
});
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
  >
    <template v-slot:selection="{ item }">
      <div class="ol-select-item">
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
.ol-select {
  border-left: 1px solid;
  border-color: rgba(0, 0, 0, 0.12);

  &:deep(.v-field__input),
  &:deep(.v-field__append-inner) {
    padding: unset;
  }

  &:deep(.v-field__append-inner) {
    transform: translate(0.5rem, 0.3rem);
  }

  &:deep(.v-field) {
    border: none !important;
    background: transparent !important;
  }
}

.ol-select-item {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
  transform: translateX(-0.5rem);
}
</style>
