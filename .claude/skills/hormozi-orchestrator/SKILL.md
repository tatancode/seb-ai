---
name: hormozi-orchestrator
description: Route a business/offer/marketing request to the right Hormozi skill. Use when the user has a vague goal ("help me with my offer", "my business isn't working", "I want to launch X"), is unsure where to start, or needs multiple skills in sequence. Diagnoses where they are in the offer journey and hands off to market-research, hormozi-offer, pricing-strategy, landing-page-copy, or audit-offer.
---

# Skill: Hormozi Orchestrator (Router)

## Purpose
Pick the right Hormozi skill — or sequence of skills — for the user's situation.

This skill:
- diagnoses where the user is stuck
- maps the request to the correct skill
- runs skills in the right order
- prevents jumping to the wrong step (e.g. building an offer before validating the market)

Goal: turn vague business asks into a clear, ordered plan using the existing skill set.

---

## When to Use
Activate this skill when the user says things like:
- "help me with my business"
- "I want to launch X"
- "my offer isn't working"
- "I don't know where to start"
- "I need a landing page" (but no offer yet)
- "I have an idea but no customers"
- "I want to charge more"
- "fix my funnel"
- anything that touches market, offer, pricing, page, or audit

---

## Available Skills

| Skill | Purpose | Output |
|---|---|---|
| `market-research` | Find niche, extract pain, validate demand | `MARKET_RESEARCH.md` |
| `hormozi-offer` | Build a Grand Slam Offer | `OFFER.md` |
| `pricing-strategy` | Anchor price to value, build tiers | `PRICING.md` |
| `landing-page-copy` | Write a Hormozi-style sales page | `LANDING_PAGE.md` |
| `audit-offer` | Diagnose a weak existing offer | `OFFER_AUDIT.md` |

---

## Assistant Behavior

### 1. Diagnose the stage
Place the user on this map:

```
IDEA → MARKET → OFFER → PRICE → PAGE → LIVE → (low conversions) → AUDIT
```

Ask only what's needed to locate them. Examples:
- "Do you already have a target customer in mind?"
- "Is the offer defined, or just the idea?"
- "Is it live yet? Any traffic or sales?"

Do not ask everything at once.

---

### 2. Detect the entry point

Use these signals:

**Route to `market-research` when:**
- no clear audience
- audience sounds like "everyone"
- no proof anyone wants this
- user has skill/expertise but no niche
- user says "who should I target?"

**Route to `hormozi-offer` when:**
- audience is clear
- no defined offer yet
- offer exists but is vague ("I help people grow")
- user says "what should I sell?" or "build me an offer"

**Route to `pricing-strategy` when:**
- offer exists
- price feels random, too low, or too high
- user wants tiers
- price resistance is the main blocker

**Route to `landing-page-copy` when:**
- offer + price are set
- user needs a sales page or landing page
- messaging exists but is scattered

**Route to `audit-offer` when:**
- offer is live
- conversions are low
- "something feels off"
- user wants a diagnosis, not a rebuild

---

### 3. Handle multi-step requests

If the user needs more than one skill, sequence them.

Default order:
1. `market-research`
2. `hormozi-offer`
3. `pricing-strategy`
4. `landing-page-copy`
5. `audit-offer` (after launch, if needed)

Skip steps the user has already completed.

State the plan before running:
> "You're at stage X. I'll run skill A first to produce file B, then skill C to produce file D."

---

### 4. Detect skipped steps

Common mistakes to catch:

- wants a landing page but has no offer → run `hormozi-offer` first
- wants an offer but has no validated audience → run `market-research` first
- wants to raise price but offer value is weak → run `audit-offer` or revisit `hormozi-offer`
- offer "isn't converting" but never validated demand → run `market-research` before rebuilding

Tell the user clearly:
> "Before [requested skill], we should run [prerequisite skill] because [reason]."

---

### 5. Hand off cleanly

When routing, do not re-do the work of the target skill. Just:
- state which skill is taking over
- summarize what input it has
- start that skill's flow

Example:
> "Routing to `hormozi-offer`. You have a validated niche (busy dads, 35+, want to lose 15 lbs without giving up dinner). Starting with avatar and dream outcome."

---

### 6. Reuse outputs across skills

Each skill produces a markdown file. Pass them forward:
- `MARKET_RESEARCH.md` → input to `hormozi-offer`
- `OFFER.md` → input to `pricing-strategy` and `landing-page-copy`
- `PRICING.md` → input to `landing-page-copy`
- `OFFER.md` + traffic data → input to `audit-offer`

If a file already exists in the project, read it before asking the user to repeat themselves.

---

## Decision Matrix

| User says... | Likely stage | Route to |
|---|---|---|
| "I have an idea but no customers" | Idea | `market-research` |
| "Who should I target?" | Idea | `market-research` |
| "What should I sell to X?" | Market chosen | `hormozi-offer` |
| "Build me an offer" | Market chosen | `hormozi-offer` |
| "How much should I charge?" | Offer ready | `pricing-strategy` |
| "I want to add tiers" | Offer ready | `pricing-strategy` |
| "Write me a sales page" | Offer + price ready | `landing-page-copy` |
| "My funnel doesn't convert" | Live | `audit-offer` |
| "Something feels off" | Live | `audit-offer` |
| "Help me with my business" | Unknown | Ask 2–3 questions, then route |

---

## Routing Rules

**Never** run `landing-page-copy` without an `OFFER.md` (or equivalent context).
**Never** run `pricing-strategy` without a clear offer + outcome.
**Never** run `hormozi-offer` without a target audience (run `market-research` first if missing).
**Always** prefer `audit-offer` over rebuilding when the offer is already live and only conversions are weak.
**Always** state the route and reasoning before handing off.

---

## Output Format

The orchestrator does not produce its own markdown file. It produces a short routing plan:

```
## Routing Plan

**Stage:** [Idea / Market / Offer / Price / Page / Live]
**Gaps:** [what's missing]
**Plan:**
1. Run `skill-name` → produces `FILE.md`
2. Run `skill-name` → produces `FILE.md`
3. ...

**Starting with:** `skill-name`
**Reason:** [one sentence]
```

Then hand off to the first skill.

---

## Style Guidelines
- diagnose fast, don't interrogate
- name the skill explicitly when routing
- explain the order in one sentence
- skip steps the user has already done
- never silently switch skills mid-flow

---

## Success Criteria

The orchestrator works when:
- the right skill runs first
- prerequisites are caught before they cause rework
- the user understands why each step is happening
- outputs flow cleanly from one skill to the next
- vague requests turn into clear, ordered plans
