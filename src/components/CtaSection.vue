<template>
  <section id="contact" class="cta">
    <div class="section-wrapper">
      <!-- Guarantee Block -->
      <div class="cta__guarantee">
        <span class="cta__guarantee-tag">THE PHONE-RINGING GUARANTEE</span>
        <p class="cta__guarantee-headline">
          You pay us $0 for 30 days. You cover $500 of ad spend, that's it.
        </p>
        <p>
          If we don't deliver at least <strong>10 qualified roof inspections</strong> in your first 30 days,
          you owe us nothing. Not now, not ever. And you keep the landing page.
        </p>
        <p>
          All we ask in return: a 60-second video testimonial if it works. That's the deal.
        </p>
        <p class="cta__guarantee-footnote">
          Pilot reserved for the first 3 roofers per metro. After that, the program moves to a paid retainer.
        </p>
      </div>

      <!-- Application Form -->
      <div class="section-card cta__card">
        <h2>READY TO FILL<br/><span class="accent-pink">YOUR CALENDAR?</span></h2>
        <p class="cta__sub">
          Apply below. We'll review and get back to you within 24 hours. If you're a fit for the pilot,
          we can have ads live in 5 days.
        </p>

        <form
          class="cta__form"
          action="https://formspree.io/f/xkoqlwev"
          method="POST"
          @submit="handleSubmit"
        >
          <input type="hidden" name="offer" value="booked-roof-engine" />

          <div class="cta__field-row">
            <DInput
              v-model="formData.name"
              type="text"
              name="name"
              placeholder="Your name"
              size="lg"
              :full-width="true"
              required
            />
            <DInput
              v-model="formData.phone"
              type="tel"
              name="phone"
              placeholder="Phone number"
              size="lg"
              :full-width="true"
              required
            />
          </div>

          <DInput
            v-model="formData.email"
            type="email"
            name="email"
            placeholder="you@yourcompany.com"
            size="lg"
            :full-width="true"
            required
          />

          <div class="cta__field-row">
            <DInput
              v-model="formData.company"
              type="text"
              name="company"
              placeholder="Company name"
              size="lg"
              :full-width="true"
              required
            />
            <DInput
              v-model="formData.city"
              type="text"
              name="city"
              placeholder="City / metro"
              size="lg"
              :full-width="true"
              required
            />
          </div>

          <DInput
            v-model="formData.years"
            type="text"
            name="years"
            placeholder="How many years have you been roofing?"
            size="lg"
            :full-width="true"
          />

          <textarea
            v-model="formData.problem"
            name="problem"
            placeholder="What's your biggest lead-flow problem right now?"
            class="cta__textarea"
            rows="4"
          ></textarea>

          <DButton
            variant="accent-pink"
            size="lg"
            type="submit"
            :loading="submitting"
            :full-width="true"
          >
            {{ submitted ? 'Application sent!' : 'Apply For The Pilot' }}
          </DButton>
          <p class="cta__form-note">
            We only respond to roofers in our target metros. If you're a fit, you'll hear back within 24 hours.
          </p>
        </form>

        <p v-if="submitted" class="cta__success">
          Got it. Expect to hear from me within 24 hours.
        </p>
        <p v-if="rateLimited" class="cta__rate-limit">
          You already submitted recently. I'm on it.
        </p>
      </div>

      <!-- FAQ Section -->
      <div class="section-card cta__faq">
        <h3>Questions roofers always ask.</h3>

        <div v-for="(faq, idx) in faqs" :key="idx" class="cta__faq-item">
          <button class="cta__faq-q" @click="toggleFaq(idx)">
            <span>{{ faq.q }}</span>
            <span class="cta__faq-icon" :class="{ 'cta__faq-icon--open': openFaq === idx }">+</span>
          </button>
          <div v-show="openFaq === idx" class="cta__faq-a">
            <p v-html="faq.a"></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { DButton } from '../dimensional-ui/components'
import { DInput } from '../dimensional-ui/components'

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  company: '',
  city: '',
  years: '',
  problem: '',
})

const submitting = ref(false)
const submitted = ref(false)
const rateLimited = ref(false)
const openFaq = ref<number | null>(0)

const RATE_LIMIT_KEY = 'seb-ai-form-last-submit'
const RATE_LIMIT_MS = 60_000

function isRateLimited(): boolean {
  const last = localStorage.getItem(RATE_LIMIT_KEY)
  if (!last) return false
  return Date.now() - parseInt(last, 10) < RATE_LIMIT_MS
}

function markSubmitted() {
  localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()))
}

const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (!formData.email || submitted.value) return

  if (isRateLimited()) {
    rateLimited.value = true
    return
  }

  submitting.value = true

  try {
    const response = await fetch('https://formspree.io/f/xkoqlwev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ ...formData, offer: 'booked-roof-engine' }),
    })

    if (response.ok) {
      markSubmitted()
      submitted.value = true
      formData.name = ''
      formData.phone = ''
      formData.email = ''
      formData.company = ''
      formData.city = ''
      formData.years = ''
      formData.problem = ''
    }
  } catch {
    // Silent fail — form action attribute is the fallback
  } finally {
    submitting.value = false
  }
}

const faqs = [
  {
    q: 'How much does it cost after the 30-day pilot?',
    a: 'Pilot graduates get founder pricing locked in: <strong>$2,000/month for 6 months</strong> (regular retainer is $2,500). Plus $1,000&ndash;$2,500/month in ad spend that goes directly to Meta&mdash;never to us. No markup, no hidden fees.',
  },
  {
    q: "What if I'm already paying for Angi or HomeAdvisor?",
    a: 'Most of our roofers cut their Angi spend in half by Month 2 and drop it entirely by Month 4. Why pay $150 per shared lead when you can get exclusive booked inspections at a fraction of that cost-per-acquisition?',
  },
  {
    q: 'How is this different from running my own Facebook ads?',
    a: "Ads alone don't do it. You need the right ad copy + the right landing page + a 45-second text response + qualification + calendar booking. Miss any one of those and the math breaks. We do the full loop&mdash;and we've already tested it.",
  },
  {
    q: "I've been burned by a marketing agency before. Why is this different?",
    a: "That's exactly why the first 30 days are free. We don't get paid until your phone rings. And if it doesn't ring, we work for free until it does&mdash;that's our post-pilot guarantee.",
  },
  {
    q: 'What if another roofer in my town signs up first?',
    a: 'They get the exclusivity. We only work with one roofer per metro&mdash;first to apply gets the spot.',
  },
  {
    q: 'Do I need a website, a CRM, or any special software?',
    a: 'No. We build the landing page, we run the text responder, we connect to whatever calendar app you already use (Google Calendar, Apple Calendar, anything). You just need a phone that gets texts.',
  },
  {
    q: 'How fast can ads go live?',
    a: '5 business days from signed agreement. Day 1&ndash;3 is setup. Day 4 ads launch. First booked inspections usually arrive Day 5&ndash;10.',
  },
  {
    q: 'What metros are you taking on right now?',
    a: "We're actively onboarding pilots in <strong>Tulsa, Oklahoma City, Wichita, Springfield (MO), and Greensboro (NC)</strong>. If you're in another metro, apply anyway&mdash;we open new metros every month.",
  },
  {
    q: 'Do I have to pay you the $500 ad spend?',
    a: 'No. The $500 goes directly to Meta (Facebook) via your own ad account. We never touch it. You can pause or scale it anytime.',
  },
]
</script>

<style scoped>
/* Guarantee block */
.cta__guarantee {
  background: var(--d-accent-yellow);
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-md);
  padding: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.cta__guarantee-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 0.35rem 0.85rem;
  background: var(--d-bg-primary);
  color: var(--d-text-primary);
  border: 2px solid var(--d-border);
  border-radius: var(--d-radius-sm);
  margin-bottom: 1.25rem;
}

.cta__guarantee-headline {
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  line-height: 1.25;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
}

.cta__guarantee p {
  max-width: 640px;
  margin: 0 auto 1rem;
  font-size: 1.05rem;
  line-height: 1.55;
}

.cta__guarantee-footnote {
  font-size: 0.9rem !important;
  font-style: italic;
  opacity: 0.7;
  margin-top: 1.5rem !important;
}

/* Form card */
.cta__card {
  text-align: center;
}

.cta__card h2 {
  margin-bottom: 1rem;
}

.cta__sub {
  max-width: 560px;
  margin: 0 auto 2.5rem;
  opacity: 0.85;
}

.cta__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 640px;
  margin: 0 auto;
}

.cta__field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.cta__textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 1rem;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-sm);
  background: var(--d-bg-secondary);
  box-shadow: var(--d-shadow-sm);
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box;
}

.cta__textarea:focus {
  outline: none;
  box-shadow: var(--d-shadow-md);
}

.cta__form-note {
  font-size: 0.85rem;
  opacity: 0.65;
  margin-top: 0.75rem;
  font-style: italic;
}

.cta__success {
  margin-top: 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  color: var(--d-text-primary);
}

.cta__rate-limit {
  margin-top: 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  color: var(--d-accent-pink);
}

/* FAQ */
.cta__faq {
  margin-top: 2rem;
}

.cta__faq h3 {
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 2rem;
}

.cta__faq-item {
  border-top: 2px solid var(--d-border);
}

.cta__faq-item:last-child {
  border-bottom: 2px solid var(--d-border);
}

.cta__faq-q {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.25rem 0.5rem;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--d-text-primary);
}

.cta__faq-q:hover {
  color: var(--d-accent-pink);
}

.cta__faq-icon {
  font-size: 1.5rem;
  font-weight: 900;
  transition: transform 0.2s;
  flex-shrink: 0;
  margin-left: 1rem;
  color: var(--d-accent-pink);
}

.cta__faq-icon--open {
  transform: rotate(45deg);
}

.cta__faq-a {
  padding: 0 0.5rem 1.25rem;
}

.cta__faq-a p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.85;
}

@media (max-width: 768px) {
  .cta__field-row {
    grid-template-columns: 1fr;
  }
  .cta__guarantee {
    padding: 1.75rem 1.25rem;
  }
}
</style>
