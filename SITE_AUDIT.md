# Dublin Hacx — Site Audit

Read-only inventory of the current site. Source of truth for a future redesign.
No code was changed to produce this. Values and copy are pulled literally from
the codebase as of this commit.

---

## 1. Tech stack

| Area | What's used |
|---|---|
| Framework | **React 19** + **TanStack Start / TanStack Router** (`@tanstack/react-start`, `@tanstack/react-router`), file-based routes in `src/routes/` |
| Build tool | **Vite 7** (`vite dev` / `vite build`) |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`, CSS-first config via `@theme inline` in `src/styles.css`), `tailwind-merge` + `clsx` (`cn()` in `src/lib/utils.ts`), `class-variance-authority`, `tw-animate-css` |
| Component library | **shadcn/ui** — full set present in `src/components/ui/` (47 files: accordion, button, card, dialog, form, etc.). **Note:** almost none are used by the marketing site; the landing page hand-rolls its own markup. |
| Animation | **framer-motion** (primary, used in nearly every section), **@react-three/fiber + @react-three/drei + three** (3D cosmic background), **gsap** (installed, no usage found in sections), **canvas-confetti** (installed; used only via KonamiEgg? — no direct import found in audited files) |
| Icons | **lucide-react** (e.g. `Lightbulb, Rocket, Sparkles, Target, Heart, Download` in Theme/Sponsors) + hand-authored inline SVGs (check marks, hamburger, cursor) |
| Forms | react-hook-form + zod + @hookform/resolvers installed; the live registration flow is just an **embedded Google Form** (`/form` route iframe), not a native form |
| Fonts | Self-hosted **Monaspace Krypton** (woff2 in `public/fonts/`), Google Fonts **Space Grotesk** + **VT323** (imported at top of `styles.css`) |
| Deployment | Dual target: **Vercel** (`vercel.json`, `build:vercel` script → `scripts/build-vercel.mjs`) and **Cloudflare** (`wrangler.jsonc`, `@cloudflare/vite-plugin`). Canonical domain `https://www.dublinhacx.com` (from `__root.tsx` og:url). |
| Theme mode | Forced dark always (`html,body { color-scheme: dark }`); a `.dark` custom variant is declared but there's no light theme. |

Routes: `/` (landing, `routes/index.tsx`), `/form` (embedded Google Form, `routes/form.tsx`), `__root.tsx` (shell + SEO meta + 404 `NotFoundComponent`).

---

## 2. Design tokens actually in use

### 2a. Color tokens (defined in `src/styles.css` `:root`, OKLCH)

| Token | Value | Notes |
|---|---|---|
| `--background` | `oklch(0.08 0.03 280)` | near-black, blue-purple tinted |
| `--foreground` | `oklch(0.97 0.01 280)` | near-white |
| `--card` | `oklch(0.12 0.04 280)` | used almost always at `/30` opacity (`bg-card/30`) |
| `--popover` | `oklch(0.12 0.04 280)` | |
| `--primary` | `oklch(0.78 0.17 305)` | the purple/violet, comment says `#c084fc` |
| `--primary-foreground` | `oklch(0.1 0.02 280)` | |
| `--primary-glow` | `oklch(0.85 0.15 310)` | lighter purple, used in gradients/avatars |
| `--secondary` | `oklch(0.18 0.05 280)` | |
| `--muted` | `oklch(0.16 0.04 280)` | |
| `--muted-foreground` | `oklch(0.7 0.04 280)` | body/subtext gray-purple |
| `--accent` | `oklch(0.22 0.08 300)` | |
| `--gold` | `oklch(0.85 0.15 85)` | comment says `#f5c842`; countdown, presenting tier, moon |
| `--gold-foreground` | `oklch(0.1 0.02 280)` | |
| `--destructive` | `oklch(0.62 0.24 25)` | not used in marketing sections |
| `--border` | `oklch(0.25 0.05 290 / 0.5)` | translucent purple border, sitewide |
| `--input` | `oklch(0.18 0.05 280)` | |
| `--ring` | `oklch(0.78 0.17 305)` | = primary |
| `--radius` | `0.75rem` | base radius; derived `--radius-sm..3xl` in `@theme` |

### 2b. Hardcoded color values found in components (NOT from tokens)

These are the inconsistency risks — literal hexes/oklch scattered in JSX:

**CosmicBackground.tsx** (three.js): `#ffffff`, `#c084fc`, `#a78bfa`, `#e9d5ff` (particle palette), `#7c3aed`, `#a855f7`, `#6366f1` (nebula clouds — note `#6366f1` is indigo, off-brand), `#08051a` (fog). Plus radial gradients `oklch(0.22 0.12 305 / 0.45)`, `oklch(0.18 0.10 280 / 0.45)`, `oklch(0.07 0.03 280)`, `oklch(0.7 0.20 305 / 0.55)`.

**HeroSection.tsx**: `GlitchText` uses **`#22d3ee` (cyan)** as a chromatic-aberration layer — a fully off-brand accent. Also drop-shadow `oklch(0.78 0.17 305 / 0.65)` on logo.

**BackedBySection.tsx**: **emerald** — `emerald-400/30`, `emerald-500/[0.06]`, `emerald-500/20`, `emerald-300`, `emerald-400`, and `oklch(0.72 0.16 160 / …)` glows. Entirely off the purple/gold palette.

**DiscordSection.tsx**: **indigo** — `indigo-400/30`, `indigo-500/[0.06]`, `indigo-500/20`, `indigo-300`, `indigo-400`, `indigo-500`, and `oklch(0.6 0.19 275 / …)` glows.

**CustomCursor.tsx**: `oklch(0.78 0.17 305 / 0.7)`, `oklch(0.82 0.16 310)`, `oklch(0.98 0.01 300)`.

**ScheduleSection.tsx** (orb): radial `oklch(0.28 0.02 270) → oklch(0.12 0.02 270) → oklch(0.04 0.01 270)`, sun highlight `oklch(0.85 0.05 260)`, moon glow `oklch(0.95 0.04 90)`.

**MoonCompanion.tsx**: `oklch(0.96 0.03 90)`, `var(--gold)`, `oklch(0.28 0.04 90)`.

**Inconsistency call-outs:**
- **At least 4 different "purples"** in play: token `oklch(0.78 0.17 305)`, `#c084fc`, `#a78bfa`, `#7c3aed`, `#a855f7` — meant to read as one brand purple but drift across hue/lightness.
- **Three off-brand accent colors** exist despite a purple+gold system: **cyan** (`#22d3ee`, Hero glitch), **emerald** (BackedBy), **indigo** (Discord + `#6366f1` nebula).
- Gold appears both as token and via ad-hoc oklch in the moon.

### 2c. Typography

Three families (from `@theme inline`):
- `--font-display`: `"Monaspace Krypton", ui-monospace, "SF Mono", Menlo, monospace` — applied to **all `h1–h4`** (base layer) plus `.font-display`. Letter-spacing `-0.045em` on headings.
- `--font-sans`: `"Space Grotesk", system-ui, sans-serif` — **body default**; also used explicitly on some large numerics (`font-sans` on countdown/prices).
- `--font-pixel`: `"VT323", monospace` via `.font-pixel` (letter-spacing `0.05em`) — **eyebrow/label text** ("About", "The Theme", "Schedule", "FAQ", "Partner with us", etc.).

Weights in use: 300–700 (Space Grotesk import), Monaspace 400/500/600/700/800. Common: `font-bold`, `font-extrabold`.

Representative sizes (Tailwind):
- Hero H1: `text-6xl sm:text-7xl md:text-[8rem] lg:text-[10rem]`, `leading-[0.9] tracking-[-0.07em]`.
- Section H2: `text-4xl md:text-6xl font-extrabold`.
- Sub-headings H3: `text-xl–3xl`.
- Body: `text-sm`/`text-base`/`md:text-lg`, `text-muted-foreground`, `leading-relaxed`.
- Eyebrows: `text-sm uppercase tracking-widest` (or `tracking-[0.25em]`).
- Countdown numerals: `text-4xl sm:text-5xl md:text-6xl font-bold tabular-nums`.

### 2d. Spacing / radius / shadows

- Section rhythm: `px-6 py-24 md:py-32` (most), some `py-20 md:py-28`. Max widths `max-w-6xl` (About/Schedule/Sponsors), `max-w-5xl` (Theme/Hero inner), `max-w-4xl` (BackedBy/Discord/Judges), `max-w-3xl` (FAQ/Story).
- Radius: cards `rounded-2xl` / `rounded-3xl`; pills/buttons `rounded-full`; icon squares `rounded-xl`; small chips `rounded-full`.
- Glows/shadows (custom utilities in `styles.css`):
  - `.text-glow` — 5-layer purple text-shadow (up to 200px).
  - `.text-glow-soft` — `0 0 6px oklch(0.7 0.15 305 / 0.22)`.
  - `.purple-glow` — `box-shadow: 0 0 40px oklch(0.78 0.17 305 / 0.4)`.
  - `.gold-glow` — `0 0 30px … + inset 0 0 20px` gold.
  - Inline `boxShadow` on BackedBy/Discord cards (`0 0 60px …`), Schedule orb, Moon.
- Effects utilities: `.text-gradient-primary` (3-stop purple linear-gradient text), `.text-aurora`, `.bg-cosmic-gradient`, `.grain-overlay` (fixed SVG turbulence noise, `mix-blend-overlay`, animated), `.shimmer-line`, `.tilt-3d`, `.moon-bounce-track`.
- Keyframes defined: `pulse-glow`, `float`, `grain`, `moon-bounce`, `glitch-shift`, `aurora`, `shimmer`, `tilt-3d`.
- Custom cursor: `body { cursor: none }` on `hover:hover` devices (see CustomCursor).

---

## 3. Section-by-section inventory

Page composition order (`src/routes/index.tsx`, verified): IntroOverlay → CosmicBackground (fixed) → grain overlay (fixed) → CustomCursor → KonamiEgg → NavBar → MoonCompanion → **HeroSection → StorySection → BackedBySection → AboutSection → ThemeSection → ScheduleSection → JudgesSection → FaqSection → DiscordSection → SponsorsSection → Footer**.

> ✅ Ordering reconciled: the nav-able sections were already monotonic in page order (`about` → `theme` → `schedule` → `judges` → `faq` → `sponsors`), so no section reorder in `routes/index.tsx` was needed — the only gap was the missing **Judges** nav entry. Fixed by inserting `{ id: "judges", label: "Judges" }` between Schedule and FAQ in `NavBar.tsx`'s `NAV_ITEMS` (drives both the desktop pill nav and the mobile dropdown). Nav order now equals page order: **About, Theme, Schedule, Judges, FAQ, Sponsors**.
>
> Intentionally left without a nav anchor: `StorySection` — a short transitional quote between Hero and BackedBy. It has no `id` and is a pause, not a destination, so it stays out of the nav (adding one would just crowd it). `DiscordSection` keeps its `id="discord"` (deep-linkable, e.g. FAQ #10 references it) but likewise stays off the top nav as a CTA rather than a browse target.

### Global overlays / chrome

**IntroOverlay** (`src/components/IntroOverlay.tsx`)
- Full-screen intro, ~5.2s then fades (0.8s). Skippable on any click/keydown.
- Starry backdrop (radial gradient + 90 animated SVG stars) + **3 glossy labeled orbs** sweeping left→right: **"BUILD"** (hue 305), **"SHIP"** (hue 60), **"DEMO"** (hue 280), each `radial-gradient` sphere with glow. Then the **logo materializes** (scale/opacity). Skip hint copy: **"Tap anywhere to skip"**.

**CosmicBackground** (`src/components/CosmicBackground.tsx`)
- three.js `<Canvas>`: `<Stars>` (4000), custom `ParticleField` (1400 colored points), 3 rotating `NebulaCloud` spheres, 2 `ShootingStar`s, `MouseParallax` (camera follows pointer). Fog `#08051a`. Fixed behind everything.

**Grain overlay** — fixed `.grain-overlay` div at `opacity-[0.07]`.

**CustomCursor** (`src/components/CustomCursor.tsx`)
- Replaces the OS cursor on fine-pointer devices: a 12-dot easing **comet trail** (purple, glowing) + an **SVG arrow head** that scales on hover (1.25×) / press (0.82×). Hidden on touch.

**KonamiEgg** (`src/components/KonamiEgg.tsx`)
- Listens for the Konami code (↑↑↓↓←→←→ b a). On success: modal with 🚀, **"You found the secret!"**, **"Now go build something cosmic."**, Close button. `purple-glow`, `backdrop-blur-xl`.

**MoonCompanion** (`src/components/MoonCompanion.tsx`)
- Decorative gold moon (`14×14`, craters) bouncing horizontally across the top (`moon-bounce-track`, 18s). `lg:` only, `opacity-70`.

**NavBar** (`src/components/NavBar.tsx`)
- Fixed top; transparent until scroll>30px then `bg-background/80 backdrop-blur-xl border-b`. Left: logo (`dublin-hacx-logo.svg`) that scales + glows on hover. Center (desktop): pill nav buttons — **About, Theme, Schedule, FAQ, Sponsors** (smooth-scroll; routes home w/ hash from other pages). Right: **"Volunteer"** (outline pill → Google Form) + **"Register →"** (filled primary pill, `purple-glow`, hover scale → Google Form). Mobile: hamburger toggles a `backdrop-blur-xl` dropdown with the same links.
- `REGISTER_URL` = `https://docs.google.com/forms/d/e/1FAIpQLSdnmbxMou0EOQ4BbJJEeekJ_B7FVXqV9IioHKOfzYSVIGmKNg/viewform`
- `VOLUNTEER_URL` = `https://docs.google.com/forms/d/e/1FAIpQLScdfNpcAJTRDc2Z9PKoUv1vNVHyYfiwte9zLMTC30vcF-0vIw/viewform?usp=dialog`

### Hero (`src/components/sections/HeroSection.tsx`)
- **Layout:** full-screen centered stack. Parallax night background image + separate twinkling-stars SVG layer (50 stars, scroll parallax). Bottom scroll indicator (animated bar, **"Scroll"**).
- **Content (top→bottom):** floating logo (`dublin-hacx-logo.svg`, drop-shadow glow) → eyebrow **"SAP Office, San Ramon · Oct 3, 2026 · 10am–10pm"** → date/countdown block → H1 **"DUBLIN" / "HACX"** (HACX rendered via `GlitchText`: gradient + cyan `#22d3ee` + soft glow) → subhead **"Dublin's very first Dublin Hacx. 12 hours, 10am to 10pm. Walk in with an idea. Walk out with something real."** → two buttons: **"Apply to Hack →"** (primary, `MagneticButton` with shimmer sweep) + **"What's the deal?"** (secondary, glass).
- **Countdown:** `EVENT_DATE_TBD` is `false` → live `<Countdown>` renders. Targets **2026-10-03T10:00:00-07:00**. Shows big **"October 3, 2026"** in gold + Days/Hours/Minutes/Seconds `tabular-nums` (gold, `gold-glow`), 1s interval, hydration-safe (starts null).
- **Interaction:** magnetic buttons (spring toward cursor ±0.25), shimmer sweep on primary, scroll-driven image parallax (`y 0→18%`, `scale 1.05→1.15`), stars parallax (`y 0→30%`), `fadeUp` staggered entrance.
- **Assets:** `@/assets/hero-night.jpg`, `@/assets/dublin-hacx-logo.svg`.

### Story (`src/components/sections/StorySection.tsx`)
- **Layout:** single centered large paragraph, `min-h-[50vh]`.
- **Copy:** *"Bring an idea, get 12 hours to build it, and show what you made by the end of the day. That's it — Dublin Hacx, October 3, 2026 at the SAP Office in San Ramon."*
- **Interaction:** one `whileInView` fade-up.

### BackedBy (`src/components/sections/BackedBySection.tsx`) — id `backed-by`
- **Layout:** single centered **emerald** glass hero card (`rounded-3xl`, `backdrop-blur-md`, emerald border + `0 0 60px` emerald boxShadow), with a blurred emerald orb behind, logo, eyebrow, heading, paragraph.
- **Assets:** `/ehcc-logo.png` (h-40, emerald drop-shadow).
- **Copy:** eyebrow **"Officially Backed"**; H2 **"This is backed by the Emerald Hacking & Coding Club."** (club name in glowing emerald); body *"We run the Emerald Hacking & Coding Club. Dublin Hacx is the event we kept wishing existed, so we're just building it ourselves. By students, for students."*

### About (`src/components/sections/AboutSection.tsx`) — id `about`
- **Layout:** centered header → **3-col stat grid** → gold-bordered blockquote → **2-col** (text block + organizer cards).
- **Copy:** eyebrow **"About"**; H2 **"Made by students who got tired of *waiting*."** (gradient span).
  - Stats: **170 "Spots"**, **12hr "Build window"**, **$0 "Cost — totally free"** (animated count-up via `Counter` using `useMotionValue/useSpring`).
  - Blockquote: *"The day I stopped just talking about building stuff and actually built something."* — footer *"— hopefully you, on October 3"*.
  - Left text H3 **"One day that actually sticks."** + 2 paragraphs (170 people, 10am–10pm, "Run out of the EHS Hacking & Coding Club at Emerald High. By students, for students.").
  - Organizers (cards, avatar-or-initials): **Jasraj Tulsi** — "Co-Founder · Emerald HS" — *"Runs the club, sends the emails. Probably the one who'll reply to you."* — img `/jasraj-tulsi.png`; **Rachit Panchal** — "Admin · Co-Founder · Emerald HS" — *"Handles the logistics so the day actually happens. Co-founder."* — img `/rachit-panchal.jpg`.
- **Interaction:** count-up on view; `OrganizerAvatar` falls back to initials on image error (with prerender 404 recheck).

### Theme (`src/components/sections/ThemeSection.tsx`) — id `theme`
- **Layout:** centered eyebrow line → centered header → **3-col icon-card grid**.
- **Copy:** top line *"Every great hack starts with a question."*; eyebrow **"The Theme"**; H2 **"Open-ended. *On purpose.*"** (gradient span); sub *"Bring any idea. Build it into reality."*
  - Pillars (lucide icon in rounded square + H3 + body):
    - `Lightbulb` **"Bring any idea"** — *"There are no themes, no required tracks, no boxes to fit inside. Whatever you're curious about — that's the brief."*
    - `Rocket` **"Build it for real"** — *"Pick something you actually want to make, then make it. By 8pm it should run — not be a slide deck about a thing that could run."*
    - `Sparkles` **"Ship in 12 hours"** — *"From first commit to live demo, the only constraint is the clock. Mentors and workshops keep you moving."*
- **Interaction:** staggered fade-up; card `hover:border-primary/40`.

### Schedule (`src/components/sections/ScheduleSection.tsx`) — id `schedule`
- **Layout:** two headers (H2 **"Here's how the day looks."** + eyebrow **"Schedule"** + H2 **"12 hours of *building*."**), then `ScheduleTrack`: **2-col** `[280px_1fr]` — left sticky **"time orb"**, right an **internal-scroll** event list.
- **The orb (`ScheduleOrb`):** dark radial-gradient sphere; **day vs night** state driven by scroll position. Daytime → soft light highlight; Night (`hour>=20 || <6`) → 16 twinkling stars + a floating gold moon glow. Shows interpolated **time** (center, big) + label **"Live Build"/"Night Build"**, and a **"Daytime"/"Evening"** caption. Pulses while scrolling.
- **The track:** internal scroller (`h-[70vh] max-h-[640px]`, mask-image fade top/bottom) containing an `<ol>` timeline (left border + dots). Scroll interpolates a live clock minute-by-minute (`formatMinutes`), highlights the nearest event, snaps to it when idle (220ms). Keyboard accessible (`role=listbox`, arrow/Home/End). Active event scales/opacity; others dim.
- **Data (`src/lib/schedule.ts`, `EVENT_START` = 2026-10-03T10:00:00-07:00):** each `{offsetMin,time,title,description,tag}`:
  | Time | Title | Tag |
  |---|---|---|
  | 10:00 AM | Check-In | Event |
  | 10:30 AM | Opening Ceremony | Event |
  | 11:00 AM | Hacking Begins | Event |
  | 1:00 PM | Lunch | Food |
  | 3:00 PM | Workshops | Fun |
  | 6:00 PM | Dinner | Food |
  | 8:00 PM | Hacking Ends / Submissions Due | Event |
  | 8:30 PM | Judging | Event |
  | 9:30 PM | Awards Ceremony | Event |
  | 10:00 PM | Event Ends | Event |
  - Descriptions (verbatim): Check-In *"Arrive, sign in, grab your badge & swag bag."*; Opening *"Sponsors intro, judging criteria, and the green light."*; Hacking Begins *"12 hours start now. Build, ship, repeat."*; Lunch *"Hot meal to keep you fueled for the afternoon."*; Workshops *"Beginner-friendly sessions on web, AI, and hardware."*; Dinner *"Refuel for the final stretch of building."*; Hacking Ends *"Final commits, demo prep, and devpost uploads."*; Judging *"Show your project to industry mentors."*; Awards *"Winners announced. Prizes handed out. Confetti."*; Event Ends *"Pack up, say goodbyes, and head home."*
  - `schedule.ts` also exports `EVENT_DATE_TBD=false`, `EVENT_END_MIN=720`, and `computeLiveStatus()` (before/live/ended phase helper).

### Judges (`src/components/sections/JudgesSection.tsx`) — id `judges`
- **Layout:** centered header + a **small (`max-w-xs`) centered card** widget.
- **Copy:** eyebrow **"Judges"**; H2 **"The people judging your *build*."** (gradient span).
- **Judge card:** avatar (`/uday-vudathala.jpg`, initials fallback on error) + name/title/location + short bio.
  - **Vasuki Uday Kiran Vudathala** — "Staff Performance Engineer @ ServiceNow" — "Pleasanton, California" — img `/uday-vudathala.jpg`.
  - Bio (current, shortened): *"15+ years in performance engineering and distributed systems, building scalable enterprise cloud and Generative AI platforms. Google Cloud certified in GenAI; has judged and mentored at hackathons including UC Berkeley's AI Hackathon 2026."*
  - Data object also carries (currently **not rendered**): `company: "ServiceNow"`, `education: "MCA, Computer Science — Jawaharlal Nehru Technological University"`, `tags: ["Generative AI","Cloud & Reliability","Performance Engineering","Google Cloud Certified — Generative AI"]`.
- **Interaction:** fade-up on view.

### FAQ (`src/components/sections/FaqSection.tsx`) — id `faq`
- **Layout:** centered header + a vertical **accordion** (one open at a time, index 0 default).
- **Copy:** eyebrow **"FAQ"**; H2 **"Questions, answered."**
- **Interaction:** hand-rolled accordion (not the shadcn one) — `+` icon rotates 45° on open, `AnimatePresence` height animation.
- **Q&A (10, verbatim):**
  1. *Who can attend?* — "Any high school student in the Bay Area. You don't need to be from Dublin or Emerald HS — bring your friends from any school."
  2. *Do I need coding experience?* — "Nope. We have beginner workshops and mentors on hand. About a third of past hackathon attendees write their first line of code at the event."
  3. *How much does it cost?* — "$0. Dublin Hacx is completely free for hackers thanks to our sponsors. Food, swag, and prizes included."
  4. *What should I bring?* — "Laptop, charger, any hardware you want to hack on, a water bottle, and a photo ID for check-in."
  5. *Can I join a team at the event?* — "Yes. We'll run a team-formation session right after the opening ceremony. Solo hackers are welcome too."
  6. *Where is the venue?* — "The SAP Office at 3001 Bishop Drive, San Ramon, CA 94583 (Bishop Ranch). The whole event runs there on Saturday, October 3, 2026."
  7. *How long is the event?* — "Dublin Hacx runs a single day, 10am to 10pm — 12 hours of building, workshops, meals, and judging. Doors open at 10am for check-in and the awards ceremony wraps up by 10pm."
  8. *How are projects judged?* — "Industry mentors evaluate submissions on technical execution, creativity, polish, and presentation. Specific prize categories will be announced closer to the event."
  9. *Is food provided?* — "Yes — meals plus snacks and drinks throughout the day. Dietary restrictions are accommodated."
  10. *How do I become a sponsor?* — "Email us at dublinhacx@gmail.com. We have Bronze, Silver, and Gold tiers — see the Sponsors section for details."

### Discord / community (`src/components/sections/DiscordSection.tsx`) — id `discord`
- **Layout:** single centered **indigo** glass hero card (structurally identical to BackedBy but indigo), blurred indigo orb behind, eyebrow, heading, paragraph, filled indigo button.
- **Copy:** eyebrow **"Join the community"**; H2 **"Hang out with us on Discord."** (Discord in glowing indigo); body *"Announcements, team-finding, and questions answered fast. Everyone coming to Dublin Hacx should be in here."*; button **"Join the Discord"**.
- **Link:** `DISCORD_URL` = `https://discord.com/invite/wnwAhkPS3`.

### Sponsors (`src/components/sections/SponsorsSection.tsx`) — id `sponsors`
- **Layout (top→bottom):** centered header + prospectus links → **4-col stat strip** → **"Why sponsor" 4-col icon-card grid** → tiers header → **"Partner" hero card** → **"Build your own" hero card** → **3-col core tier grid** → **In-kind full-width card** → **contact CTA bar** → **current sponsors logo grid**.
- **Header copy:** eyebrow **"Partner with us"**; H2 **"Back the next *generation* of builders."**; body *"Dublin Hacx puts your brand in front of 170 of the Bay Area's most driven high-school engineers — for a full 12 hours, and in every story they tell afterward. Every dollar funds free meals, swag, and prizes."*
  - Prospectus: **"View our sponsorship prospectus"** → `/prospectus.html`; **"Download as PDF"** → `/prospectus.pdf` (`Download` icon).
- **Stats strip:** **170 "High-school hackers"**, **12h "Non-stop building"**, **100% "Of funds fuel the event"** (values in gradient text).
- **Why sponsor (4 lucide cards):**
  - `Target` **"Recruit early talent"** — "Meet motivated builders before anyone else — with opt-in access to their resumes, GitHubs, and projects."
  - `Rocket` **"Drive product adoption"** — "Put your API, hardware, or platform in 170 hands. Sponsor a challenge and watch students ship with your tools."
  - `Sparkles` **"Real brand love"** — "Logo on the shirts, the banners, the site. You're in every photo people post and every story they tell their friends after."
  - `Heart` **"Invest in community"** — "Fund Dublin's very first Dublin Hacx. Your support goes straight to meals, swag, and prizes."
- **Tiers header:** eyebrow **"Sponsorship tiers"**; H3 **"Pick your *level*."**; sub "Every package is flexible — tell us your goals and we'll tailor the perks to match."
- **Pricing (must preserve):**
  - **Partner — $6,000** (badge "TOP TIER", gold card): tagline "Our top tier — main event co-branding". Perks: "Everything in Gold, plus:", "Main event co-branding", "15-min ceremony speaking slot", "XL logo on the t-shirt back", "Participant resumes (opt-in)", "Participant emails (opt-in)".
  - **Build your own** (badge "Most popular", purple card): "Our most-loved option. Don't see the perfect fit above? Mix, match, and dream up your own package — a branded challenge, a custom prize, a workshop, whatever moves your brand. We'll chat it through over email and tailor everything to your goals and budget." → button **"Let's chat over email →"** (Gmail compose to dublinhacx@gmail.com).
  - **Gold — $3,500** (featured): "Everything in Silver, plus:", "Large logo on the t-shirt", "5-min ceremony speaking slot", "Judge panel seat", "Company-specific track".
  - **Silver — $1,800** (accent): "Everything in Bronze, plus:", "Small logo on the t-shirt", "Dedicated table at the event", "Social media shoutouts", "Host your own workshop (30m)".
  - **Bronze — $600**: "Logo on the website footer", "Swag/stickers in welcome bags", "Mention in the opening ceremony", "Included in emails".
  - **In-Kind & Community — "Product / Custom"**: "Donate food, swag, prizes, hardware, or cloud & API credits", "Provide mentors, judges, or workshop leaders", "Recognition matched to your contribution's value", "Perfect for startups, local shops & student orgs". Blurb: "No budget line? Contribute what you make. We'll match your visibility to the value you bring."
- **Contact CTA bar:** eyebrow **"Get in touch"**, **dublinhacx@gmail.com**, "Tell us your goals and we'll send a tailored package within 48 hours.", button **"Become a sponsor →"** (mailto).
- **Current sponsors:** header **"Current Sponsors"**, subline "Venue partner: SAP Office, San Ramon".
  - **Headline sponsor — Context66** (`purple-glow` card, white logo plate) → `https://context66.com/`, logo `/context66-logo.png`, label "Headline Sponsor".
  - Grid (aspect 3/2 cards, white plates for some): **YRI Science** `/yri-science-logo.png` → `yriscience.com`; **MeDo** `/medo-logo.png` → `medo.dev`; **PCBWay** `/pcbway-logo.png` → `pcbway.com`; **.xyz** `/xyz-logo.png` → `gen.xyz`.
- **Interaction:** `Check` inline-SVG list bullets; card `hover:border-primary/50/60`; `Build your own` button `hover:scale-105 purple-glow`.

### Footer (`src/components/sections/Footer.tsx`)
- **Layout:** `border-t`, 3-col (brand blurb + 3 link columns), bottom bar.
- **Brand:** dot + **DUBLIN**HACX wordmark; blurb "Dublin's very first Dublin Hacx. October 3, 2026 at the SAP Office in San Ramon."
- **Event col:** About, Theme, Schedule, FAQ (hash links).
- **Get involved col:** **Sign Up** (`REGISTER_URL`), **Volunteer** (`VOLUNTEER_URL`), **Judge** (`JUDGE_URL` = `https://docs.google.com/forms/d/e/1FAIpQLSdOLyt1u0iAMp_2dX_JKVOr_CjRBjqTXRA-A8IXgGv1zV2sDQ/viewform`), **Sponsor** (`#sponsors`), **Contact** (mailto dublinhacx@gmail.com).
- **Social col:** Instagram `https://www.instagram.com/dublin.hacx/` (📷), Discord `https://discord.com/invite/wnwAhkPS3` (💬).
- **Bottom bar:** "In respect to the EHS Hacking & Coding Club · Dublin, CA" · "© 2026 Dublin Hacx".

### /form route & 404
- `/form`: header (logo + "← Back to site") + full-height **iframe** embedding the Google registration form (`…viewform?embedded=true`, minHeight 1400px).
- 404 (`__root.tsx`): "404" / "Page not found" / body / "Go home" button.

---

## 4. Repeated patterns (the "templated" feel)

These repeat near-identically and are the main drivers of sameness:

1. **Section header block** — `motion.div (opacity/y fade-in, whileInView) + <p className="mb-3 font-pixel text-sm uppercase tracking-widest text-primary">EYEBROW</p> + <h2 className="font-display text-4xl font-extrabold md:text-6xl">…<span className="text-gradient-primary">word</span>.</h2>`. Appears in **About, Theme, Schedule, FAQ, Sponsors (×2), Judges**. The "eyebrow label + big display heading with one gradient word ending in a period" is the signature repeated unit.

2. **Glass card** — `rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md` (+ optional `hover:border-primary/40`). Used for: About stat cards & organizer cards, Theme pillars, FAQ items, Judges card, Sponsors "why" cards, Sponsors contact bar. This one card recipe is everywhere.

3. **Icon-in-rounded-square** — `inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary` wrapping a lucide icon, above an H3 + muted paragraph. **Identical** in Theme pillars and Sponsors "why sponsor" cards.

4. **Colored glass hero card** — `rounded-3xl border border-{COLOR}-400/30 bg-{COLOR}-500/[0.06] p-10 text-center backdrop-blur-md` + inline `boxShadow: 0 0 60px …` + a blurred `{COLOR}-500/20 blur-3xl` orb + eyebrow + heading with a **glowing colored span** + paragraph. **BackedBy (emerald) and Discord (indigo) are the same component with the color swapped** — the clearest copy-paste.

5. **Primary pill button** — `rounded-full bg-primary px-… text-primary-foreground purple-glow` (often `hover:scale-105`). NavBar "Register", Sponsors CTAs, Discord button (indigo variant), KonamiEgg close. Outline variant `border border-primary/40 … text-primary` for secondary (NavBar "Volunteer", prospectus link).

6. **`whileInView` fade-up** — `initial={{opacity:0,y:20–30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-80px"}} transition={{duration:0.6–0.7}}` — on essentially every block, with per-item `delay: i*0.1` stagger. Uniform motion signature across the whole page.

7. **Glow utilities as decoration** — `.purple-glow` / `.gold-glow` / `.text-glow(-soft)` / `.text-gradient-primary` applied liberally (headings, buttons, dots, logos), plus per-section inline `boxShadow`/`textShadow` glows. Glow is the default finishing move on nearly every element.

8. **Eyebrow micro-label** — `font-pixel … uppercase tracking-widest text-primary` (VT323) short label above headers — About, Theme, Schedule, FAQ, Sponsors, Footer column titles, Judges. Same treatment ~10×.

---

## 5. Content / data that must be preserved (do not alter — only re-present)

**Event identity**
- Name: **Dublin Hacx** (stylized DUBLIN HACX). Backed by the **EHS / Emerald Hacking & Coding Club**, Emerald High School, Dublin, CA.
- Date/time: **Saturday, October 3, 2026, 10:00 AM – 10:00 PM (12 hours)**. Countdown target `2026-10-03T10:00:00-07:00`. `EVENT_DATE_TBD=false`.
- Venue: **SAP Office, San Ramon** — full address **3001 Bishop Drive, San Ramon, CA 94583 (Bishop Ranch)**.
- Capacity / cost: **170 spots/hackers**, **$0 (free)**, **12-hour** build window. Eligibility: any Bay Area high-school student.

**Schedule** — all 10 rows in §3 (times, titles, tags, descriptions) verbatim.

**Judge** — Vasuki Uday Kiran Vudathala; title "Staff Performance Engineer @ ServiceNow"; Pleasanton, California; company ServiceNow; education "MCA, Computer Science — Jawaharlal Nehru Technological University"; tags list; bio; photo `/uday-vudathala.jpg`.

**Founders/organizers** — Jasraj Tulsi (Co-Founder · Emerald HS, `/jasraj-tulsi.png`); Rachit Panchal (Admin · Co-Founder · Emerald HS, `/rachit-panchal.jpg`). Bios in §3.

**FAQ** — all 10 Q&A verbatim (§3).

**Sponsor tiers & pricing** — Partner $6,000 · Gold $3,500 · Silver $1,800 · Bronze $600 · Build-your-own (custom) · In-Kind (Product/Custom). All perk bullets in §3.

**Current sponsors + URLs + logos** — Context66 (headline, `/context66-logo.png`, context66.com); YRI Science (`/yri-science-logo.png`, yriscience.com); MeDo (`/medo-logo.png`, medo.dev); PCBWay (`/pcbway-logo.png`, pcbway.com); .xyz (`/xyz-logo.png`, gen.xyz). Venue partner: SAP Office, San Ramon (`/sap-logo.svg` exists).

**Links / contact**
- Contact email: **dublinhacx@gmail.com**
- Discord: **https://discord.com/invite/wnwAhkPS3**
- Instagram: **https://www.instagram.com/dublin.hacx/**
- Register form, Volunteer form, Judge form URLs (§ NavBar/Footer).
- Prospectus: `/prospectus.html`, `/prospectus.pdf`.
- Canonical domain: **https://www.dublinhacx.com**; OG image `/og-image.png`.

**Taglines that read as brand voice** (reuse-able): "Bring any idea. Build it into reality." · "Walk in with an idea. Walk out with something real." · "By students, for students."

---

## 6. Assets inventory

**In `src/assets/` (imported/bundled)**
- `dublin-hacx-logo.svg` — primary logo (NavBar, Hero, IntroOverlay, Footer via wordmark, /form).
- `dublin-hacks-logo.png` — PNG logo variant (**no import found** — appears unused).
- `hero-night.jpg` — Hero background (starry night / wolf-on-cliff scene per alt text).

**In `public/` (referenced by absolute path)**
- `dublin-hacx-logo.svg` — public copy of logo.
- `favicon.ico`, `og-image.png` — SEO/browser.
- `ehcc-logo.png` — Emerald club logo (BackedBy).
- `jasraj-tulsi.png`, `rachit-panchal.jpg` — organizer headshots (About).
- `uday-vudathala.jpg` — judge headshot (Judges).
- `context66-logo.png` — headline sponsor.
- `yri-science-logo.png`, `medo-logo.png`, `pcbway-logo.png`, `xyz-logo.png` — sponsor logos.
- `sap-logo.svg` — venue partner (present; not obviously rendered in audited sections).
- `prospectus.html`, `prospectus.pdf` — sponsorship prospectus.
- `fonts/MonaspaceKrypton-{Regular,Medium,SemiBold,Bold,ExtraBold}.woff2` — display font.

**Generated at runtime (no image file — code-drawn):**
- Cosmic starfield / nebula / particles / shooting stars (three.js, CosmicBackground).
- Schedule "time orb" (CSS radial gradients + SVG stars + moon).
- Bouncing gold moon (MoonCompanion, CSS).
- Grain overlay (inline SVG turbulence data-URI).
- Custom cursor comet + arrow (CSS/SVG).
- Hero twinkling stars, IntroOverlay stars + labeled orbs (SVG/CSS).

**Icon set:** lucide-react (`Lightbulb, Rocket, Sparkles, Target, Heart, Download`) + hand-authored inline SVGs (checkmarks, hamburger, cursor arrow, FAQ `+`).

---

### Quick redesign-risk summary
- **Off-brand colors to reconcile:** cyan `#22d3ee` (Hero), emerald (BackedBy), indigo (Discord + `#6366f1` nebula) vs the intended **purple + gold**.
- **Purple drift:** ≥4 near-but-not-equal purples.
- **Sameness sources:** patterns #1–#8 above, especially the emerald/indigo twin cards (#4) and the universal glass card + eyebrow-heading combo (#1, #2).
- **Effect density:** glow/gradient/parallax/custom-cursor/intro/3D-bg stack heavily; a redesign should decide which of these survive.
