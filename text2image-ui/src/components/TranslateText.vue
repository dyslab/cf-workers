<script setup>
import { ref } from 'vue';
import CopyToClipboard from './CopyToClipboard.vue';

const form_content = ref(
`<form action="${window.location.origin}/secretlink/redirect" method="post">
  <input type="text" name="passcode" required>
  <input type="hidden" name="secret" value="GENERATED_SECRET">
  <input type="submit" value="Unlock">
</form>

<!-- NOTE: Replace GENERATED_SECRET with real secret, such as 3c702c80ff1b567c etc. -->`
);
</script>

<template>
  <div>
    <article class="message is-info">
      <div class="message-header">
        <p>Html Content</p>
        <CopyToClipboard :content="form_content" />
      </div>
      <pre class="has-text-light has-background-dark">{{ form_content }}</pre>
    </article>
  </div>
  <div class="mt-6 is-flex is-flex-direction-row is-justify-content-center">
    <a href="javascript:history.back(-1);">Back To Previous Page</a>
  </div>
</template>
