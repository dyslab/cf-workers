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
    <div class="columns is-desktop">
      <div class="column is-7"><ShareFile /></div>
      <div class="column is-auto">
        <SecretLink />
        <SubsFile />
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
</style>
