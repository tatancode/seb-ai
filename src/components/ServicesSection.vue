<template>
  <section id="services" class="services">
    <div class="section-wrapper">
      <div class="section-banner">
        <h2>WHAT YOU GET</h2>
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
    title: 'AI Automation Audit',
    label: 'WEEK 0',
    description: '90-minute deep dive mapping your highest-cost repetitive processes to automation opportunities, ranked by ROI. You walk away with a prioritized roadmap even if you never hire us.',
    icon: '<svg viewBox="0 0 40 40" width="40" height="40" fill="none"><rect x="6" y="4" width="28" height="32" rx="3" stroke="#000" stroke-width="2" fill="#FFF455"/><line x1="12" y1="12" x2="28" y2="12" stroke="#000" stroke-width="1.5"/><line x1="12" y1="18" x2="28" y2="18" stroke="#000" stroke-width="1.5"/><line x1="12" y1="24" x2="22" y2="24" stroke="#000" stroke-width="1.5"/><path d="M12 30 L16 26 L20 30" stroke="#000" stroke-width="1.5" fill="none"/></svg>',
    highlight: false,
  },
  {
    title: 'Custom AI System Build',
    label: 'WEEKS 1-3',
    description: 'We build and deploy your chosen system — RAG chatbot, lead gen pipeline, content engine, or voice agent — production-ready, integrated with your tools, running on your infrastructure.',
    icon: '<svg viewBox="0 0 40 40" width="40" height="40" fill="none"><circle cx="20" cy="20" r="14" stroke="#000" stroke-width="2" fill="#FF004D"/><circle cx="20" cy="20" r="9" stroke="#000" stroke-width="1.5" fill="none"/><circle cx="20" cy="20" r="4" stroke="#000" stroke-width="1.5" fill="#fff"/><line x1="28" y1="12" x2="34" y2="6" stroke="#000" stroke-width="2"/><polygon points="34,6 34,11 29,6" fill="#000"/></svg>',
    highlight: true,
  },
  {
    title: 'Data Integration + RAG Pipeline',
    label: 'WEEK 1',
    description: 'We connect your scattered data sources — docs, CRM, helpdesk, wiki — into a clean, queryable pipeline. This is the foundation everything else runs on.',
    icon: '<svg viewBox="0 0 40 40" width="40" height="40" fill="none"><path d="M8 36V4h18l6 6v26H8z" stroke="#000" stroke-width="2" fill="#fff"/><polyline points="26,4 26,10 32,10" stroke="#000" stroke-width="1.5" fill="none"/><line x1="14" y1="18" x2="28" y2="18" stroke="#000" stroke-width="1.5"/><line x1="14" y1="24" x2="28" y2="24" stroke="#000" stroke-width="1.5"/><line x1="14" y1="30" x2="22" y2="30" stroke="#000" stroke-width="1.5"/><path d="M30 28 L36 22 L38 24 L32 30 Z" stroke="#000" stroke-width="1.5" fill="#FFF455"/></svg>',
    highlight: false,
  },
  {
    title: 'Adoption Sprint + Team Training',
    label: 'WEEK 4',
    description: 'Live training sessions for your team. Custom adoption playbook. Usage tracking dashboards. We don\'t leave until your people are actually using the system daily.',
    icon: '<svg viewBox="0 0 40 40" width="40" height="40" fill="none"><circle cx="20" cy="16" r="10" stroke="#000" stroke-width="2" fill="#FFF455"/><circle cx="16" cy="14" r="2" fill="#000"/><circle cx="24" cy="14" r="2" fill="#000"/><path d="M15 20 Q20 24 25 20" stroke="#000" stroke-width="1.5" fill="none"/><path d="M10 30 Q10 36 16 36 L24 36 Q30 36 30 30" stroke="#000" stroke-width="2" fill="none"/><line x1="20" y1="26" x2="20" y2="30" stroke="#000" stroke-width="2"/></svg>',
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
  grid-template-columns: 1fr 1fr;
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

@media (max-width: 768px) {
  .services__grid {
    grid-template-columns: 1fr;
  }
}
</style>
