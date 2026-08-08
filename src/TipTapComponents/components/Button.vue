<script lang="ts" setup>
// defineProps is auto-imported in Vue 3 SFC
defineOptions({ inheritAttrs: false });

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
          class="toolbar-button"
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
      class="toolbar-button"
    >
      <slot />
    </v-btn>
  </template>
</template>

<style scoped lang="scss">
.c-tooltip {
  font-family: var(--tiptap-editor-font);
}

.toolbar-button {
  align-items: center;
  font-family: var(--tiptap-editor-font);
  border-radius: 0.375rem !important;
  color: #1f2937 !important;
  min-height: 2rem;
  min-width: 2rem;
  padding: 0.25rem !important;
}

.toolbar-button :deep(.ct-icon) {
  height: 1.15rem;
  width: 1.15rem;
}
</style>
