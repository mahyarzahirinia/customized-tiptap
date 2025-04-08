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
  background-color: white;
  display: flex;
  align-items: center;
  border: 1px solid #b3b7b8;
  border-radius: 0.5rem;
}
</style>
