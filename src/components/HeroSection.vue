<template>
  <section class="hero">
    <div class="section-wrapper">

      <div class="section-card hero__card">
        <p class="hero__eyebrow">For solo roofers tired of paying for shared leads.</p>
        <h1>WAKE UP MONDAY TO A<br/>CALENDAR FULL OF<br/><span class="accent-pink">BOOKED INSPECTIONS.</span></h1>
        <p class="hero__sub">
          The done-for-you system that fills your week with <strong>exclusive</strong> roof inspection appointments&mdash;replied
          to in <strong>under 45 seconds</strong>, 24/7. No door-knocking. No Angi. One roofer per metro.
        </p>
        <div class="hero__actions">
          <DButton variant="accent-pink" size="lg" @click="scrollTo('#contact')">
            Apply For The 30-Day Pilot
          </DButton>
          <DButton variant="secondary" size="lg" @click="scrollTo('#what')">
            How It Works
          </DButton>
        </div>
        <p class="hero__subtext">
          First 3 roofers in your metro run it free. You only cover $500 of ad spend.
        </p>
        <ul class="hero__trust">
          <li>Exclusive to one roofer per metro</li>
          <li>45-second response, 24/7</li>
          <li>Pay nothing if it doesn't book inspections</li>
        </ul>
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

.hero__card {
  text-align: center;
  padding-top: clamp(3rem, 5vw, 5rem);
}

.hero__eyebrow {
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1.5rem;
  opacity: 0.75;
}

.hero__sub {
  max-width: 640px;
  margin: 1.5rem auto;
  color: var(--d-text-primary);
  opacity: 0.9;
  font-size: 1.15rem;
  line-height: 1.6;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.hero__subtext {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  opacity: 0.7;
  font-style: italic;
}

.hero__trust {
  list-style: none;
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  padding: 0;
}

.hero__trust li {
  font-size: 0.95rem;
  font-weight: 600;
  position: relative;
  padding-left: 1.5rem;
}

.hero__trust li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--d-accent-pink);
  font-weight: 900;
}

@media (max-width: 768px) {
  .hero {
    padding-top: 48px;
  }

  .hero__actions {
    flex-direction: column;
    align-items: center;
  }

  .hero__trust {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
    max-width: 280px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
