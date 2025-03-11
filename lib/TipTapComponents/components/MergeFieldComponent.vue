<template>
  <NodeViewWrapper
    as="span"
    class="merge-field"
    @click="isShowValue = !isShowValue"
  >
    {{
      isShowValue || props.node.attrs.showValues
        ? props.node.attrs.value
        : props.node.attrs.label
    }}
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent } from "@tiptap/vue-3";
import { computed, ref } from "vue";

const isShowValue = ref(false);
const props = defineProps();
</script>

<style scoped>
.merge-field {
  @apply bg-[#e0e7ff];
  @apply text-[#1e3a8a];
  @apply mx-1 px-2 py-1 leading-tight;
  @apply font-bold;
  @apply cursor-pointer;
}
</style>
