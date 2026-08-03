<script lang="ts" setup>
import Button from "./Button.vue";
// defineProps is a compiler macro; no runtime import needed
import { Editor } from "@tiptap/core";

const props = defineProps<{ editor: Editor }>();

const toggleCodeBlock = () => {
  props.editor.chain().focus().toggleCodeBlock().run();
};
</script>

<template>
  <Button
    :class="{ 'code-tool--active': props.editor.isActive('codeBlock') }"
    text="کد"
    @click="toggleCodeBlock"
  >
    <span class="code-tool" aria-hidden="true">
      <span class="code-tool__brace">{</span>
      <span class="code-tool__line code-tool__line--long" />
      <span class="code-tool__line" />
      <span class="code-tool__brace">}</span>
    </span>
  </Button>
</template>

<style scoped>
.code-tool {
  align-items: center;
  color: #111827;
  display: inline-grid;
  grid-template-columns: auto 0.65rem auto;
  grid-template-rows: repeat(2, 0.25rem);
  height: 1.25rem;
  justify-content: center;
  width: 1.25rem;
}

.code-tool__brace {
  align-self: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9rem;
  font-weight: 800;
  grid-row: 1 / 3;
  line-height: 1;
}

.code-tool__line {
  align-self: center;
  background: currentColor;
  border-radius: 999px;
  display: inline-flex;
  height: 0.12rem;
  justify-self: center;
  opacity: 0.75;
  width: 0.45rem;
}

.code-tool__line--long {
  width: 0.65rem;
}

:deep(.code-tool--active) {
  background: #eff6ff;
  color: #1d4ed8;
}
</style>
