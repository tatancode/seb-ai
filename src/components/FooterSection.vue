<template>
  <footer class="footer">
    <div class="footer__inner">
      <span class="footer__logo">Seb AI</span>
      <span class="footer__copy">&copy; 2026 Seb AI. All rights reserved.</span>
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
}

.footer__logo {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  text-transform: uppercase;
}

.footer__copy {
  font-size: 0.875rem;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .footer__inner {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
