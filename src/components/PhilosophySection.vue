<template>
  <section id="philosophy" class="philosophy">
    <div class="section-wrapper">
      <div class="section-banner">
        <h2>AI YOU CAN TRUST WITH YOUR CUSTOMERS</h2>
      </div>
      <div class="section-card philosophy__card">
        <div class="two-col">
          <div class="philosophy__col">
            <h3>THE QUALITY GUARANTEE</h3>
            <p class="philosophy__intro">
              Most AI bots are "black boxes" that might say the wrong thing. Because of my background in
              high-stakes systems, I build Safety-First AI.
            </p>
            <ul>
              <li>
                <strong>Strict Quality Control</strong>
                Every automated conversation is monitored by a secondary system to ensure 100% accuracy.
              </li>
              <li>
                <strong>Brand Protection</strong>
                Your AI only uses your approved company information. No "hallucinations," no off-script promises.
              </li>
              <li>
                <strong>Performance Tracking</strong>
                You get a clear dashboard showing exactly how much revenue the system is generating in real-time.
              </li>
            </ul>
          </div>
          <div class="philosophy__col">
            <h3>I ONLY WIN IF YOU WIN</h3>
            <p>
              <strong>The 50/50 Split.</strong> You pay 50% to start. You don't pay the second half until
              the system is live and delivering results.
            </p>
            <p>
              <strong>The 14-Day Prototype.</strong> I will have a working version of your sales engine ready
              for review within two weeks, or I'll refund your deposit immediately. No fluff&mdash;just results.
            </p>
            <p>
              By day 14 you'll have seen your data flowing through a real system, not a slide deck.
              You're never more than two weeks and half the investment away from a clear go/no-go decision.
            </p>
            <p class="callout">
              If I can't show you found revenue in two weeks, you shouldn't pay me&mdash;and I don't want you to.
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

.philosophy__intro {
  margin-bottom: 1.5rem !important;
  opacity: 0.85;
}
</style>
