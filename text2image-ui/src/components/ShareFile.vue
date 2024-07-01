<script setup>
import { onMounted, ref } from 'vue';
import { formatFileSize, formatLocaleDatetime } from './common-functions'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faCircleUp, faFilePdf, faFilePowerpoint, faFile, faFileLines, faFileImage, 
  faFileExcel, faFileWord, faFileAudio, faFileVideo, faFileZipper 
} from '@fortawesome/free-regular-svg-icons';

let files_info = ref([]);

const getShareFileLink = (id) => {
  return `/upload/file?id=${id}`;
}

onMounted(async () => {
  const init = {
    method: "GET",
  };
  const resp = await fetch('/upload/list', init);
  files_info.value = await resp.json();
});
</script>

<template>
  <nav class="panel is-primary">
    <p class="panel-heading">
      <div class="is-flex is-flex-direction-row is-justify-content-space-between">
        <span>
          Shared Files
        </span>
        <a href="/upload">
          <span class="panel-icon has-text-primary-30">
            <FontAwesomeIcon :icon="faCircleUp" size="lg" />
          </span>
        </a>
      </div>
    </p>
    <a class="panel-block" v-for="file in files_info" :href="getShareFileLink(file.id)" target="_blank">
      <span class="panel-icon">
        <FontAwesomeIcon :icon="faFileLines" size="lg" v-if="file.type.includes('text')" />
        <FontAwesomeIcon :icon="faFileImage" size="lg" v-else-if="file.type.includes('image')" />
        <FontAwesomeIcon :icon="faFileAudio" size="lg" v-else-if="file.type.includes('audio')" />
        <FontAwesomeIcon :icon="faFileVideo" size="lg" v-else-if="file.type.includes('video')" />
        <FontAwesomeIcon :icon="faFileZipper" size="lg" 
        v-else-if="file.type.includes('zip')
        || file.type.includes('7z') 
        || file.type.includes('tar') 
        || file.type.includes('rar')" />
        <FontAwesomeIcon :icon="faFilePdf" size="lg" v-else-if="file.type.includes('pdf')" />
        <FontAwesomeIcon :icon="faFileWord" size="lg" v-else-if="file.type.includes('word')" />
        <FontAwesomeIcon :icon="faFileExcel" size="lg" 
        v-else-if="file.type.includes('excel')
        || file.type.includes('spreadsheet')" />
        <FontAwesomeIcon :icon="faFilePowerpoint" size="lg" 
        v-else-if="file.type.includes('powerpoint') 
        || file.type.includes('presentation')" />
        <FontAwesomeIcon :icon="faFile" size="lg" v-else />
      </span>
      {{ file.key }}
      <div class="ml-3 is-size-7 has-text-grey">{{ formatFileSize(file.size) }}</div>
      <div class="ml-3 is-size-7 has-text-grey-light">{{ formatLocaleDatetime(file.id) }}</div>
    </a>
  </nav>
</template>
