<template>
  <section id="what" class="what">
    <div class="section-wrapper">
      <div class="section-card what__card">
        <h2>YOU'RE A ROOFER,<br/><span class="accent-pink">NOT A MARKETER.</span></h2>
        <p class="what__sub">Stop trying to be one.</p>

        <p>
          You started this company because you're great at roofs. Not because you wanted to spend Sunday
          night writing Facebook ads, refreshing Angi for leads, and door-knocking after every storm.
        </p>

        <p>
          But here you are. Paying $150 a pop for leads that already went to four other guys. Watching
          every storm chaser from Texas roll into your zip code and steal your jobs. Working 70-hour weeks
          and making less than your installer.
        </p>

        <p>
          And the worst part? You <strong>know</strong> the work is there. You can see it on every aging
          roof on every street. You just can't get the homeowner to call <strong>you</strong>.
        </p>

        <!-- Pain bullets -->
        <div class="what__pains">
          <div class="what__pain what__pain--pink">
            <p>"My phone hasn't rung in two weeks."</p>
          </div>
          <div class="what__pain what__pain--yellow">
            <p>"I closed 1 out of 30 Angi leads last month."</p>
          </div>
          <div class="what__pain what__pain--yellow">
            <p>"Every storm chaser is stealing jobs in my zip code."</p>
          </div>
          <div class="what__pain what__pain--pink">
            <p>"I need two full retails this month or I'm laying someone off."</p>
          </div>
        </div>

        <p class="what__footer-note">
          There's a fix. And it has nothing to do with you becoming a marketer.
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
  margin-bottom: 0.75rem;
}

.what__sub {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 2.5rem !important;
  opacity: 0.75;
}

.what__card p {
  margin-bottom: 1.25rem;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.what__pains {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 3rem 0 2rem;
}

.what__pain {
  padding: 1.75rem 2rem;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-md);
}

.what__pain--pink {
  background: var(--d-accent-pink);
  color: var(--d-bg-secondary);
}

.what__pain--yellow {
  background: var(--d-accent-yellow);
}

.what__pain p {
  margin: 0 !important;
  max-width: none !important;
  font-size: 1.15rem;
  font-weight: 700;
  font-style: italic;
  line-height: 1.4;
}

.what__footer-note {
  text-align: center;
  font-style: italic;
  font-weight: 700;
  font-size: 1.15rem;
  opacity: 0.85;
  margin-top: 1.5rem !important;
}

@media (max-width: 768px) {
  .what__pains {
    grid-template-columns: 1fr;
  }
}
</style>
