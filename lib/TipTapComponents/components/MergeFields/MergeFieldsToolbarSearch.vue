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
  <div class="merge-field-tool-box">
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
    <v-switch
      v-model="showValues"
      class="c-switch"
      color="primary"
      hide-details
    />
  </div>
</template>

<style scoped>
.merge-field-tool-box {
  @apply flex items-center w-56 m-2 flex max-h-12;

  .merge-field-input {
    @apply max-h-10;
  }

  .c-switch {
    @apply mx-4;
  }
}
</style>
