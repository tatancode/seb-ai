<template>
  <section id="contact" class="cta">
    <div class="section-wrapper">
      <div class="section-card cta__card">
        <h2>YOUR AI SYSTEM.<br/><span class="accent-pink">LIVE IN 30 DAYS.</span></h2>
        <p class="cta__sub">
          Book a free AI Automation Audit. We'll map your highest-ROI automation opportunities
          and show you exactly what we'd build -- no pitch decks, just a conversation.
        </p>
        <form
          class="cta__form"
          action="https://formspree.io/f/xkoqlwev"
          method="POST"
          @submit="handleSubmit"
        >
          <DInput
            v-model="email"
            type="email"
            name="email"
            placeholder="you@company.com"
            size="lg"
            :full-width="true"
            required
          />
          <DButton
            variant="accent-pink"
            size="lg"
            type="submit"
            :loading="submitting"
            :full-width="isMobile"
          >
            {{ submitted ? 'Sent!' : 'Get in Touch' }}
          </DButton>
        </form>
        <p v-if="submitted" class="cta__success">
          We got it. Expect to hear from us within 24 hours.
        </p>
        <p v-if="rateLimited" class="cta__rate-limit">
          You already submitted recently. We're on it.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { DButton } from '../dimensional-ui/components'
import { DInput } from '../dimensional-ui/components'

const email = ref('')
const submitting = ref(false)
const submitted = ref(false)
const rateLimited = ref(false)
const windowWidth = ref(1024)

const RATE_LIMIT_KEY = 'seb-ai-form-last-submit'
const RATE_LIMIT_MS = 60_000 // 1 minute between submissions

function isRateLimited(): boolean {
  const last = localStorage.getItem(RATE_LIMIT_KEY)
  if (!last) return false
  return Date.now() - parseInt(last, 10) < RATE_LIMIT_MS
}

function markSubmitted() {
  localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()))
}

const isMobile = computed(() => windowWidth.value <= 768)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (!email.value || submitted.value) return

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
      body: JSON.stringify({ email: email.value }),
    })

    if (response.ok) {
      markSubmitted()
      submitted.value = true
      email.value = ''
    }
  } catch {
    // Silent fail — form action attribute is the fallback
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.cta__card {
  background: var(--d-accent-yellow);
  text-align: center;
}

.cta__card h2 {
  margin-bottom: 1rem;
}

.cta__sub {
  max-width: 500px;
  margin: 0 auto 2rem;
  opacity: 0.85;
}

.cta__form {
  display: flex;
  gap: 1rem;
  max-width: 550px;
  margin: 0 auto;
  align-items: flex-start;
}

.cta__success {
  margin-top: 1rem;
  font-weight: 700;
  font-size: 1rem;
}

.cta__rate-limit {
  margin-top: 1rem;
  font-weight: 700;
  font-size: 1rem;
  color: var(--d-accent-pink);
}

@media (max-width: 768px) {
  .cta__form {
    flex-direction: column;
  }
}
</style>
