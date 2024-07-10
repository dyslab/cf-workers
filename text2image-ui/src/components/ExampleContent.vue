<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faWindowClose, faFileClipboard } from '@fortawesome/free-regular-svg-icons';

const form_content = ref(
`<form action="${window.location.origin}/secretlink/redirect" method="post">
  <input type="text" name="passcode" required>
  <input type="hidden" name="secret" value="GENERATED_SECRET">
  <input type="submit" value="Unlock">
</form>

<!-- NOTE: Replace GENERATED_SECRET with real secret, such as 3c702c80ff1b567c etc. -->`
);

const closeWindow = () => {
  window.close();
}

const writeClipboardText = async (text, event) => {
  try {
    await navigator.clipboard.writeText(text);
    event.target.parentElement.classList.add(['has-text-warning']);
    setTimeout(() => {
      event.target.parentElement.classList.remove(['has-text-warning']);
    }, 1000);
  } catch (error) {
    console.error(error.message);
  }
}
</script>

<template>
  <section>
    <article class="message is-info">
      <div class="message-header">
        <p>Html Content</p>
        <a class="icon ml-3 has-text-link">
          <FontAwesomeIcon 
          :icon="faFileClipboard"
          @click="writeClipboardText(form_content, $event)" 
          size="lg" 
          title="Copy to clipboard" />
        </a>
      </div>
      <pre class="has-text-light has-background-dark">{{ form_content }}</pre>
    </article>
  </section>
  <section class="mt-6 is-flex is-flex-direction-row is-justify-content-center">
    <button class="button is-danger" @click="closeWindow">
      <FontAwesomeIcon class="mr-2" :icon="faWindowClose" size="1x" />
      Close Window
    </button>
  </section>
</template>
