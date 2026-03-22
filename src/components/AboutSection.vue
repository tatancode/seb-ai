<template>
  <section id="about" class="about">
    <div class="section-wrapper">
      <div class="section-card about__card">
        <!-- Avatar -->
        <div class="about__avatar">
          <img src="/seb.png" alt="Seb" class="about__avatar-img" />
        </div>

        <h2>BUILT BY SOMEONE WHO SHIPS AI <span class="accent-pink">FOR A LIVING</span></h2>

        <p>
          Seb isn't an AI consultant who watched a course and started an agency. He's a software engineer
          who builds AI systems professionally — every day, for real users, at scale.
        </p>

        <p>
          By day, he builds AI-powered products at one of the largest personal finance brands in the country.
          His job is making AI answer real questions from real data without making things up.
          The same systems he builds at work are the ones he builds for clients.
        </p>

        <p>
          A decade of building software. Started in web development, moved into enterprise engineering,
          then quality engineering, then into building AI products from the ground up.
          Before tech, he worked in sales — so he thinks about <strong>revenue and outcomes</strong>, not just features.
        </p>

        <div class="about__highlight">
          <p>
            <strong>What that means for you:</strong> The person building your system does this at a company
            that serves millions of users. Your system gets built with the same rigor as enterprise software,
            not a weekend prototype.
          </p>
        </div>

        <p class="about__closer">
          This isn't a side hustle built on hype. It's a craft built on reps.
        </p>
      </div>
    </div>
  </section>
</template>

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
  margin: 2rem auto;
  max-width: 700px;
  box-shadow: var(--d-shadow-sm);
}

.about__highlight p {
  margin-bottom: 0;
}

.about__closer {
  text-align: center !important;
  font-weight: 700;
  font-size: 1.25rem;
  margin-top: 2rem !important;
  opacity: 0.85;
}
</style>
