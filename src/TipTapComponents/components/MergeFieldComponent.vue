<template>
  <NodeViewWrapper
    as="span"
    class="merge-field"
    @click="isShowValue = !isShowValue"
  >
    {{
      isShowValue || props?.node?.attrs?.showValues
        ? props?.node?.attrs?.value
        : props?.node?.attrs?.label
    }}
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent } from "@tiptap/vue-3";
import { computed, ref, defineComponent } from "vue";
import type { NodeViewProps } from "@tiptap/vue-3";

const isShowValue = ref(false);
const props = defineProps<NodeViewProps>();
</script>

<style scoped></style>
