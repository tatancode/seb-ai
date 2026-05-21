<template>
  <section id="about" class="about">
    <div class="section-wrapper">
      <div class="section-card about__card">
        <!-- Avatar -->
        <div class="about__avatar">
          <img src="/seb.png" alt="Sebastian" class="about__avatar-img" />
        </div>

        <h2>BUILT BY A SOFTWARE ENGINEER.<br/><span class="accent-pink">FOR ROOFERS.</span></h2>

        <p>
          I'm Sebastian&mdash;a software engineer who spent years building the kind of automated lead systems
          that big tech companies use to find customers.
        </p>

        <p>
          A few months ago I sat down with a solo roofer who told me he was paying Angi $1,400 a month
          and closing one job out of every thirty leads. And I realized something: <strong>the same systems
          that let big companies respond to leads in seconds are completely missing from local trades.</strong>
        </p>

        <p>
          So I built one. For roofers. From scratch. The Booked Roof Engine is the result.
        </p>

        <p>
          I'm not a marketing agency. I'm not selling you SEO or "brand strategy." I do <strong>one thing</strong>:
          make your phone ring with homeowners who want their roof inspected&mdash;exclusively to you, within 45 seconds.
        </p>

        <div class="about__highlight">
          <p>
            <strong>What that means for you:</strong> The person building your system does this at a company
            that serves millions of users where a wrong answer costs real money. Your engine gets built
            with the same rigor&mdash;not a weekend prototype.
          </p>
        </div>

        <!-- Proof / Testimonial placeholders -->
        <div class="about__proof">
          <h3>Real roofers. Real numbers.</h3>
          <p class="about__proof-sub">Pilot results from our first 3 customers&mdash;recorded on video.</p>
          <div class="about__testimonials">
            <div v-for="t in testimonials" :key="t.city" class="about__testimonial">
              <div class="about__testimonial-video">
                <span>{{ t.placeholder }}</span>
              </div>
              <p class="about__testimonial-quote">"{{ t.quote }}"</p>
              <p class="about__testimonial-name">&mdash; {{ t.name }}, {{ t.city }}</p>
              <p class="about__testimonial-company">{{ t.company }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    placeholder: 'Pilot in progress',
    quote: 'Case study coming soon.',
    name: 'Pilot Client #1',
    city: 'Tulsa, OK',
    company: 'Reserved',
  },
  {
    placeholder: 'Pilot in progress',
    quote: 'Case study coming soon.',
    name: 'Pilot Client #2',
    city: 'Wichita, KS',
    company: 'Reserved',
  },
  {
    placeholder: 'Pilot in progress',
    quote: 'Case study coming soon.',
    name: 'Pilot Client #3',
    city: 'Springfield, MO',
    company: 'Reserved',
  },
]
</script>

<style scoped>
.about__card {
  text-align: center;
}

.about__avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.about__avatar-img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid var(--d-accent-pink);
  box-shadow: var(--d-shadow-md);
  object-fit: cover;
}

.about__card h2 {
  margin-bottom: 2rem;
}

.about__card p {
  text-align: left;
  max-width: 700px;
  margin: 0 auto 1.25rem;
}

.about__highlight {
  background: var(--d-bg-primary);
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  padding: 1.5rem 2rem;
  margin: 2.5rem auto;
  max-width: 700px;
  box-shadow: var(--d-shadow-sm);
}

.about__highlight p {
  margin-bottom: 0;
}

/* Proof block */
.about__proof {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: var(--d-border-width-thick) dashed var(--d-border);
}

.about__proof > h3 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.about__proof-sub {
  text-align: center !important;
  max-width: none !important;
  opacity: 0.7;
  margin-bottom: 2.5rem !important;
}

.about__testimonials {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.about__testimonial {
  padding: 1.5rem;
  background: var(--d-bg-secondary);
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-sm);
  text-align: left;
}

.about__testimonial-video {
  aspect-ratio: 16 / 10;
  background: var(--d-bg-primary);
  border: 2px dashed var(--d-border);
  border-radius: var(--d-radius-sm);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.about__testimonial-quote {
  text-align: left !important;
  max-width: none !important;
  margin-bottom: 0.5rem !important;
  font-style: italic;
  font-size: 1rem;
}

.about__testimonial-name {
  text-align: left !important;
  max-width: none !important;
  margin-bottom: 0.1rem !important;
  font-weight: 700;
  font-size: 0.95rem;
}

.about__testimonial-company {
  text-align: left !important;
  max-width: none !important;
  margin-bottom: 0 !important;
  font-size: 0.85rem;
  opacity: 0.65;
}

@media (max-width: 1024px) {
  .about__testimonials {
    grid-template-columns: 1fr;
  }
}
</style>
