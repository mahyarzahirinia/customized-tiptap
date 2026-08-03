<script setup lang="ts">
import { NodeViewWrapper } from "@tiptap/vue-3";
import type { NodeViewProps } from "@tiptap/vue-3";

defineOptions({ name: "MergeFieldComponent" });

/* ========================= props ========================= */
const props = defineProps<NodeViewProps>();

/* ========================= methods ========================= */
function toggleShowValues() {
  if (props.node.attrs.showValues !== !props.node.attrs.showValues) {
    props.updateAttributes({
      showValues: !props.node.attrs.showValues,
    });
  }
}

function removeMergeField() {
  // deleteNode is provided by VueNodeViewRenderer
  props.deleteNode?.();
}
</script>

<template>
  <NodeViewWrapper
    as="span"
    class="inline-flex items-center rounded-full bg-blue-100 text-blue-800 border border-blue-300 px-2 py-1 text-xs gap-2 select-none"
    contenteditable="false"
    :data-merge-field="true"
    :data-title="props.node.attrs.title"
    :data-value="props.node.attrs.value"
    :data-name="props.node.attrs.name"
    :data-show-values="props.node.attrs.showValues"
  >
    <span class="cursor-pointer" @click.stop="toggleShowValues">
      {{
        props?.node?.attrs?.showValues
          ? props?.node?.attrs?.value
          : props?.node?.attrs?.title
      }}
    </span>

    <button
      type="button"
      class="h-4 w-4 flex items-center justify-center rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 focus:outline-none"
      @click.stop="removeMergeField"
    >
      ×
    </button>
  </NodeViewWrapper>
</template>
