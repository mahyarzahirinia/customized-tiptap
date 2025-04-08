<script lang="ts" setup="">
import { defineProps } from "vue";
import { type useMergeFields } from "./useMergeFields";

const props = defineProps<{
  mergeFields: ReturnType<typeof useMergeFields>;
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
    :style="{
      top: `${mergeFieldDropdownPosition.y - 10}px`,
      left: `${mergeFieldDropdownPosition.x - 160}px`,
    }"
    autofocus
    class="m-autocomplete"
    density="compact"
    item-title="title"
    item-value="label"
    label=""
    menu
    return-object
    variant="underlined"
    @update:search="handleSearchUpdate"
    @update:model-value="(obj: any) => insertMergeField(obj)"
    @keydown.enter="handleEnterPress"
    @keydown.escape="handleClose"
    @keydown.delete="() => mergeFieldQuery === '' && handleClose()"
  />
</template>

<style scoped>
.m-autocomplete {
  position: absolute;
  background-color: transparent;
  border: 1px solid;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 0.25rem;
  width: 150px;
}
</style>
