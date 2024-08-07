<script setup>
import { onMounted, ref } from 'vue';
import { formatFileSize } from './common-functions'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faCircleUp, faFilePdf, faFilePowerpoint, faFile, faFileLines, faFileImage, 
  faFileExcel, faFileWord, faFileAudio, faFileVideo, faFileZipper 
} from '@fortawesome/free-regular-svg-icons';

let files_info = ref([]);
/* 
// For debug, field value 'id' had been converted to be a 'datetime' field value at backend function '/upload/list.js'
let files_info = ref([
  {id:1719902927369,key:"KBANK2UPLOAD-demo.xlsx",type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",size:280729},
  {id:1719869128921,key:"使用说明.txt",type:"text/plain",size:925},{id:1719869032040,key:"warp.zip",type:"application/zip",size:858162},
  {id:1719868814921,key:"emoji-fixed-index.html",type:"text/html",size:357469},
  {id:1719868814715,key:"7.1.zip",type:"application/zip",size:93057},
  {id:1719868794134,key:"20240531010928364548_1_opvrdksh7j.jpg",type:"image/jpeg",size:131406},
  {id:1719863692835,key:"warp-plus-GB.zip",type:"application/zip",size:311417},
  {id:1719863688891,key:"DumpStack.log.tmp",type:"application/octet-stream",size:8192},
  {id:1719863688888,key:".__deepin.db",type:"application/octet-stream",size:16384},
  {id:1719863487002,key:"Wai Kru letter 2017_2.pdf",type:"application/pdf",size:635009}
]);
*/

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
      <div class="sf-auto-new-line">
        {{ file.key }}
      </div>
      <div class="is-size-7 is-flex-shrink-0">
        <span class="ml-1 has-text-grey">{{ formatFileSize(file.size) }}</span>
        <span class="ml-1 has-text-grey-light">{{ file.datetime }}</span>
      </div>
    </a>
  </nav>
</template>

<style scoped>
.sf-auto-new-line {
  word-break: break-all;
}
</style>
