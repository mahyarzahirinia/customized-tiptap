<script lang="ts" setup="">
// defineProps is a compiler macro; no runtime import needed
import { type useMergeFields } from "./useMergeFields";
import { useTiptapI18n } from "../../i18n";

const props = defineProps<{
  mergeFields: ReturnType<typeof useMergeFields>;
  loading?: boolean;
}>();
const { t } = useTiptapI18n();

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
    :loading="loading"
    class="merge-field-input"
    clear-icon="mdi-close"
    clearable
    density="compact"
    item-title="title"
    item-value="value"
    :label="t('addField')"
    return-object
    variant="plain"
    @update:search="handleSearchUpdate"
    @update:model-value="(obj: any) => insertManually(obj)"
    @keydown.enter="handleEnterPress"
    @keydown.escape="handleClose"
  />
</template>
