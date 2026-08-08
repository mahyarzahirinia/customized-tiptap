<script lang="ts" setup></script>

<template>
  <div class="group-buttons">
    <v-btn-group
      density="compact"
      divided
      rounded="lg"
      v-bind="$attrs"
      variant="elevated"
    >
      <slot />
    </v-btn-group>
  </div>
</template>

<style scoped lang="scss">
.group-buttons {
  align-items: center;
  background-color: white;
  border: 1px solid #b3b7b8;
  border-radius: 0.5rem;
  display: flex;
  min-height: 2.3rem;
  overflow: hidden;
}

.group-buttons :deep(.ct-btn-group) {
  min-height: 2.3rem;
}

.group-buttons :deep(.ct-btn) {
  border-radius: 0;
  min-height: 2.25rem;
  min-width: 2.25rem;
}

.group-buttons :deep(.ct-btn + .ct-btn) {
  border-inline-start: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
