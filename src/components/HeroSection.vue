<template>
  <section class="hero">
    <div class="section-wrapper">
      <!-- Icon overlapping the card top -->
      <div class="hero__icon-wrapper">
        <div class="hero__icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Brain outline -->
            <path d="M24 6 C18 6 14 10 14 14 C10 14 8 18 8 22 C8 26 10 29 14 30 C14 34 18 38 24 38 C30 38 34 34 34 30 C38 29 40 26 40 22 C40 18 38 14 34 14 C34 10 30 6 24 6Z" stroke="#000" stroke-width="2.5" fill="#FFF455"/>
            <!-- Lightning bolt -->
            <path d="M22 16 L18 26 L23 26 L21 34 L30 22 L25 22 L28 16 Z" fill="#FF004D" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="section-card hero__card">
        <h1>AI-POWERED FUNNELS THAT<br/><span class="accent-pink">GROW YOUR REVENUE.</span></h1>
        <p class="hero__sub">
          We build AI sales funnels, lead gen pipelines, and voice agents that find, qualify,
          and convert prospects on autopilot. Deployed in 30 days. You own everything.
        </p>
        <div class="hero__actions">
          <DButton variant="accent-pink" size="lg" @click="scrollTo('#contact')">
            Book a Call
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
