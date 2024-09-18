<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// More icons referred to: https://fontawesome.com/search?o=r&m=free&s=regular
import { faSquareCaretUp } from '@fortawesome/free-regular-svg-icons';

const props = defineProps({
  title: String
});
const emit = defineEmits(['selectedfile']);

const accept_file_types = ref('image/png, image/jpeg');
const image_file = ref({ name: 'No file selected',});
const image_src = ref(null);

const onImageFileChange = (event) => {
  image_file.value = event.target.files[0];
  emit('selectedfile', image_file.value);
  const reader = new FileReader();
  reader.onload = (e) => {
    image_src.value = e.target.result;
  }
  reader.readAsDataURL(image_file.value);
}
</script>

<template>
  <div class="field">
    <label class="label">
      {{ title }}
    </label>
    <div class="control">
      <div class="file has-name is-link">
        <label class="file-label">
          <input class="file-input" 
          type="file" 
          :accept="accept_file_types"
          @change="onImageFileChange" />
          <span class="file-cta">
            <span class="file-icon">
              <FontAwesomeIcon 
              :icon="faSquareCaretUp" 
              size="lg" />
            </span>
            <span class="file-label">Select {{ title }}</span>
          </span>
          <span class="file-name">{{ image_file.name }}</span>
        </label>
      </div>
      <img class="image is-128x128" 
      :src="image_src" 
      :alt="image_file.name" 
      :title="image_file.name" 
      v-if="image_src" />
    </div>
  </div>
</template>
