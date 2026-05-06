<template>
  <section class="hero">
    <div class="section-wrapper">

      <div class="section-card hero__card">
        <h1>STOP LETTING YOUR<br/>HARD-EARNED LEADS<br/><span class="accent-pink">GO TO WASTE.</span></h1>
        <p class="hero__sub">
          Most businesses lose up to 40% of their sales to slow follow-ups and "lost" leads sitting in their CRM.
          I build AI Sales Engines that capture that missing revenue&mdash;protected by strict quality-control
          systems so your brand is always safe.
        </p>
        <div class="hero__actions">
          <DButton variant="accent-pink" size="lg" @click="scrollTo('#contact')">
            Find My Hidden Revenue
          </DButton>
          <DButton variant="secondary" size="lg" @click="scrollTo('#what')">
            Learn More
          </DButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { DButton } from '../dimensional-ui/components'

const scrollTo = (selector: string) => {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero {
  padding-top: 80px;
  padding-bottom: var(--section-spacing);
}

.hero__icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: -32px;
  position: relative;
  z-index: 2;
}

.hero__icon {
  width: 80px;
  height: 80px;
  background: var(--d-bg-secondary);
  border: var(--d-border-width-extra-thick) solid var(--d-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--d-shadow-md);
  padding: 12px;
}

.hero__card {
  text-align: center;
  padding-top: clamp(3rem, 5vw, 5rem);
}

.hero__sub {
  max-width: 600px;
  margin: 1.5rem auto;
  color: var(--d-text-primary);
  opacity: 0.85;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero {
    padding-top: 48px;
  }

  .hero__actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
