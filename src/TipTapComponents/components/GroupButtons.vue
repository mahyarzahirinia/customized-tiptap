<script lang="ts" setup></script>

<template>
  <div class="flex items-center border border-solid border-gray-200 rounded-lg">
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

<style scoped></style>
