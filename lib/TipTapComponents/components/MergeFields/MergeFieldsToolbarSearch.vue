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
  insertManually,
  showValues,
} = props.mergeFields;
</script>

<template>
  <v-autocomplete
    v-model="selectedMergeField"
    :filter="() => true"
    :items="filteredMergeFields"
    :search="mergeFieldQuery"
    class="merge-field-input"
    clear-icon="mdi-close"
    clearable
    density="compact"
    item-title="title"
    item-value="label"
    label="افزودن فیلدها"
    return-object
    variant="plain"
    @update:search="handleSearchUpdate"
    @update:model-value="(obj: any) => insertManually(obj)"
    @keydown.enter="handleEnterPress"
    @keydown.escape="handleClose"
  />
</template>

<style scoped></style>
