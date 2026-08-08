<script lang="ts" setup="">
import { type useMergeFields } from "./useMergeFields";

const props = defineProps<{
  mergeFields: ReturnType<typeof useMergeFields>;
  loading?: boolean;
}>();

const {
  selectedMergeField,
  filteredMergeFields,
  mergeFieldQuery,
  handleSearchUpdate,
  handleEnterPress,
  handleClose,
  isMergeFieldDropdownVisible,
  mergeFieldDropdownPosition,
  insertMergeField,
} = props.mergeFields;
</script>

<template>
  <v-autocomplete
    v-if="isMergeFieldDropdownVisible"
    v-model="selectedMergeField"
    :filter="() => true"
    :items="filteredMergeFields"
    :search="mergeFieldQuery"
    :loading="loading"
    :style="{
      top: `${mergeFieldDropdownPosition.y - 25}px`,
      left: `${mergeFieldDropdownPosition.x - 160}px`,
    }"
    autofocus
    class="m-autocomplete"
    density="compact"
    item-title="title"
    item-value="value"
    label=""
    menu
    :menu-props="{ contentClass: 'merge-field-inline-menu' }"
    return-object
    variant="underlined"
    hide-details
    @update:search="handleSearchUpdate"
    @update:model-value="(obj: any) => insertMergeField(obj)"
    @keydown.enter="handleEnterPress"
    @keydown.escape="handleClose"
    @keydown.delete="() => mergeFieldQuery === '' && handleClose()"
  />
</template>

<style scoped lang="scss">
.m-autocomplete {
  position: absolute;
  background-color: transparent;
  border: 1px solid gray;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 0.25rem;
  width: 150px;
  z-index: 9999999999;
  font-family: var(--tiptap-editor-ui-font);
}

.m-autocomplete :deep(.v-field),
.m-autocomplete :deep(.v-field__input),
.m-autocomplete :deep(.v-label),
.m-autocomplete :deep(input) {
  font-family: var(--tiptap-editor-ui-font);
}

:global(.merge-field-inline-menu),
:global(.merge-field-inline-menu .v-list),
:global(.merge-field-inline-menu .v-list-item),
:global(.merge-field-inline-menu .v-list-item-title) {
  font-family: var(--tiptap-editor-ui-font);
}
</style>
