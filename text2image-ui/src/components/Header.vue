<script setup>
const prop = defineProps({
  subtitle: {
    type: String,
    required: true,
    default: 'Hello World'
  }
});
</script>

<template>
  <section class="hero">
    <div class="hero-body">
      <p class="title">
        <a href="/">
          Cloudflare Worker AI Demo
        </a>
      </p>
      <p class="subtitle">{{ prop.subtitle }}</p>
    </div>
  </section>
</template>
