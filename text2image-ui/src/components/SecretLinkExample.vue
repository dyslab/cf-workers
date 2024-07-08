<script setup>
import { onMounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faKeyboard, faWindowClose, faFileClipboard } from '@fortawesome/free-regular-svg-icons';

const form = ref(null);
const input = ref(null);
const passcode = ref(null);
const secret = ref(null);
const form_content = ref(
`<form action="${window.location.origin}/secretlink/redirect" method="post">
  <input type="text" name="passcode" required>
  <input type="hidden" name="secret" value="GENERATED_SECRET">
  <input type="submit" value="Unlock">
</form>

<!-- NOTE: Replace GENERATED_SECRET with real secret, such as 3c702c80ff1b567c etc. -->`
);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if( urlParams.has('secret') ){
  secret.value = urlParams.get('secret');
}

const submitForm = () => {
  if (passcode.value.length > 0) {
    form.value.submit();
  } else {
    alert("Please enter a passcode");
  }
}

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

onMounted(() => {
  input.value.focus();
});
</script>

<template>
  <section class="sle-section my-6 is-flex is-flex-direction-row is-justify-content-center">
    <form ref="form" action="/secretlink/redirect" method="post">
      <div class="field has-addons">
        <div class="control has-icons-left">
          <input 
          class="input" 
          type="text" 
          name="passcode" 
          ref="input" 
          v-model="passcode"
          placeholder="Passcode" 
          size="10" 
          maxlength="10"
          required>
          <span class="icon is-left">
            <FontAwesomeIcon :icon="faKeyboard" />
          </span>
        </div>
        <div class="control">
          <button class="button is-link" @click="submitForm">
            Open URL
          </button>
        </div>
      </div>
      <input type="hidden" name="secret" :value="secret">
    </form>
  </section>
  <section class="my-6">
    <article class="message is-info">
      <div class="message-header">
        <p>Insert html content</p>
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
  <section class="my-6 is-flex is-flex-direction-row is-justify-content-center">
    <button class="button is-danger" @click="closeWindow">
      <FontAwesomeIcon class="mr-2" :icon="faWindowClose" size="1x" />
      Close Window
    </button>
  </section>
</template>

<style scoped>
.sle-section {
  min-height: 150px;
}
</style>