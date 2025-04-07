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
