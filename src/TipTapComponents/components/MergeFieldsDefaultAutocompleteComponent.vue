<script setup lang="ts">
import { computed, reactive } from "vue";
import {
  type MergeFieldType,
  type useMergeFields,
} from "./MergeFields/useMergeFields";
import { useTiptapI18n } from "../i18n";

/* ========================= options ========================= */
defineOptions({ name: "MergeFieldsDefaultAutocompleteComponent" });

/* ========================= props & emits ========================= */
const props = defineProps<{
  mergeFields: ReturnType<typeof useMergeFields>;
  loading?: boolean;
}>();
const { t } = useTiptapI18n();

/* ========================= state ========================= */
const state = reactive({ showDropdown: false });

/* ========================= merge fields ========================= */
const {
  mergeFieldQuery,
  handleSearchUpdate,
  handleEnterPress,
  handleClose,
  insertManually,
  showValues,
} = props.mergeFields;

const groupedMergeFields = computed(() => {
  const groupMap: Record<string, MergeFieldType[]> = {};
  const fields = Array.isArray(props.mergeFields.filteredMergeFields)
    ? props.mergeFields.filteredMergeFields
    : props.mergeFields.filteredMergeFields?.value || [];

  fields.forEach((field: MergeFieldType) => {
    if (!field || !field.group) return;
    if (!groupMap[field.group]) {
      groupMap[field.group] = [];
    }
    groupMap[field.group].push(field);
  });

  return Object.entries(groupMap).map(([category, items]) => ({
    category,
    items,
  }));
});

const isLoading = computed(() => props.loading ?? false);

const showDropdown = computed(
  () =>
    state.showDropdown &&
    (groupedMergeFields.value.length > 0 || isLoading.value)
);

/* ========================= handlers ========================= */
const hideDropdown = () => {
  state.showDropdown = false;
};

const handleBlur = () => {
  setTimeout(() => {
    hideDropdown();
  }, 200);
};

const handleFocus = () => {
  state.showDropdown = true;
};

const handleEnter = () => {
  handleEnterPress();
  hideDropdown();
};

const handleEscape = () => {
  hideDropdown();
  handleClose();
};

const handleSelect = (item: MergeFieldType) => {
  insertManually(item);
  hideDropdown();
};
</script>

<template>
  <div class="merge-field-default">
    <div class="merge-field-default__control">
      <input
        v-model="mergeFieldQuery"
        type="text"
        placeholder=" "
        class="merge-field-default__input"
        @input="
          handleSearchUpdate(($event.target as HTMLInputElement).value ?? '')
        "
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleEnter"
        @keydown.escape="handleEscape"
      />
      <label class="merge-field-default__label">
        {{ t("addField") }}
      </label>
      <div class="merge-field-default__switch">
        <v-switch
          v-model="showValues"
          color="primary"
          density="compact"
          hide-details
        />
      </div>
    </div>

    <ul
      v-if="showDropdown"
      class="merge-field-default__dropdown"
    >
      <li v-if="isLoading" class="merge-field-default__loading">
        <v-progress-linear color="primary" height="3" indeterminate />
      </li>
      <li
        v-else
        v-for="group in groupedMergeFields"
        :key="group.category"
        class="merge-field-default__group"
      >
        {{ group.category }}
        <ul>
          <li
            v-for="item in group.items"
            :key="item?.value"
            class="merge-field-default__item"
            @mousedown.prevent="handleSelect(item)"
          >
            {{ item?.title }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.merge-field-default {
  position: relative;
  width: 300px;
  font-size: 0.875rem;
  font-family: var(--tiptap-editor-font);
}

.merge-field-default__control {
  position: relative;
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.merge-field-default__control:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.merge-field-default__input {
  width: 100%;
  min-width: 0;
  padding: 0.5rem;
  border: 0;
  outline: 0;
  background: transparent;
  color: #111827;
  font: inherit;
  font-size: 1rem;
}

.merge-field-default__input:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.merge-field-default__label {
  position: absolute;
  top: 50%;
  inset-inline-start: 0.75rem;
  padding: 0 0.25rem;
  border-radius: 0.15rem;
  background: #fff;
  color: #6b7280;
  pointer-events: none;
  transform: translateY(-50%);
  transition:
    color 0.2s ease,
    font-size 0.2s ease,
    top 0.2s ease,
    transform 0.2s ease;
}

.merge-field-default__input:focus + .merge-field-default__label,
.merge-field-default__input:not(:placeholder-shown) + .merge-field-default__label {
  top: -0.5rem;
  color: #2563eb;
  font-size: 0.75rem;
  transform: none;
}

.merge-field-default__switch {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
}

.merge-field-default__dropdown {
  position: absolute;
  z-index: 10;
  width: 100%;
  max-height: 12rem;
  margin: 0.25rem 0 0;
  padding: 0;
  overflow-y: auto;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 4px 6px rgba(15, 23, 42, 0.12);
  list-style: none;
}

.merge-field-default__loading,
.merge-field-default__group {
  padding: 0.5rem 0.75rem;
}

.merge-field-default__group {
  background: #f3f4f6;
  color: #4b5563;
  font-weight: 700;
}

.merge-field-default__group ul {
  margin: 0.5rem -0.75rem -0.5rem;
  padding: 0;
  list-style: none;
}

.merge-field-default__item {
  padding: 0.5rem 0.75rem;
  color: #374151;
  cursor: pointer;
  font-weight: 400;
  transition: background-color 0.15s ease;
}

.merge-field-default__item:hover {
  background: #e5e7eb;
}
</style>
