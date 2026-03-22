<template>
  <section id="philosophy" class="philosophy">
    <div class="section-wrapper">
      <div class="section-banner">
        <h2>INCLUDED WITH EVERY ENGAGEMENT</h2>
      </div>
      <div class="section-card philosophy__card">
        <div class="two-col">
          <div class="philosophy__col">
            <h3>BONUSES</h3>
            <ul>
              <li>
                <strong>ROI Dashboard</strong>
                Real-time tracking of hours saved, tickets deflected, and leads generated. You see the math on your investment from week one.
              </li>
              <li>
                <strong>Hallucination Guardrails</strong>
                Citation-backed answers, confidence scoring, and automatic human escalation when the AI isn't sure. No fabricated answers reaching your customers.
              </li>
              <li>
                <strong>Modular Architecture</strong>
                Swap from OpenAI to Anthropic to open-source next year — no rebuild required. You own the code.
              </li>
              <li>
                <strong>90-Day Maintenance Window</strong>
                After launch, we monitor and maintain your systems for 90 days. Model updates, API changes, bug fixes — handled.
              </li>
            </ul>
          </div>
          <div class="philosophy__col">
            <h3>OUR GUARANTEE</h3>
            <p>
              We split every engagement 50/50. You pay half upfront, half on final delivery.
            </p>
            <p>
              <strong>If by the end of week 2 we haven't delivered a working prototype connected to your
              real data — something you can see, touch, and test — we refund your deposit in full.</strong>
              No questions. No friction.
            </p>
            <p>
              You're never more than 14 days and half the investment away from a clear go/no-go decision.
              By day 14 you'll have seen your data flowing through a real system, not a slide deck.
            </p>
            <p class="callout">
              If we can't show tangible progress in two weeks, you shouldn't pay us — and we don't want you to.
            </p>
          </div>
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

.philosophy__col h3 {
  margin-bottom: 1.5rem;
}

.philosophy__col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.philosophy__col li {
  font-size: 1.05rem;
  line-height: 1.65;
}

.philosophy__col li strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.philosophy__col p {
  margin-bottom: 1rem;
}
</style>
