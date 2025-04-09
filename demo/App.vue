<script setup lang="ts">
import { ref } from "vue";

const mergeFieldsData = ref([
  { title: "نام", label: "name", value: "محمد ظهیری نیا", group: "مشخصات" },
  {
    title: "ایمیل",
    label: "email",
    value: "zahiriniamahyar@gmail.com",
    group: "اطلاعات تماس",
  },
  {
    title: "شماره تلفن",
    label: "phone",
    value: "09391398416",
    group: "اطلاعات تماس",
  },
]);
const content = ref("<p>متن تستی</p>");
</script>

<template>
  <v-app>
    <v-main>
      <div class="middle">
        <v-container fluid>
          <customized-tiptap
            :content="content"
            :merge-fields-data="mergeFieldsData"
          />
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.middle {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
</style>
