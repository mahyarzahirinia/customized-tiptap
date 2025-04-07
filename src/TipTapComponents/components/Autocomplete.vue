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
