<script setup>
import Header from './components/Header.vue';
import Form2Image from './components/Form2Image.vue';
import SubsFile from './components/SubsFile.vue';
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="container px-3">
    <Header />
    <div class="columns is-desktop">
      <div class="column is-8"><Form2Image /></div>
      <div class="column is-auto"><SubsFile /></div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
</style>
