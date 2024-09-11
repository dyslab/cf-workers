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
  "Japanese",
  "Spanish",
]);
const default_from_lang = ref("English");
const default_to_lang = ref("Chinese");
const from_lang = ref(default_from_lang.value);
const to_lang = ref(default_to_lang.value);
const text_rows = ref(10);
const form_content = ref(
`Thrilled to announce that I've been accepted into one of the top 10 universities in the QS rankings! 🌟📚 Feeling so grateful for this incredible opportunity and excited for all the amazing experiences that lie ahead. Thank you to everyone who has supported me along this journey. Here's to new beginnings and endless possibilities! #blessed #top10university #futureleader 🎓🌟`
);

const to_content = ref(
`This is 'To' area.

<form action="${window.location.origin}/secretlink/redirect" method="post">
  <input type="text" name="passcode" required>
  <input type="hidden" name="secret" value="GENERATED_SECRET">
  <input type="submit" value="Unlock">
</form>

<!-- NOTE: Replace GENERATED_SECRET with real secret, such as 3c702c80ff1b567c etc. -->`
);

const translateAction = async () => {
  if (form_content.value.trim() === "") return;

  const body = {
    from: from_lang.value,
    to: to_lang.value,
    form_content: form_content.value,
  };
  const init = {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };
  try {
    const resp = await fetch('/translate/m2m100', init);
    console.log(resp);
    const contentType = resp.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const respJson = await resp.json();
      console.log(respJson);
      to_content.value = respJson.to_content;
    }
  } catch(err) {
    console.log(err);
  }
}

/*
watch(form_content, (val) => {
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
            <a class="tag" @click="translateAction()">
              Translate 
              <FontAwesomeIcon 
                class="ml-2"
                :icon="faCaretSquareRight"
                size="lg" 
                />
            </a>
          </div>
        </div>
        <textarea 
        class="textarea is-info" 
        placeholder="text here"
        :rows="text_rows" 
        v-model="form_content" 
        />
        <!--p>Auto-detect: Chinese</p-->
        <!--pre class="has-text-light has-background-dark">{{ form_content }}</pre-->
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
