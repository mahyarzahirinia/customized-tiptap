<script setup lang="ts">
import { type useMergeFields } from "./MergeFields/useMergeFields";

/* ========================= options ========================= */
defineOptions({ name: "MergeFieldsBasicAutocompleteComponent" });

/* ========================= props & emits ========================= */
const props = defineProps<{
  mergeFields: ReturnType<typeof useMergeFields>;
  loading?: boolean;
}>();

/* ========================= merge fields ========================= */
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
  <div class="flex items-center gap-3">
    <v-autocomplete
      v-model="selectedMergeField"
      :filter="() => true"
      :items="filteredMergeFields"
      :search="mergeFieldQuery"
      :loading="loading"
      autocomplete="off"
      class="merge-field-input flex-1 min-w-[140px] w-[200px] rounded-lg"
      clear-icon="mdi-close"
      clearable
      density="compact"
      item-title="title"
      item-value="value"
      label="افزودن فیلدها"
      return-object
      variant="outlined"
      rounded="lg"
      hide-details
      @update:search="handleSearchUpdate"
      @update:model-value="(obj: any) => insertManually(obj)"
      @keydown.enter="handleEnterPress"
      @keydown.escape="handleClose"
    />

    <div class="flex items-center gap-2 shrink-0 text-sm text-gray-700">
      <span>نمایش مقادیر</span>
      <v-switch
        v-model="showValues"
        color="primary"
        density="compact"
        hide-details
        class="shrink-0"
      />
    </div>
  </div>
</template>

<style scoped>
.merge-field-input {
  --v-input-control-height: 36px;
}

:deep(.merge-field-input .v-field) {
  height: 36px;
  min-height: 36px;
  border-radius: 0.5rem;
}

:deep(.merge-field-input .v-field__input) {
  min-height: 36px;
  height: 36px;
}
</style>
