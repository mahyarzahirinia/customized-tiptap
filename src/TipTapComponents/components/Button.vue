<script lang="ts" setup>
import { defineProps } from "vue";

defineProps<{
  text?: string;
  ripple?: boolean;
  size?: "x-small" | "small" | "default" | "large" | "x-large";
}>();
</script>

<template>
  <template v-if="text">
    <v-tooltip :text="text" location="bottom" class="c-tooltip">
      <template v-slot:activator="{ props }">
        <v-btn
          :ripple="ripple ?? false"
          :size="size ?? 'default'"
          density="compact"
          v-bind="{ ...$attrs, ...props }"
          variant="text"
          class="v-btn"
        >
          <slot />
        </v-btn>
      </template>
    </v-tooltip>
  </template>
  <template v-else>
    <v-btn
      :ripple="ripple ?? false"
      :size="size ?? 'default'"
      density="compact"
      v-bind="$attrs"
      variant="text"
    >
      <slot />
    </v-btn>
  </template>
</template>

<style scoped lang="scss">
.c-tooltip {
  font-family: var(--tiptap-editor-font);
}

.v-btn {
  font-family: var(--tiptap-editor-font);
  border-radius: 0 !important;
  color: #1f2937 !important;
  padding: 0 !important;
}
</style>
