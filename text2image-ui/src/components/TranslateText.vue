<script setup>
import { ref } from 'vue';
import CopyToClipboard from './CopyToClipboard.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCaretSquareRight } from '@fortawesome/free-regular-svg-icons';

const langs = ref([
  "Chinese",
  "English",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Spanish",
]);
const default_from_lang = ref("English");
const default_to_lang = ref("Chinese");
const from_lang = ref(default_from_lang.value);
const to_lang = ref(default_to_lang.value);
const text_rows = ref(10);
const is_translating = ref(false);
const from_content = ref(
`Thrilled to announce that I've been accepted into one of the top 10 universities in the QS rankings! 🌟📚 Feeling so grateful for this incredible opportunity and excited for all the amazing experiences that lie ahead. Thank you to everyone who has supported me along this journey. Here's to new beginnings and endless possibilities! #blessed #top10university #futureleader 🎓🌟`
);
const to_content = ref(
`This is 'To' area. window.location.origin=${window.location.origin}`
);

const translateAction = async () => {
  if (from_content.value.trim() === "") return;
  if (from_lang.value === to_lang.value) {
    to_content.value = from_content.value;
    return;
  }

  const body = {
    from_lang: from_lang.value,
    to_lang: to_lang.value,
    from_content: from_content.value,
  };
  const init = {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };
  try {
    is_translating.value = true;
    const resp = await fetch('/translate/m2m100', init);
    const contentType = resp.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const respJson = await resp.json();
      if (respJson.to_content) to_content.value = respJson.to_content;
      else to_content.value = JSON.stringify(respJson);
    } else {
      to_content.value = resp.text();
    }
  } catch(err) {
    to_content.value = err;
    console.log(err);
  } finally {
    is_translating.value = false;
  }
}

/*
watch(from_content, (val) => {
  if (typeof browser !== 'undefined') {
    browser.i18n.detectLanguage(val).then((langInfo) => {
      for (const lang of langInfo.languages) {
        console.log(`Language is: ${lang.language}`);
        console.log(`Percentage is: ${lang.percentage}`);
      }
    }).catch((err) => {
      console.log(err);
    });
  } else {
    console.log("browser.i18n: Browser not supported.");
  }
});
*/
</script>

<template>
  <div class="columns">
    <div class="column is-half">
      <article class="message is-primary">
        <div class="message-header">
          <div class="is-flex is-align-items-center">
            <div class="has-text-grey is-size-6">From</div>
            <div class="ml-2 select is-info is-rounded is-small">
              <select v-model="from_lang">
                <option v-for="lang of langs" :selected="default_from_lang == lang">{{ lang }}</option>
              </select>
            </div>
          </div>
          <div>
            <a class="tag" @click="translateAction()" v-if="!is_translating">
              Translate 
              <FontAwesomeIcon 
                class="ml-2"
                :icon="faCaretSquareRight"
                size="lg" 
                />
            </a>
            <span class="tag" v-else>
              Translating...
            </span>
          </div>
        </div>
        <textarea 
        class="textarea is-info" 
        placeholder="text here"
        :rows="text_rows" 
        v-model="from_content" 
        />
        <!--p>Auto-detect: Chinese</p-->
        <!--pre class="has-text-light has-background-dark">{{ from_content }}</pre-->
      </article>
    </div>
    <div class="column is-half">
      <article class="message is-success">
        <div class="message-header">
          <div class="is-flex is-align-items-center">
            <div class="has-text-grey is-size-6">To</div>
            <div class="ml-2 select is-success is-rounded is-small">
              <select v-model="to_lang">
                <option v-for="lang of langs" :selected="default_to_lang == lang">{{ lang }}</option>
              </select>
            </div>
          </div>
          <div>
            <CopyToClipboard :content="to_content" />
          </div>
        </div>
        <textarea 
        class="textarea is-success has-background-light" 
        placeholder="Text" v-model="to_content" 
        :rows="text_rows" 
        readonly 
        />
      </article>
    </div>
  </div>
  <div class="mt-6 is-flex is-flex-direction-row is-justify-content-center">
    <a href="javascript:history.back(-1);">Back To Previous Page</a>
  </div>
</template>
