<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <span class="footer__logo">Booked Roof Engine</span>
        <span class="footer__tagline">Booked roof inspections. Exclusive to you. In under 45 seconds.</span>
      </div>
      <span class="footer__copy">
        &copy; 2026 Booked Roof Engine. All rights reserved.
      </span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  z-index: 1;
  border-top: var(--d-border-width-thick) solid var(--d-border);
  padding: 2rem 1.5rem;
  margin-top: var(--section-spacing);
}

.footer__inner {
  max-width: var(--section-max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer__logo {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  text-transform: uppercase;
}

.footer__tagline {
  font-size: 0.85rem;
  opacity: 0.65;
  font-style: italic;
}

.footer__copy {
  font-size: 0.85rem;
  opacity: 0.6;
  text-align: right;
}

@media (max-width: 768px) {
  .footer__inner {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .footer__copy {
    text-align: center;
  }
}
</style>
