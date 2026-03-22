<template>
  <section id="what" class="what">
    <div class="section-wrapper">
      <div class="section-card what__card">
        <h2>THE PROBLEM</h2>

        <p>
          Your team spends 20+ hours a week on work that should be automated. Answering the same customer
          questions. Manually prospecting leads. Writing content from scratch. Fielding calls that could
          be routed automatically.
        </p>

        <p>
          You've looked at AI solutions, but every vendor wants a six-month contract, charges enterprise
          prices, and delivers a demo that breaks the moment it touches real data.
        </p>

        <p class="callout">
          You don't need an "AI strategy." You need a working system, deployed in weeks, that your team
          actually uses every day.
        </p>

        <!-- Flow diagram -->
        <div class="what__flow">
          <div class="what__flow-item what__flow-item--yellow">
            <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
              <rect x="4" y="4" width="24" height="24" rx="4" stroke="#000" stroke-width="2" fill="#FFF455"/>
              <line x1="10" y1="12" x2="22" y2="12" stroke="#000" stroke-width="1.5"/>
              <line x1="10" y1="16" x2="22" y2="16" stroke="#000" stroke-width="1.5"/>
              <line x1="10" y1="20" x2="18" y2="20" stroke="#000" stroke-width="1.5"/>
            </svg>
            <span>Audit (Week 0)</span>
          </div>
          <div class="what__flow-arrow">
            <svg viewBox="0 0 40 24" width="40" height="24">
              <line x1="0" y1="12" x2="32" y2="12" stroke="#000" stroke-width="2.5"/>
              <polyline points="26,6 34,12 26,18" fill="none" stroke="#000" stroke-width="2.5" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="what__flow-item what__flow-item--pink">
            <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
              <circle cx="16" cy="16" r="12" stroke="#000" stroke-width="2" fill="#FF004D"/>
              <path d="M10 16 L14 16 L16 10 L18 22 L20 16 L24 16" stroke="#fff" stroke-width="2" fill="none" stroke-linejoin="round"/>
            </svg>
            <span>Build (Weeks 1-3)</span>
          </div>
          <div class="what__flow-arrow">
            <svg viewBox="0 0 40 24" width="40" height="24">
              <line x1="0" y1="12" x2="32" y2="12" stroke="#000" stroke-width="2.5"/>
              <polyline points="26,6 34,12 26,18" fill="none" stroke="#000" stroke-width="2.5" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="what__flow-item what__flow-item--white">
            <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
              <path d="M8 6 L24 6 L28 12 L24 18 L8 18 L4 12 Z" stroke="#000" stroke-width="2" fill="#fff"/>
              <path d="M12 10 L16 14 L22 8" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Adopt (Week 4)</span>
          </div>
        </div>

        <p class="what__footer-note">
          From audit to adoption in 30 days. No six-month roadmaps. No "AI strategy decks." Working software your team uses from day one.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.what__card {
  background: var(--d-bg-primary);
}

.what__card h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.what__card p {
  margin-bottom: 1.25rem;
}

.what__flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 3rem 0;
  flex-wrap: wrap;
}

.what__flow-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-md);
  font-weight: 700;
  font-size: 0.95rem;
  min-width: 150px;
}

.what__flow-item--yellow {
  background: var(--d-accent-yellow);
}

.what__flow-item--pink {
  background: var(--d-accent-pink);
  color: var(--d-bg-secondary);
}

.what__flow-item--white {
  background: var(--d-bg-secondary);
}

.what__flow-arrow {
  flex-shrink: 0;
}

.what__footer-note {
  text-align: center;
  font-style: italic;
  opacity: 0.75;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .what__flow {
    flex-direction: column;
  }

  .what__flow-arrow {
    transform: rotate(90deg);
  }
}
</style>
