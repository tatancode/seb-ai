<template>
  <section id="services" class="services">
    <div class="section-wrapper">
      <div class="section-banner">
        <h2>THE SERVICES</h2>
      </div>
      <div class="section-card services__card">
        <div class="services__grid">
          <div
            v-for="service in services"
            :key="service.title"
            class="services__item"
            :class="service.highlight ? 'services__item--highlight' : ''"
          >
            <div class="services__icon" v-html="service.icon"></div>
            <span v-if="service.label" class="services__label">{{ service.label }}</span>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const services = [
  {
    title: 'Instant-Response Engines',
    label: 'CAPTURE NEW LEADS',
    description: 'Turn web inquiries into booked appointments in under 60 seconds, 24 hours a day. Beat your competitors to every lead, every time.',
    icon: '<svg viewBox="0 0 40 40" width="40" height="40" fill="none"><circle cx="20" cy="20" r="16" stroke="#000" stroke-width="2" fill="#FFF455"/><path d="M20 10 V20 L26 24" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 6 L34 10" stroke="#000" stroke-width="2" stroke-linecap="round"/><path d="M10 6 L6 10" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>',
    highlight: true,
  },
  {
    title: 'Old-Lead Reactivation',
    label: 'RECOVER LOST REVENUE',
    description: 'Turn your "dead" CRM database into a fresh stream of sales calls without lifting a finger. Re-engage thousands of past leads at machine speed.',
    icon: '<svg viewBox="0 0 40 40" width="40" height="40" fill="none"><ellipse cx="20" cy="10" rx="14" ry="5" stroke="#000" stroke-width="2" fill="#FF004D"/><path d="M6 10 V30 C6 32.8 12.3 35 20 35 C27.7 35 34 32.8 34 30 V10" stroke="#000" stroke-width="2" fill="#FF004D"/><path d="M6 20 C6 22.8 12.3 25 20 25 C27.7 25 34 22.8 34 20" stroke="#000" stroke-width="2" fill="none"/><path d="M26 30 L30 26 M30 30 L26 26" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
    highlight: false,
  },
  {
    title: 'Sales System Audit',
    label: 'FIND THE LEAKS',
    description: 'I\'ll analyze your current process and show you exactly where the revenue leaks are happening. You walk away with a prioritized fix list, even if you never hire me.',
    icon: '<svg viewBox="0 0 40 40" width="40" height="40" fill="none"><circle cx="17" cy="17" r="11" stroke="#000" stroke-width="2" fill="#fff"/><line x1="25" y1="25" x2="34" y2="34" stroke="#000" stroke-width="3" stroke-linecap="round"/><line x1="12" y1="17" x2="22" y2="17" stroke="#000" stroke-width="1.5"/><line x1="17" y1="12" x2="17" y2="22" stroke="#000" stroke-width="1.5"/></svg>',
    highlight: false,
  },
]
</script>

<style scoped>
.services__card {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;
}

.services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.services__item {
  padding: 2rem;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-sm);
  background: var(--d-bg-secondary);
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
}

.services__item:hover {
  transform: translateY(-2px);
  box-shadow: var(--d-shadow-md);
}

.services__item--highlight {
  background: var(--d-accent-yellow);
}

.services__label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.6rem;
  border: 2px solid var(--d-border);
  border-radius: var(--d-radius-sm);
  margin-bottom: 0.5rem;
  background: var(--d-bg-primary);
}

.services__icon {
  margin-bottom: 1rem;
}

.services__item h3 {
  margin-bottom: 0.75rem;
}

.services__item p {
  font-size: 1rem;
  opacity: 0.85;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .services__grid {
    grid-template-columns: 1fr;
  }
}
</style>
