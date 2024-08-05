<script setup>
import Header from './components/Header.vue';
import SubsFile from './components/SubsFile.vue';
import ShareFile from './components/ShareFile.vue';
import SecretLink from './components/SecretLink.vue';
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="container px-3">
    <Header subtitle="Shared Files / Secret Link / (Auto-Updated) Subs Files" />
    <div class="fixed-grid has-1-cols-mobile has-1-cols-tablet has-2-cols-desktop">
      <div class="grid">
        <div class="cell">
          <ShareFile />
        </div>
        <div class="cell">
          <SecretLink />
          <SubsFile />
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
</style>
