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
    class="merge-field-chip"
    contenteditable="false"
    :data-merge-field="true"
    :data-title="props.node.attrs.title"
    :data-value="props.node.attrs.value"
    :data-name="props.node.attrs.name"
    :data-show-values="props.node.attrs.showValues"
  >
    <span class="merge-field-chip__label" @click.stop="toggleShowValues">
      {{
        props?.node?.attrs?.showValues
          ? props?.node?.attrs?.value
          : props?.node?.attrs?.title
      }}
    </span>

    <button
      type="button"
      class="merge-field-chip__remove"
      @click.stop="removeMergeField"
    >
      ×
    </button>
  </NodeViewWrapper>
</template>

<style scoped>
.merge-field-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #93c5fd;
  border-radius: 999px;
  background: #dbeafe;
  color: #1e40af;
  font-size: 0.75rem;
  user-select: none;
}

.merge-field-chip__label {
  cursor: pointer;
}

.merge-field-chip__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: #bfdbfe;
  color: #1e40af;
  cursor: pointer;
  line-height: 1;
}

.merge-field-chip__remove:hover {
  background: #93c5fd;
}

.merge-field-chip__remove:focus {
  outline: none;
}
</style>
