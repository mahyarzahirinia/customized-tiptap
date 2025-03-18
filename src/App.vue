<script setup lang="ts">
import CustomizedTipTap from "../lib/CustomizedTipTap.vue";
</script>

<template>
  <v-locale-provider rtl>
    <v-app>
      <v-main>
        <div class="middle">
          <v-container fluid>
            <CustomizedTipTap />
          </v-container>
        </div>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

<style scoped>
.middle {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
</style>
