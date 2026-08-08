<script setup lang="ts">
import { computed } from "vue";
import { getIconPath } from "./index";

const props = defineProps<{
  icon?: string;
  size?: string | number;
}>();

const path = computed(() => getIconPath(props.icon));
const headerLevel = computed(() =>
  props.icon?.startsWith("mdi-format-header-")
    ? props.icon.replace("mdi-format-header-", "")
    : ""
);
</script>

<template>
  <span class="ct-icon" aria-hidden="true">
    <svg
      v-if="path"
      :width="size ?? 18"
      :height="size ?? 18"
      viewBox="0 0 24 24"
      focusable="false"
    >
      <path :d="path" fill="currentColor" />
    </svg>
    <span v-else-if="headerLevel" class="ct-icon__text">H{{ headerLevel }}</span>
    <span v-else class="ct-icon__text">?</span>
  </span>
</template>

<style scoped>
.ct-icon {
  align-items: center;
  color: currentColor;
  display: inline-flex;
  flex: 0 0 auto;
  height: 1.15rem;
  justify-content: center;
  line-height: 1;
  vertical-align: middle;
  width: 1.15rem;
}

.ct-icon svg {
  display: block;
  max-height: 100%;
  max-width: 100%;
}

.ct-icon__text {
  font-size: 0.75rem;
  font-weight: 700;
}
</style>
