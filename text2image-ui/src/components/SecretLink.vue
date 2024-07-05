<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFileClipboard } from '@fortawesome/free-regular-svg-icons';

const url = ref('');
const url_note = ref('');
const passcode = ref('passcode');
const secret = ref('secret');
const webpage = ref('');
const linkto = ref('');
const response_hidden = ref(true);

const generateSecretLink = async () => {
  if (verifyUrl(url.value)) {
    url_note.value = '';
    if (linkto.value !== url.value) {
      const timestamp = Date.now().toString();
      passcode.value = timestamp.slice(-4);
      secret.value = await digestMessage(timestamp + url.value);
      webpage.value = `${window.location}path/${secret.value}`;
      linkto.value = url.value;
      // fetch ok, then ...
    }
    response_hidden.value = false;
  } else {
    url_note.value = 'URL is invalid';
    response_hidden.value = true;
  }
}

const verifyUrl = (u) => {
  const re = /https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*(.+)*/gi;
  const url_ok = u.match(re);
  return url_ok === null? false : true;
}

const digestMessage = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex.slice(-16);
}

const writeClipboardText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error.message);
  }
}
</script>

<template>
  <nav class="panel is-warning">
    <p class="panel-heading">Secret Link</p>
    <div class="p-3">
      <div class="field">
        <label class="label">
          URL
        </label>
        <div class="control">
          <input class="input" type="url" placeholder="Your file / page's url" v-model="url" maxlength="255" />
          <span class="has-text-danger">
            {{ url_note }}
          </span>
        </div>
      </div>
      <div class="block">
        <button class="button is-link is-fullwidth" @click="generateSecretLink">
          Generate Secret Link
        </button>
      </div>
      <div class="block is-size-6" :hidden="response_hidden">
        <div>
          <span>
            Passcode:
          </span>
          <span class="ml-3 has-text-weight-bold has-text-success">
            {{ passcode }}
          </span>
          <span class="icon ml-3 has-text-link">
            <a>
              <FontAwesomeIcon 
              :icon="faFileClipboard"
              @click="writeClipboardText(passcode)" 
              size="1x" 
              title="Copy to clipboard" />
            </a>
          </span>
        </div>
        <div class="mt-2">
          <span>
            Secret:
          </span>
          <span class="ml-3 has-text-weight-bold  has-text-success">
            {{ secret }}
          </span>
          <span class="icon ml-3 has-text-link">
            <a>
              <FontAwesomeIcon 
              :icon="faFileClipboard"
              @click="writeClipboardText(secret)" 
              size="1x" 
              title="Copy to clipboard" />
            </a>
          </span>
        </div>
        <div class="mt-2">
          Passcode Input Page: 
        </div>
        <div class="ml-3 is-underlined has-text-primary sl-auto-new-line">
          <span class="is-size-7">{{ webpage }}</span>
          <span class="icon ml-3 has-text-link">
            <a>
              <FontAwesomeIcon 
              :icon="faFileClipboard"
              @click="writeClipboardText(webpage)" 
              size="1x" 
              title="Copy to clipboard" />
            </a>
          </span>
        </div>
        <div class="mt-2">
          Link To Your File / Page: 
        </div>
        <div class="ml-3 is-size-7 is-underlined has-text-warning sl-auto-new-line">
          <span class="is-size-7">{{ linkto }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.sl-auto-new-line {
  word-break: break-all;
}
</style>