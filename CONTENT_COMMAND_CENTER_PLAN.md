# Content Command Center — Implementation Plan

## Context

The Seb AI site is currently a static Vue 3 landing page with no backend. You want a private content repurposing engine where you can dump a YouTube link, voice recording, or raw text and get polished LinkedIn posts, blog posts, and Twitter threads — with auto-posting to X/Twitter.

This requires adding: routing, a password-protected page, Vercel serverless API routes, AI content generation, YouTube transcript extraction, browser speech-to-text, and Twitter API integration.

---

## Architecture Overview

```
Browser (Vue 3 SPA)          Vercel Serverless (/api)
┌──────────────────┐         ┌──────────────────────┐
│ / → Landing page │         │ POST /api/auth       │
│ /cc → Command    │────────▶│ POST /api/generate   │──▶ Claude / OpenAI
│      Center      │         │ POST /api/yt-transcript│──▶ youtube-transcript
│                  │◀────────│ POST /api/post-twitter│──▶ Twitter API v2
└──────────────────┘         └──────────────────────┘
```

---

## Phase 1: Routing Infrastructure

**Goal**: Add vue-router without breaking the existing landing page.

1. `npm install vue-router`
2. Create `src/router.ts` — two routes: `/` (LandingPage) and `/cc` (CommandCenterPage)
3. Create `src/pages/LandingPage.vue` — move all section components from App.vue here
4. Create `src/pages/CommandCenterPage.vue` — placeholder
5. Refactor `src/App.vue` to just `<router-view />`
6. Update `src/main.ts` to install the router
7. Update `vercel.json` with SPA rewrite: `{ "source": "/(.*)", "destination": "/index.html" }`

**Files to modify**: `src/App.vue`, `src/main.ts`, `vercel.json`
**Files to create**: `src/router.ts`, `src/pages/LandingPage.vue`, `src/pages/CommandCenterPage.vue`

---

## Phase 2: Authentication

**Goal**: Password gate so only you can access `/cc`.

- Password stored as `COMMAND_CENTER_PASSWORD` env var on Vercel
- `POST /api/auth` validates password, returns HMAC-signed token (using Node.js `crypto`, no dependencies)
- Token stored in `localStorage`, sent as `Authorization: Bearer <token>` on subsequent API calls
- Token expires in 24 hours, verified statelessly via HMAC signature

**Files to create**:
- `api/auth.ts` — password validation endpoint
- `api/_lib/auth-utils.ts` — HMAC token sign/verify
- `src/composables/useAuth.ts` — reactive auth state, login/logout
- `src/components/command-center/PasswordGate.vue` — password form using DInput + DButton

---

## Phase 3: Text Input + AI Generation (core feature)

**Goal**: Type a brain dump → get LinkedIn post, blog post, Twitter thread.

### API layer
- `api/_lib/ai-provider.ts` — reads `AI_PROVIDER` env var (`"claude"` or `"openai"`), dispatches to the correct SDK. Single function: `generateContent(input) → { linkedin, blog, twitter }`
- `api/_lib/prompts.ts` — prompt templates for each content type. Single AI call returns JSON with all 3 content pieces
- `api/generate.ts` — validates auth token, calls ai-provider, returns structured JSON

### Frontend
- `src/components/command-center/TextInput.vue` — large textarea (dimensional styling)
- `src/components/command-center/InputSection.vue` — tabbed interface (YouTube / Mic / Text)
- `src/components/command-center/OutputSection.vue` — renders 3 ContentCard components
- `src/components/command-center/ContentCard.vue` — displays content + copy button per platform
- `src/composables/useContentGeneration.ts` — API call + loading/error state
- `src/composables/useClipboard.ts` — copy-to-clipboard utility

**Dependencies**: `@anthropic-ai/sdk`, `openai` (install both, only one used at runtime based on env var)

---

## Phase 4: YouTube Input

**Goal**: Paste a YouTube URL → extract transcript → feed to AI.

- `api/youtube-transcript.ts` — extracts video ID, uses `youtube-transcript` package (no API key needed)
- `src/components/command-center/YouTubeInput.vue` — URL input + "Fetch Transcript" button, shows extracted text

**Dependencies**: `youtube-transcript`

---

## Phase 5: Microphone Input

**Goal**: Open mic → speak → get transcript → feed to AI.

- Uses browser Web Speech API (`SpeechRecognition`) — free, no backend needed
- `src/composables/useSpeechRecognition.ts` — Web Speech API wrapper with start/stop/transcript
- `src/components/command-center/MicrophoneInput.vue` — record button + live transcript display
- Fallback message for unsupported browsers (Firefox)

**No new dependencies** — browser-native API.

---

## Phase 6: Twitter Auto-Posting

**Goal**: One-click post the generated Twitter thread to X.

- `api/_lib/twitter-client.ts` — Twitter API v2 wrapper using OAuth 1.0a credentials
- `api/post-twitter.ts` — posts first tweet, then replies in sequence to form a thread
- `src/components/command-center/TwitterPostButton.vue` — confirm + post button with success/error states

**Dependencies**: `twitter-api-v2`
**Env vars**: `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET`

---

## Environment Variables (Vercel Dashboard)

| Variable | Purpose |
|---|---|
| `COMMAND_CENTER_PASSWORD` | Password to unlock command center |
| `AUTH_SECRET` | HMAC signing key for session tokens |
| `AI_PROVIDER` | `"claude"` or `"openai"` |
| `AI_API_KEY` | API key for the selected provider |
| `TWITTER_API_KEY` | Twitter app API key |
| `TWITTER_API_SECRET` | Twitter app API secret |
| `TWITTER_ACCESS_TOKEN` | Twitter user access token |
| `TWITTER_ACCESS_SECRET` | Twitter user access secret |

---

## New Dependencies Summary

```
vue-router           # Client-side routing
@anthropic-ai/sdk    # Claude API (conditional)
openai               # OpenAI API (conditional)
youtube-transcript   # YouTube transcript extraction
twitter-api-v2       # Twitter posting
```

---

## Verification

After each phase:
1. `npm run build` — must pass type-checking and build
2. `npm run dev` — landing page at `/` works identically to before
3. Phase 1: Navigate to `/cc` shows placeholder
4. Phase 2: `/cc` shows password gate, correct password grants access
5. Phase 3: Type text → click Generate → see 3 content outputs with copy buttons
6. Phase 4: Paste YouTube URL → fetch transcript → generate content
7. Phase 5: Record mic → see transcript → generate content
8. Phase 6: Click "Post to Twitter" → thread appears on X

Full end-to-end test: paste a YouTube link → generate → auto-post thread to Twitter.
