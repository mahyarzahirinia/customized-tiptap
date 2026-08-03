<template>
  <div class="autocomplete">
    <div class="input-container">
      <input
        v-model="handlers.mergeFieldQuery"
        type="text"
        placeholder=" "
        class="input"
        @input="
          handlers.handleSearchUpdate(($event.target as HTMLInputElement).value)
        "
        @focus="showDropdown.value = true"
        @blur="handleBlur"
        @keydown.enter="handlers.handleEnterPress"
        @keydown.escape="handlers.handleClose"
      />
      <label class="label">{{ t("addField") }}</label>

      <div class="c-switch-wrapper">
        <v-switch
          v-model="handlers.showValues"
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
        { show: showDropdown.value && handlers.filteredMergeFields.length },
      ]"
    >
      <li
        v-for="group in groupedMergeFields"
        :key="group.category"
        class="group"
      >
        {{ group.category }}
        <ul>
          <li
            v-for="item in group.items"
            :key="item.value"
            @mousedown.prevent="handlers.insertManually(item)"
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
import { computed } from "vue";
import { useTiptapI18n } from "../i18n";

const props = defineProps<{
  mergeFields: {
    type: string;
    items: Array<{ title: string; value: string; group: string }>;
  };
  handlers: {
    selectedMergeField: any;
    filteredMergeFields: any;
    mergeFieldQuery: any;
    handleSearchUpdate: (query: string) => void;
    handleEnterPress: () => void;
    handleClose: () => void;
    insertManually: (item: any) => void;
    showValues: any;
  };
  loading?: boolean;
}>();
const { t } = useTiptapI18n();

const showDropdown = {
  value: false,
};

const groupedMergeFields = computed(() => {
  const groupMap: Record<string, any[]> = {};

  // Support both ref/computed and plain array
  const fields = Array.isArray(props.handlers.filteredMergeFields)
    ? props.handlers.filteredMergeFields
    : props.handlers.filteredMergeFields?.value || [];
  fields.forEach((field: any) => {
    if (!field?.group) return;
    if (!groupMap[field.group]) {
      groupMap[field.group] = [];
    }
    groupMap[field.group].push(field);
  });
  // Convert the object to an array of { category, items }
  const converted = Object.entries(groupMap).map(([category, items]) => ({
    category,
    items,
  }));
  return converted;
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
  //margin-right: 1.5rem;
}
</style>
