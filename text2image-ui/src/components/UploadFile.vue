<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// More icons referred to: https://fontawesome.com/search?o=r&m=free&s=regular
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';

const FILE_COUNT_LIMIT = 5;
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

const upload_message = ref('');

const dropFiles = (event) => {
  const dt = event.dataTransfer;
  if (dt.files.length > 0) {
    processFiles(dt.files);
  }
}

const chooseFiles = (event) => {
  if (event.target.files.length > 0) {
    processFiles(event.target.files);
  }
}

const processFiles = (files) => {
  let id = 1;
  upload_message.value ='';
  for(let file of files) {
    uploadFile(file, id);
    id ++;
  }
}

const uploadFile = async (file, id) => {
  const init_upload_msg = upload_message.value;
  let current_file_upload_msg = `File[${id}]: ${file.name} Size: ${file.size} bytes. Uploading ...<br>`;
  upload_message.value = init_upload_msg + current_file_upload_msg;
  /*
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  console.log(data);
  */
  current_file_upload_msg = `File[${id}]: ${file.name} Size: ${file.size} bytes. Uploaded OK!<br>`;
  upload_message.value = init_upload_msg + current_file_upload_msg;
}
</script>

<template>
  <div 
  class="box has-background-grey-dark" 
  @drop.prevent="dropFiles"
  @dragenter.prevent 
  @dragover.prevent>
    <div class="block has-text-centered is-size-4 has-text-success mt-6">
      Drop file(s) here to upload
    </div>
    <div class="file is-centered is-size-4 is-primary mt-3">
      <label class="file-label">
        <input class="file-input" type="file" multiple @change="chooseFiles" />
        <span class="file-cta">
          <span class="file-icon">
            <FontAwesomeIcon :icon="faFolderOpen" size="lg" />
          </span>
          <span class="file-label">Choose File(s)</span>
        </span>
      </label>
    </div>
    <div class="block has-text-centered is-size-5 has-text-warning mt-3 mb-6">
      NOTE: Each file size limits to 5MB, and quantity limits to 5 files once.
    </div>
  </div>
  <div class="block my-3" v-html="upload_message" />
  <div class="my-6 block has-text-centered">
    <a href="/">Back To Home</a>
  </div>
</template>
