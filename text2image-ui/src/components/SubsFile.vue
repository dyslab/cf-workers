<script setup>
import { onMounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// More icons referred to: https://fontawesome.com/search?o=r&m=free&s=regular
import { faFileLines, faFileCode } from '@fortawesome/free-regular-svg-icons';

const files_index = ref([
  { id: 0, ext: 'txt' },
  { id: 1, ext: 'txt' },
  { id: 2, ext: 'txt' },
  { id: 3, ext: 'txt' },
  { id: 4, ext: 'txt' },
  { id: 5, ext: 'yml' },
]);
let files_info = ref([]);

const getSubsFileLink = (id, ext) => {
  return `/subs/${id}/${ext}`;
}

onMounted(async () => {
  const init = {
    body: JSON.stringify(files_index.value),
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };
  const resp = await fetch('/subs_info', init);
  files_info.value = await resp.json();
});
</script>

<template>
  <nav class="panel is-link">
    <p class="panel-heading">Subs File Links</p>
    <a class="panel-block" v-for="file in files_info" :href="getSubsFileLink(file.id, file.ext)" target="_blank">
      <span class="panel-icon">
        <FontAwesomeIcon :icon="faFileLines" size="lg" v-if="file.ext.includes('txt')" />
        <FontAwesomeIcon :icon="faFileCode" size="lg" v-else />
      </span>
      {{ file.name }}
      <div class="ml-3 is-size-7 has-text-grey">{{ file.info }}</div>
    </a>
  </nav>
</template>
