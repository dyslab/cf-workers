<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// More icons referred to: https://fontawesome.com/search?o=r&m=free&s=regular
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

</script>

<template>
  <footer class="footer mt-6">
    <div class="content has-text-centered">
      <p>
        Copyright 
        <span class="icon-text">
          <span class="icon">
            <FontAwesomeIcon :icon="faCopyright" />
          </span>
        </span>
        2024-Present. All rights <strong>NOT</strong> reserved. 
        <br>
        <a href="http://opensource.org/licenses/mit-license.php" target="_blank">MIT</a> Licensed.
        Powered by Cloudflare Free Plan.
      </p>
    </div>
  </footer>
</template>
