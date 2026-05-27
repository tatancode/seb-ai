<template>
  <section id="services" class="services">
    <div class="section-wrapper">
      <div class="section-banner">
        <h2>THE BOOKED ROOF ENGINE</h2>
      </div>
      <div class="section-card services__card">
        <p class="services__intro">
          A complete, done-for-you system that turns your zip code into a stream of booked roof inspections.
          Here's how it works:
        </p>

        <!-- How It Works: 4 steps -->
        <div class="services__steps">
          <div v-for="(step, idx) in steps" :key="step.title" class="services__step">
            <div class="services__step-num">{{ idx + 1 }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>

        <!-- Value Stack -->
        <div class="services__stack-header">
          <h3>Everything You Get When You Sign Up</h3>
        </div>
        <div class="services__grid">
          <div
            v-for="item in stack"
            :key="item.title"
            class="services__item"
          >
            <div class="services__check">✓</div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>

        <!-- Bonuses -->
        <div class="services__bonuses">
          <h3>Plus 3 Bonuses</h3>
          <div class="services__bonus-grid">
            <div v-for="bonus in bonuses" :key="bonus.title" class="services__bonus">
              <span class="services__bonus-tag">BONUS</span>
              <h4>{{ bonus.title }}</h4>
              <p>{{ bonus.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'We Run The Ads',
    description: 'A pre-tested ad library to homeowners in your service area. Storm-damage angles. Aged-roof angles. Whatever fits your market that week.',
  },
  {
    title: 'They Land On Your Page',
    description: 'A clean, mobile-first page with your name, your photo, and your license number. Not ours. Not Angi\'s. Yours.',
  },
  {
    title: 'We Text Them In 45 Seconds',
    description: 'The moment they submit, our system texts them within 45 seconds. Asks 3 qualifying questions. Confirms they own the home and it\'s in your area.',
  },
  {
    title: 'They Book Themselves',
    description: 'Qualified leads pick a time slot. It drops straight onto your calendar. Your phone buzzes with the address. You show up to the roof.',
  },
]

const stack = [
  {
    title: 'Storm & Aged-Roof Ad Library',
    description: '3 pre-tested ad creatives in your service area, refreshed monthly. No more guessing what to run.',
  },
  {
    title: 'Branded Lead-Capture Page',
    description: 'Mobile-first, single purpose: turn clicks into booked inspections. Your name. Your photo. Your license.',
  },
  {
    title: '45-Second Text Responder',
    description: 'Every lead gets a personal text within 45 seconds. 24 hours. 7 days. Including 11pm Saturday.',
  },
  {
    title: '3-Question Qualifier',
    description: 'Filters out renters, tire-kickers, and out-of-area requests before they hit your calendar.',
  },
  {
    title: 'Direct Calendar Booking',
    description: 'Qualified leads pick a time slot. Drops straight onto your phone\'s calendar.',
  },
  {
    title: 'Owner Mobile Alerts',
    description: 'Every booked inspection pings your phone with the address and the issue.',
  },
  {
    title: 'Storm-Trigger Ad Boost',
    description: 'When NOAA reports hail or wind in your area, our system auto-launches storm-damage ads within 24 hours.',
  },
  {
    title: 'Weekly Plain-English Report',
    description: '"This week you got 7 inspections booked, 6 showed up." No jargon. No dashboards you\'ll never log into.',
  },
  {
    title: 'Monthly Strategy Call',
    description: '30 minutes with us. What\'s working, what to change, what\'s next.',
  },
]

const bonuses = [
  {
    title: 'After-Hours Auto-Responder',
    description: 'The lead who fills out the form at 9pm Saturday gets the same 45-second response as the one who fills it out Tuesday at noon.',
  },
  {
    title: 'Inspection-to-Close Playbook',
    description: 'The 5-message follow-up sequence and 3 voicemails that get callbacks. So a qualified inspection actually becomes a closed roof.',
  },
  {
    title: 'Geographic Exclusivity',
    description: 'One roofer per metro. Once you\'re in, your competition is locked out.',
  },
]
</script>

<style scoped>
.services__card {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;
}

.services__intro {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
  opacity: 0.85;
}

/* How It Works */
.services__steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.services__step {
  padding: 1.75rem 1.5rem;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-sm);
  background: var(--d-bg-secondary);
  position: relative;
}

.services__step-num {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--d-accent-pink);
  color: var(--d-bg-secondary);
  border: var(--d-border-width-thick) solid var(--d-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: var(--d-shadow-sm);
}

.services__step h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.services__step p {
  font-size: 0.95rem;
  opacity: 0.85;
  line-height: 1.55;
}

/* Value Stack */
.services__stack-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 1rem;
  border-top: var(--d-border-width-thick) dashed var(--d-border);
}

.services__stack-header h3 {
  font-size: 1.75rem;
}

.services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.services__item {
  padding: 1.5rem;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-sm);
  background: var(--d-bg-secondary);
}

.services__check {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--d-accent-yellow);
  border: 2px solid var(--d-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.services__item h4 {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.services__item p {
  font-size: 0.95rem;
  opacity: 0.85;
  line-height: 1.55;
}

/* Bonuses */
.services__bonuses {
  margin-top: 4rem;
  padding: 2.5rem;
  background: var(--d-accent-yellow);
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-md);
}

.services__bonuses > h3 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.75rem;
}

.services__bonus-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.services__bonus {
  padding: 1.5rem;
  background: var(--d-bg-secondary);
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-sm);
}

.services__bonus-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.6rem;
  background: var(--d-accent-pink);
  color: var(--d-bg-secondary);
  border: 2px solid var(--d-border);
  border-radius: var(--d-radius-sm);
  margin-bottom: 0.75rem;
}

.services__bonus h4 {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.services__bonus p {
  font-size: 0.95rem;
  opacity: 0.85;
  line-height: 1.55;
}

@media (max-width: 1024px) {
  .services__steps {
    grid-template-columns: repeat(2, 1fr);
  }
  .services__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .services__bonus-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .services__steps {
    grid-template-columns: 1fr;
  }
  .services__grid {
    grid-template-columns: 1fr;
  }
}
</style>
