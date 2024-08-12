<script setup>
import { ref } from 'vue';
import CopyToClipboard from './CopyToClipboard.vue';

const url = ref('');
const url_note = ref('');
const passcode = ref('passcode');
const secret = ref('secret');
const webpage = ref('');
const linked = ref('');
const response_hidden = ref(true);

const generateSecretLink = async () => {
  if (verifyUrl(url.value)) {
    url_note.value = '';
    if (linked.value !== url.value) {
      webpage.value = 'fetching ...';
      linked.value = 'fetching ...';
      const timestamp = Date.now().toString();
      passcode.value = timestamp.slice(-4);
      secret.value = await digestMessage(timestamp + url.value);
      // Save to cloudflare D1 table and get JSON result
      const formLink = new FormData();
      formLink.append('url', url.value);
      formLink.append('passcode', passcode.value);
      formLink.append('secret', secret.value);
      const init = {
        method: "POST",
        body: formLink,
      };
      const resp = await fetch('/secretlink/generate', init);
      if (resp.ok) {
        try {
          const result_json = await resp.json();
          if (result_json.status === 200) {
            webpage.value = `${window.location.origin}/secretlink/web/${secret.value}`;
            linked.value = url.value;
          }
        } catch (error) {
          webpage.value = 'error';
          linked.value = error.message;
          console.log(`Generate Secret Link Error! Error message ${error}`);
        }
      } else {
        webpage.value = 'Response failed';
        linked.value = 'Response failed';     
      }
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
          <span class="ml-3 has-text-weight-bold has-text-success-40 is-size-4">
            {{ passcode }}
          </span>
          <CopyToClipboard class="ml-3" :content="passcode" />
        </div>
        <!--div class="mt-3">
          <span>
            Secret:
          </span>
          <span class="ml-3 has-text-weight-bold  has-text-success">
            {{ secret }}
          </span>
          <CopyToClipboard class="ml-3" :content="secret" />
        </div-->
        <div class="mt-3">
          Unlock Webpage URL: 
          <CopyToClipboard class="ml-3" :content="webpage" />
        </div>
        <div class="ml-2 sl-auto-new-line">
          <a class="has-text-success-50 is-size-7" :href="webpage" target="_blank" v-if="verifyUrl(webpage)">
            {{ webpage }}
          </a>
          <span class="has-text-danger is-size-7" v-else>
            {{ webpage }}
          </span>
        </div>
        <div class="mt-3">
          Linked URL: 
        </div>
        <div class="ml-2 sl-auto-new-line">
          <a class="has-text-success-50 is-size-7" :href="linked" target="_blank" v-if="verifyUrl(linked)">
            {{ linked }}
          </a>
          <span class="has-text-danger is-size-7" v-else>
            {{ linked }}
          </span>
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