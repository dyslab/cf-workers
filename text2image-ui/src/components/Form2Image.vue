<script setup>
import { ref } from 'vue';

let key = ref('');
let prompt = ref('a cyberpunk Chinese man standing at the center of the Time Square like a hero');
let submit_button_disabled = ref(false);
let response_image = ref('image/logo.svg');

const postPrompt = async () => {
  loading(true);
  // setTimeout(() => { console.log(`${key.value} with ${prompt.value}`); loading(false); }, 5000); // For debug
  const formPrompt = new FormData();
  formPrompt.append('key', key.value);
  formPrompt.append('prompt', prompt.value);
  try {
    let resp = await fetch(
      'https://text2image.zhdys.workers.dev/',
      {
        method: 'POST',
        body: formPrompt,
      },
    );
    console.log(resp);
    if (resp.ok) {
      let resp_json = await resp.json();
      console.log(resp_json);
    }
    loading(false);
  } catch(err) {
    console.log(err);
  }
}

let loading_message = ref('');
let loading_interval = 0;
const loading = (enable=false) => {
  if (enable) {
    submit_button_disabled.value = true;
    let count = 0;
    let dots = '.';
    loading_interval = setInterval(() => {
      loading_message.value = `Please wait a moment, AI Generating ${dots}`; 
      count ++;
      if (count % 5 === 0) { dots = '.'; }
      else { dots += '.'; }
    }, 500);
  } else {
    if (loading_interval !== 0) {
      clearInterval(loading_interval);
      submit_button_disabled.value = false;
      loading_message.value = '';
    }
    loading_interval = 0;
  }
}
</script>

<template>
  <div class="field">
    <label class="label">Key / Pass Code</label>
    <div class="control">
      <input class="input" type="text" v-model="key" placeholder="Input Your Key or Pass Code">
    </div>
  </div>
  <div class="field">
    <label class="label">Prompt</label>
    <div class="control">
      <textarea class="textarea" v-model="prompt" placeholder="Input Prompt Here" />
    </div>
  </div>
  <div class="field">
    <div class="control">
      <button class="button is-link" @click="postPrompt" :disabled="submit_button_disabled">Generate Image</button>
    </div>
  </div>
  <div class="block">
    <span>{{ loading_message }}</span>
  </div>
  <div class="block">
    <img alt="Generative Image" class="output_image" :src="response_image" />
  </div>
</template>

<style scoped>
.output_image {
  max-width: 1280px;
}
</style>
