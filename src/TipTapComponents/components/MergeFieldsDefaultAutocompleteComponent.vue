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
  <div class="relative w-[300px] text-sm">
    <div
      class="relative flex h-[36px] items-center rounded-lg border border-gray-300 bg-white px-2 shadow-sm transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
    >
      <input
        v-model="mergeFieldQuery"
        type="text"
        placeholder=" "
        class="peer w-full bg-transparent px-2 py-2 text-base text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-gray-400"
        @input="
          handleSearchUpdate(($event.target as HTMLInputElement).value ?? '')
        "
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleEnter"
        @keydown.escape="handleEscape"
      />
      <label
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded px-1 text-gray-500 transition-all duration-200 bg-white peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base"
      >
        {{ t("addField") }}
      </label>
      <div class="flex items-center px-2">
        <v-switch
          v-model="showValues"
          class="ml-4"
          color="primary"
          density="compact"
          hide-details
        />
      </div>
    </div>

    <ul
      v-if="showDropdown"
      class="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-md"
    >
      <li v-if="isLoading" class="px-3 py-2">
        <v-progress-linear color="primary" height="3" indeterminate />
      </li>
      <li
        v-else
        v-for="group in groupedMergeFields"
        :key="group.category"
        class="bg-gray-100 px-3 py-2 font-semibold text-gray-600"
      >
        {{ group.category }}
        <ul>
          <li
            v-for="item in group.items"
            :key="item?.value"
            class="cursor-pointer px-3 py-2 text-gray-700 transition-colors duration-150 hover:bg-gray-200"
            @mousedown.prevent="handleSelect(item)"
          >
            {{ item?.title }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
