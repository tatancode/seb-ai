<script setup lang="ts">
import NavbarSection from './components/NavbarSection.vue'
import HeroSection from './components/HeroSection.vue'
import WhatSection from './components/WhatSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import PhilosophySection from './components/PhilosophySection.vue'
import AboutSection from './components/AboutSection.vue'
import CtaSection from './components/CtaSection.vue'
import FooterSection from './components/FooterSection.vue'
import GeometricBg from './components/GeometricBg.vue'
</script>

<template>
  <GeometricBg />
  <NavbarSection />
  <main>
    <HeroSection />
    <WhatSection />
    <ServicesSection />
    <PhilosophySection />
    <AboutSection />
    <CtaSection />
  </main>
  <FooterSection />
</template>

<style>
#app {
  min-height: 100vh;
}
</style>
