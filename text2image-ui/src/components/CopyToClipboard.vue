<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFileClipboard } from '@fortawesome/free-regular-svg-icons';

const prop = defineProps({
  content: {
    type: String,
    required: true,
    default: ''
  }
});

const isCopied = ref(false);

const writeClipboardText = async (text, event) => {
  try {
    await navigator.clipboard.writeText(text);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 1000);
  } catch (error) {
    console.error(error.message);
  }
}
</script>

<template>
  <a class="tag is-light" v-if="!isCopied">
    <FontAwesomeIcon 
      :icon="faFileClipboard"
      @click="writeClipboardText(prop.content, $event)" 
      size="lg" 
      title="Copy to clipboard"
      />
  </a>
  <span class="tag is-dark" v-else>
    <FontAwesomeIcon 
      :icon="faFileClipboard"
      class="mr-2"
      size="lg" 
      />
    Copied.
  </span>
</template>
