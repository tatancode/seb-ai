<template>
  <nav class="navbar">
    <div class="navbar__inner">
      <a href="#" class="navbar__logo">Seb AI</a>
      <div class="navbar__links" :class="{ 'navbar__links--open': menuOpen }">
        <a href="#services" @click="menuOpen = false">Services</a>
        <a href="#philosophy" @click="menuOpen = false">Philosophy</a>
        <a href="#contact" @click="menuOpen = false">Contact</a>
      </div>
      <DButton variant="accent-pink" size="sm" class="navbar__cta" @click="scrollTo('#contact')">
        Get Started
      </DButton>
      <button class="navbar__hamburger" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
        <span :class="{ 'open': menuOpen }"></span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DButton } from '../dimensional-ui/components'

const menuOpen = ref(false)

const scrollTo = (selector: string) => {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--d-bg-primary);
  border-bottom: var(--d-border-width-thick) solid var(--d-border);
  padding: 0 1.5rem;
}

.navbar__inner {
  max-width: var(--section-max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.navbar__logo {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  text-transform: uppercase;
  color: var(--d-text-primary);
  text-decoration: none;
}

.navbar__links {
  display: flex;
  gap: 2rem;
}

.navbar__links a {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--d-text-primary);
  text-decoration: none;
  transition: color 0.15s;
}

.navbar__links a:hover {
  color: var(--d-accent-pink);
}

.navbar__hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  position: relative;
}

.navbar__hamburger span,
.navbar__hamburger span::before,
.navbar__hamburger span::after {
  display: block;
  width: 24px;
  height: 3px;
  background: var(--d-text-primary);
  border-radius: 2px;
  transition: all 0.3s;
  position: absolute;
  left: 4px;
}

.navbar__hamburger span {
  top: 14px;
}

.navbar__hamburger span::before {
  content: '';
  top: -8px;
}

.navbar__hamburger span::after {
  content: '';
  top: 8px;
}

.navbar__hamburger span.open {
  background: transparent;
}

.navbar__hamburger span.open::before {
  top: 0;
  transform: rotate(45deg);
}

.navbar__hamburger span.open::after {
  top: 0;
  transform: rotate(-45deg);
}

@media (max-width: 768px) {
  .navbar__hamburger {
    display: block;
  }

  .navbar__cta {
    display: none;
  }

  .navbar__links {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--d-bg-primary);
    border-bottom: var(--d-border-width-thick) solid var(--d-border);
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
  }

  .navbar__links--open {
    display: flex;
  }
}
</style>
