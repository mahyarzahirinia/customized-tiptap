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

<style scoped>
.group-buttons {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}
</style>
