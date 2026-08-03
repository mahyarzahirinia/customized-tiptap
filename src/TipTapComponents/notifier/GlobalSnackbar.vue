<script setup>
import { useNotifier } from "./useNotifier";

const { isVisible, message, color, timeout } = useNotifier();
</script>

<template>
  <v-snackbar v-model="isVisible" :timeout="timeout" :color="color">
    {{ message }}
    <template #actions>
      <v-btn text @click="isVisible = false">
        <v-icon icon="mdi-close" />
      </v-btn>
    </template>
  </v-snackbar>
</template>
