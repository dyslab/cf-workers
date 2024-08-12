<script setup>
import { onMounted, ref } from 'vue';
import { formatFileSize } from './common-functions'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHandPointRight } from '@fortawesome/free-regular-svg-icons';

let files_info = ref([]);

const getSubsFileLink = (id, ext) => {
  return `/subs/${id}/${ext}`;
}

onMounted(async () => {
  const resp = await fetch('/subs/listall');
  files_info.value = await resp.json();
});
</script>

<template>
  <nav class="panel is-primary">
    <p class="panel-heading has-background-link-light">Subs Links</p>
    <a class="panel-block" v-for="file in files_info" :href="getSubsFileLink(file.id, file.ext)" target="_blank">
      <span class="panel-icon image is-1by1">
        <img src="/image/v2rayN.svg" v-if="file.ext.includes('txt')" />
        <img src="/image/clash.svg" v-else />
      </span>
      {{ file.key }}
      <div class="ml-2 is-size-7 has-text-grey">{{ formatFileSize(file.size) }}</div>
      <div class="ml-2 is-size-7 has-text-grey-light">{{ file.datetime }}</div>
    </a>
    <div class="panel-block">
      <a class="control has-text-right" href="/share">
        Go To Share Page
        <FontAwesomeIcon :icon="faHandPointRight" size="lg" />
      </a>
    </div>
    <!--div class="panel-block">
      <a class="control has-text-right" href="/translate">
        Go To Translate Page
        <FontAwesomeIcon :icon="faHandPointRight" size="lg" />
      </a>
    </div-->
  </nav>
</template>
