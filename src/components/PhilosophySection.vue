<template>
  <section id="philosophy" class="philosophy">
    <div class="section-wrapper">
      <div class="section-banner">
        <h2>WHY THIS BEATS EVERY ANGI LEAD YOU'VE EVER BOUGHT</h2>
      </div>
      <div class="section-card philosophy__card">
        <p class="philosophy__intro">
          Other agencies sell you "leads." We sell you booked inspections on your calendar.
          There's a difference. Here's why this works.
        </p>

        <div class="philosophy__cards">
          <div class="philosophy__compare philosophy__compare--pink">
            <div class="philosophy__compare-num">01</div>
            <h3>Exclusive,<br/>Not Shared</h3>
            <p class="philosophy__compare-lead">
              Your last Angi lead went to 4 other guys. This one won't.
            </p>
            <p>
              Angi, HomeAdvisor, CraftJack&mdash;every lead you buy from them is sold to multiple roofers.
              You're racing four other guys to the phone, and three of you are wasting your time.
            </p>
            <p>
              We only work with <strong>one roofer per metro</strong>. Every lead is yours alone.
            </p>
          </div>

          <div class="philosophy__compare philosophy__compare--yellow">
            <div class="philosophy__compare-num">02</div>
            <h3>45 Seconds,<br/>Not 45 Minutes</h3>
            <p class="philosophy__compare-lead">
              The first roofer to respond wins the job.
            </p>
            <p>
              Studies show responding to a lead within 5 minutes makes you <strong>9x more likely to close it.</strong>
              Most roofers respond in hours&mdash;if at all. You're on a roof. You can't pick up.
            </p>
            <p>
              We text every lead in <strong>under 45 seconds</strong>, day or night, weekend or not. By the time you
              climb down, the inspection is already on your calendar.
            </p>
          </div>

          <div class="philosophy__compare philosophy__compare--white">
            <div class="philosophy__compare-num">03</div>
            <h3>Booked Inspections,<br/>Not "Leads"</h3>
            <p class="philosophy__compare-lead">
              The only metric that pays your bills.
            </p>
            <p>
              A "lead" is a name. A booked inspection is a homeowner who said yes, picked a time,
              and is waiting for you at their house.
            </p>
            <p>
              That's what we deliver. And that's what we measure. Not impressions. Not clicks.
              Not "leads." Booked. Inspections.
            </p>
          </div>
        </div>

        <div class="philosophy__closer">
          <h3>"What about the storm chasers from Texas?"</h3>
          <p>
            Every storm season, out-of-state crews flood your market with door-knockers. They get jobs
            because they're first to the homeowner.
          </p>
          <p>
            The Booked Roof Engine puts <strong>you</strong> first&mdash;on the homeowner's phone, in their
            text messages, on their calendar&mdash;before a single boot hits their porch.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.philosophy__card {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;
}

.philosophy__intro {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
  opacity: 0.85;
}

.philosophy__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.philosophy__compare {
  padding: 2rem;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-md);
  position: relative;
}

.philosophy__compare--pink {
  background: var(--d-accent-pink);
  color: var(--d-bg-secondary);
}

.philosophy__compare--yellow {
  background: var(--d-accent-yellow);
}

.philosophy__compare--white {
  background: var(--d-bg-secondary);
}

.philosophy__compare-num {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  opacity: 0.6;
}

.philosophy__compare h3 {
  margin-bottom: 1rem;
  font-size: 1.4rem;
  line-height: 1.15;
}

.philosophy__compare-lead {
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 1rem !important;
}

.philosophy__compare p {
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.55;
}

.philosophy__compare p:last-child {
  margin-bottom: 0;
}

.philosophy__closer {
  margin-top: 3rem;
  padding: 2rem 2.5rem;
  background: var(--d-bg-primary);
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-sm);
}

.philosophy__closer h3 {
  margin-bottom: 1rem;
  font-size: 1.4rem;
}

.philosophy__closer p {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  line-height: 1.6;
}

.philosophy__closer p:last-child {
  margin-bottom: 0;
}

@media (max-width: 1024px) {
  .philosophy__cards {
    grid-template-columns: 1fr;
  }
}
</style>
