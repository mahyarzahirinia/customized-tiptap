import { ref } from "vue";

const isVisible = ref(false);
const message = ref("");
const color = ref("primary");
const timeout = ref(1500);

export function useNotifier() {
  const notify = (
    msg: string,
    options: { color?: string; timeout?: number } = {},
  ) => {
    message.value = msg;
    color.value = options.color || "primary";
    timeout.value = options.timeout || 3000;
    isVisible.value = false; // reset in case it's already showing
    requestAnimationFrame(() => {
      isVisible.value = true;
    });
  };

  return {
    isVisible,
    message,
    color,
    timeout,
    notify,
  };
}
