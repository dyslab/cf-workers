<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// More icons referred to: https://fontawesome.com/search?o=r&m=free&s=regular
import { faLightbulb, faSmile } from '@fortawesome/free-regular-svg-icons';
import FormFieldImagePicker from './FormFieldImagePicker.vue';

const models = [
  '@cf/lykon/dreamshaper-8-lcm',
  '@cf/stabilityai/stable-diffusion-xl-base-1.0',
  '@cf/bytedance/stable-diffusion-xl-lightning',
  '@cf/runwayml/stable-diffusion-v1-5-img2img',
  '@cf/runwayml/stable-diffusion-v1-5-inpainting',
];

let key = ref('');
let selected_model = ref(models[0]);
let prompt = ref('a city in future world with crowdy robots walking on the streets');
let submit_button_disabled = ref(false);
let response_image = ref('image/logo.svg');
const input_image_file_array_data = ref(null);
const mask_image_file_array_data = ref(null);

const postPrompt = async () => {
  loading(true);
  // setTimeout(() => { console.log(`${key.value} with ${prompt.value}`); loading(false); }, 5000); // For debug
  const formPrompt = new FormData();
  formPrompt.append('key', key.value);
  formPrompt.append('model_id', selected_model.value);
  formPrompt.append('prompt', prompt.value);
  if (selected_model.value.includes('img2img') || selected_model.value.includes('inpainting')) {
    formPrompt.append('image', input_image_file_array_data.value);
  }
  if (selected_model.value.includes('inpainting')) {
    formPrompt.append('mask', mask_image_file_array_data.value);
  }
  try {
    for (let kv of formPrompt.entries()) {
      console.log(`${kv[0]}: ${kv[1]}`);
    }
    let resp = await fetch(
      'https://text2image.zhdys.workers.dev/',
      {
        method: 'POST',
        body: formPrompt,
      },
    );
    console.log(resp);
    if (resp.ok) {
      let fetch_image = false;
      const resp_contentType = resp.headers.get('content-type');
      if (resp_contentType.includes('json')) {
        let resp_json = await resp.json();
        console.log(resp_json);
        if (resp_json.statusCode === 200) {
          const fetch_image_request = new Request(resp_json.imageUrl);
          resp = await fetch(fetch_image_request);
          fetch_image = true;
        } else {
          key.value = `⛔ Your key "${key.value}" is unauthorized ⛔`;
        }
      } else if (resp_contentType.includes('png')) {
        fetch_image = true;
      }
      if (fetch_image) {
        console.log('PNG Image Streaming... Wait please!');
        const image_blob = await resp.blob();
        const image_URL = URL.createObjectURL(image_blob);
        response_image.value = image_URL;
      } else {
        console.log(resp_contentType);
      }
    }
    loading(false);
  } catch(err) {
    console.log(err);
    key.value = `❎ Failed! Error caught. Message: ${err} ❎`;
    loading(false);
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
      if (count % 10 === 0) { dots = '.'; }
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

/**
 * 
 * @param data URL data
 * @returns ArrayBuffer
 * @description Convert URL data to ArrayBuffer
 * 
 */
const fromUrlDataToArrayData = (data) => {
  if (data === null) return null;

  const pure_b64 = data.replace('data:', '').replace(/^.+,/, '');
  const binary_string = atob(pure_b64);
  // Convert a utf-8 binary string into a Uint8Array
  const array_date = Uint8Array.from(binary_string, (char) => char.charCodeAt(0));

  return array_date;
}
</script>

<template>
  <nav class="panel is-info">
    <p class="panel-heading">Text to Image</p>
    <div class="p-3">
      <div class="field">
        <label class="label">
          Key / Pass Code
          <a href="https://dash.cloudflare.com/" target="_blank">
            <span class="icon-text has-text-warning">
              <span class="icon">
                <FontAwesomeIcon 
                :icon="faSmile" 
                size="lg" 
                title="Checkout dauth env vars on Cloudflare Dashboard" />
              </span>
            </span>
          </a>
        </label>
        <div class="control">
          <input class="input" type="text" v-model="key" placeholder="Input Your Key or Pass Code">
        </div>
      </div>
      <div class="field">
        <label class="label">
          Model
          <a href="https://developers.cloudflare.com/workers-ai/models/#text-to-image" target="_blank">
            <span class="icon-text has-text-info">
              <span class="icon">
                <FontAwesomeIcon 
                :icon="faLightbulb" 
                size="lg" 
                title="Checkout AI Models on Cloudflare Docs" />
              </span>
            </span>
          </a>
        </label>
        <div class="select">
          <select v-model="selected_model">
            <option v-for="(model, index) in models">
              {{ model }}
            </option>
          </select>
        </div>
      </div>
      <!-- Show input image picker component when selected model is either 'img2img' or 'inpainting' -->
      <FormFieldImagePicker 
      title="Input Image" 
      @get-image-file-url-data="(data) => input_image_file_array_data = fromUrlDataToArrayData(data)" 
      v-if="selected_model.includes('img2img') || selected_model.includes('inpainting')" 
      />
      <!-- Show mask image picker component when selected model is 'inpainting' -->
      <FormFieldImagePicker 
      title="Mask Image" 
      @get-image-file-url-data="(data) => mask_image_file_array_data = fromUrlDataToArrayData(data)" 
      v-if="selected_model.includes('inpainting')" 
      />
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
    </div>
  </nav>
</template>

<style scoped>
.output_image {
  max-width: 100%;
  max-height: 100%;
  display: block;
  object-fit: contain;
}
</style>
