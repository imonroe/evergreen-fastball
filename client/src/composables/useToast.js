import { ref } from 'vue';

const message = ref('');
const visible = ref(false);
let timer = null;

export function useToast() {
  function show(msg) {
    message.value = msg;
    visible.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => { visible.value = false; }, 2500);
  }
  return { message, visible, show };
}
