<script setup lang="ts">
import { type useMergeFields } from "./MergeFields/useMergeFields";
import { useTiptapI18n } from "../i18n";

/* ========================= options ========================= */
defineOptions({ name: "MergeFieldsBasicAutocompleteComponent" });

/* ========================= props & emits ========================= */
const props = defineProps<{
  mergeFields: ReturnType<typeof useMergeFields>;
  loading?: boolean;
}>();
const { t } = useTiptapI18n();

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
  <div class="merge-fields-basic">
    <v-autocomplete
      v-model="selectedMergeField"
      :filter="() => true"
      :items="filteredMergeFields"
      :search="mergeFieldQuery"
      :loading="loading"
      autocomplete="off"
      class="merge-field-input"
      clear-icon="mdi-close"
      clearable
      density="compact"
      item-title="title"
      item-value="value"
      :label="t('addField')"
      return-object
      variant="outlined"
      rounded="lg"
      hide-details
      @update:search="handleSearchUpdate"
      @update:model-value="(obj: any) => insertManually(obj)"
      @keydown.enter="handleEnterPress"
      @keydown.escape="handleClose"
    />

    <div class="merge-fields-basic__values">
      <span>{{ t("mergeFieldsValues") }}</span>
      <v-switch
        v-model="showValues"
        color="primary"
        density="compact"
        hide-details
        class="merge-fields-basic__switch"
      />
    </div>
  </div>
</template>

<style scoped>
.merge-fields-basic {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.merge-field-input {
  --v-input-control-height: 36px;
  flex: 1 1 auto;
  width: 200px;
  min-width: 140px;
  border-radius: 0.5rem;
}

.merge-fields-basic__values {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
}

.merge-fields-basic__switch {
  flex: 0 0 auto;
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
