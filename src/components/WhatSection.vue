<template>
  <section id="what" class="what">
    <div class="section-wrapper">
      <div class="section-card what__card">
        <h2>YOUR SALES TEAM HAS A<br/><span class="accent-pink">CAPACITY PROBLEM.</span></h2>

        <p>
          It's not their fault&mdash;they can't be awake 24/7, and they can't call 500 old leads in a single
          afternoon. You are currently losing money in two specific places.
        </p>

        <!-- Money leaks -->
        <div class="what__leaks">
          <div class="what__leak what__leak--pink">
            <div class="what__leak-icon">
              <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
                <circle cx="16" cy="16" r="13" stroke="#000" stroke-width="2" fill="#FFF455"/>
                <path d="M16 8 V16 L21 19" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>The 5-Minute Window</h3>
            <p>
              If you don't respond to a new lead instantly, they move on to your competitor. Speed is the
              difference between a booked call and a lost sale.
            </p>
          </div>
          <div class="what__leak what__leak--yellow">
            <div class="what__leak-icon">
              <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
                <ellipse cx="16" cy="8" rx="11" ry="4" stroke="#000" stroke-width="2" fill="#FF004D"/>
                <path d="M5 8 V24 C5 26.2 9.9 28 16 28 C22.1 28 27 26.2 27 24 V8" stroke="#000" stroke-width="2" fill="#FF004D"/>
                <path d="M5 16 C5 18.2 9.9 20 16 20 C22.1 20 27 18.2 27 16" stroke="#000" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <h3>The "Forgotten" Database</h3>
            <p>
              Thousands of dollars in past leads are sitting in your system. My AI systems "re-mine" that
              gold for you automatically.
            </p>
          </div>
        </div>

        <p class="what__footer-note">
          Every hour these leaks stay open is revenue walking out the door. Plugging them is the fastest path to growth&mdash;same team, same marketing spend, more closed deals.
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

.what__leaks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 3rem 0 2rem;
}

.what__leak {
  padding: 2rem;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-md);
  background: var(--d-bg-secondary);
}

.what__leak--pink {
  background: var(--d-accent-pink);
  color: var(--d-bg-secondary);
}

.what__leak--yellow {
  background: var(--d-accent-yellow);
}

.what__leak-icon {
  margin-bottom: 1rem;
}

.what__leak h3 {
  margin-bottom: 0.75rem;
}

.what__leak p {
  margin-bottom: 0;
  font-size: 1rem;
  line-height: 1.6;
}

.what__footer-note {
  text-align: center;
  font-style: italic;
  opacity: 0.75;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .what__leaks {
    grid-template-columns: 1fr;
  }
}
</style>
