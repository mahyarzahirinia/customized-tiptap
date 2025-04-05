<template>
  <div class="autocomplete">
    <div class="input-container">
      <input
        v-model="mergeFieldQuery"
        type="text"
        placeholder=" "
        class="input"
        @input="
          (event) =>
            handleSearchUpdate((event.target as HTMLInputElement).value)
        "
        @focus="showDropdown = true"
        @blur="handleBlur"
        @keydown.enter="handleEnterPress"
        @keydown.escape="handleClose"
      />
      <label class="label">افزودن فیلدها</label>
    </div>

    <ul
      :class="[
        'dropdown',
        { show: showDropdown && filteredMergeFields.length },
      ]"
    >
      <li
        v-for="(group, category) in groupedMergeFields"
        :key="category"
        class="group"
      >
        {{ category }}
        <ul>
          <li
            v-for="item in group"
            :key="item.label"
            @mousedown.prevent="insertManually(item)"
            class="item"
          >
            {{ item.title }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed, ref } from "vue";
import { type useMergeFields } from "./MergeFields/useMergeFields.js";

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

const emit = defineEmits(["select"]);
const showDropdown = ref(false);

const groupedMergeFields = computed(() => {
  const grouped: Record<string, any[]> = {};
  filteredMergeFields.value.forEach((field) => {
    if (!grouped[field.group]) {
      grouped[field.group] = [];
    }
    grouped[field.group].push(field);
  });
  return grouped;
});

const handleBlur = () => {
  setTimeout(() => (showDropdown.value = false), 200);
};
</script>

<style scoped>
.autocomplete {
  @apply relative w-[300px] text-sm;
}

.input-container {
  @apply relative flex items-center border border-gray-300 rounded-lg bg-white shadow-sm
  transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300;
}

.input {
  @apply w-full py-2 px-3 bg-transparent outline-none text-gray-900 text-base;
}

.label {
  @apply absolute px-1 right-3 top-1/2 transform -translate-y-3/4 bg-white text-gray-500 transition-all
  pointer-events-none;
}

.input:focus ~ .label,
.input:not(:placeholder-shown) ~ .label {
  @apply top-1 text-xs text-blue-600;
}

.dropdown {
  @apply absolute w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto z-10
  shadow-md transition-all duration-300 transform origin-top scale-95 opacity-0 pointer-events-none;
}

.dropdown.show {
  @apply scale-100 opacity-100 pointer-events-auto;
}

.group {
  @apply px-3 py-2 bg-gray-100 font-bold text-gray-600;
}

.item {
  @apply px-3 py-2 cursor-pointer hover:bg-gray-200 transition-all;
}
</style>
