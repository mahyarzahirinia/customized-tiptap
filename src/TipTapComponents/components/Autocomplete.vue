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

      <div class="c-switch-wrapper">
        <v-switch
          v-model="showValues"
          class="c-switch"
          color="primary"
          density="compact"
          hide-details
        />
      </div>
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
    if (!field?.group) return; // Skip if group is nullish

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

<style scoped lang="scss">
.autocomplete {
  position: relative;
  width: 300px;
  font-size: 0.875rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  height: var(--v-btn-height, 36px);

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #93c5fd;
  }
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: transparent;
  outline: none;
  color: #111827;
  font-size: 1rem;
}

.label {
  position: absolute;
  padding: 0 0.25rem;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-75%);
  background-color: white;
  color: #6b7280;
  transition: all 0.2s;
  pointer-events: none;
  border-radius: 0.15rem;
}

.input:focus ~ .label,
.input:not(:placeholder-shown) ~ .label {
  top: 0.25rem;
  font-size: 0.75rem;
  color: #2563eb;
}

.dropdown {
  position: absolute;
  width: 100%;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  max-height: 12rem;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  transform-origin: top;
  transform: scale(0.95);
  opacity: 0;
  pointer-events: none;
}

.dropdown.show {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}

.group {
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  font-weight: bolder;
  color: #4b5563;
}

.item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: lighter;

  &:hover {
    background-color: #e5e7eb;
  }
}

.c-switch-wrapper {
  /*transform: translateY(-0.5rem);*/
  /*transform: rotateZ(-90deg);*/
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c-switch {
  /*height: 2.5rem;*/
  margin-left: 1.5rem; /* mx-4 => both left and right */
  margin-right: 1.5rem;
}
</style>
