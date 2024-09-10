<script setup>
import { ref } from 'vue';
import CopyToClipboard from './CopyToClipboard.vue';

const text_rows = ref(10);
const form_content = ref(
`Thrilled to announce that I've been accepted into one of the top 10 universities in the QS rankings! 🌟📚 Feeling so grateful for this incredible opportunity and excited for all the amazing experiences that lie ahead. Thank you to everyone who has supported me along this journey. Here's to new beginnings and endless possibilities! #blessed #top10university #futureleader 🎓🌟`
);

const to_content = ref(
`I am To
I am To
I am To
I am To
I am To
<form action="${window.location.origin}/secretlink/redirect" method="post">
  <input type="text" name="passcode" required>
  <input type="hidden" name="secret" value="GENERATED_SECRET">
  <input type="submit" value="Unlock">
</form>

<!-- NOTE: Replace GENERATED_SECRET with real secret, such as 3c702c80ff1b567c etc. -->`
);
</script>

<template>
  <div class="columns">
    <div class="column is-half">
      <article class="message is-info">
        <div class="message-header">
          <div class="is-flex is-align-items-center">
            <div class="has-text-grey is-size-6">From</div>
            <div class="ml-2 select is-info is-rounded is-small">
              <select>
                <option>English</option>
                <option>Chinese</option>
              </select>
            </div>
          </div>
          <div>
            <CopyToClipboard :content="form_content" />
          </div>
        </div>
        <textarea 
        class="textarea is-info" 
        placeholder="text here"
        :rows="text_rows" 
        v-model="form_content" 
        />
        <p>Auto-detect: Chinese</p>
        <!--pre class="has-text-light has-background-dark">{{ form_content }}</pre-->
      </article>
    </div>
    <div class="column is-half">
      <article class="message is-success">
        <div class="message-header">
          <div class="is-flex is-align-items-center">
            <div class="has-text-grey is-size-6">To</div>
            <div class="ml-2 select is-success is-rounded is-small">
              <select>
                <option>English</option>
                <option>Chinese</option>
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
