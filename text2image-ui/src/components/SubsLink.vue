<script setup>
import { onMounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHandPointRight } from '@fortawesome/free-regular-svg-icons';

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
  const resp = await fetch('/subs/listauto', init);
  files_info.value = await resp.json();
});
</script>

<template>
  <nav class="panel is-primary">
    <p class="panel-heading has-background-link-light">Subs Links</p>
    <a class="panel-block" v-for="file in files_info" :href="getSubsFileLink(file.id, file.ext)" target="_blank">
      <span class="panel-icon image is-24x24">
        <img src="/image/v2rayN.svg" v-if="file.ext.includes('txt')" />
        <img src="/image/clash.svg" v-else />
      </span>
      {{ file.name }}
      <div class="ml-3 is-size-7 has-text-grey">{{ file.info }}</div>
    </a>
    <div class="panel-block">
      <a class="control has-text-right" href="/share">
        Go To Share Page
        <FontAwesomeIcon :icon="faHandPointRight" size="lg" />
      </a>
    </div>
  </nav>
</template>
