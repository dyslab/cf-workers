<script setup>
import { ref, watch } from 'vue';
import { formatFileSize } from './common-functions'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// More icons referred to: https://fontawesome.com/search?o=r&m=free&s=regular
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';

const FILE_COUNT_LIMIT = 5;
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

const upload_files = ref([])
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
  let id = 0;
  upload_files.value.length = 0;  // Empty the array
  for(let file of files) {
    if (id >= FILE_COUNT_LIMIT) break;
    if (file.size <= FILE_SIZE_LIMIT) {
      upload_files.value.push({
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        status: 'uploading'
      });
      uploadFile(file, id);
    } else {
      upload_files.value.push({
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        status: 'ignored'
      });
    }
    id ++;
  }
}

const uploadFile = async (file, id) => {
  // 创建一个新的 FormData 对象，用于存储表单数据
  const formData = new FormData();
  formData.append('file_id', id);
  formData.append('file', file);
  try {
    // 使用 fetch API 发送 POST 请求到 /upload/file 路径，请求体为 formData
    const response = await fetch('/upload/file', {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      // 等待响应并将响应体解析为 JSON 对象
      const resp_json = await response.json();
      console.log(resp_json); // For debug
      if (resp_json.status === 200) {
        upload_files.value[id].status = 'file uploaded. [OK]';
      } else {
        upload_files.value[id].status = `file uploaded and bankend error. Get response: ${resp_json.status} (${resp_json.message})`;
      }
    } else {
      upload_files.value[id].status = `file upload failed. Get response: ${response.status} (${response.statusText})`;
    }
  } catch (error) {
    // 处理错误情况
    console.error(error);
    upload_files.value[id].status = `upload failed. Get error (${error})`;
  }
}

watch(upload_files.value, () => {
  upload_message.value = '';
  let id = 0;
  for (let file of upload_files.value) {
    upload_message.value += `File[${id+1}]: \
    <span class="has-text-primary-25">${file.name}</span> \
    <span class="is-size-7">Size: ${file.size}</span> \
    <span class="tag is-warning">${file.status}</span><br>`;
    id ++;
  }
});
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
