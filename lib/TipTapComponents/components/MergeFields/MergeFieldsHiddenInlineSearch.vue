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
  @apply absolute bg-transparent border rounded shadow p-1 w-[150px];
}
</style>
