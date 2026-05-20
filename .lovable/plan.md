## Dublin Hacx — Production Website

A dark, cosmic, premium hackathon site for Dublin, CA's first overnight high school hackathon, hosted by the Emerald Hacking & Coding Club. September 2026, 170 hackers cap.

---

### Stack & Foundations

- TanStack Start (already configured) + TypeScript + Tailwind v4
- Three.js via `@react-three/fiber` + `@react-three/drei` for the starfield, hero sphere, and 3D schedule clock
- Framer Motion for entrance/scroll reveals; GSAP + ScrollTrigger for the schedule scrub
- Lovable Cloud (Supabase) for `registrations` + `waitlist` tables
- React Hook Form + Zod for form validation
- Resend (via the connector) for confirmation emails to hacker + parent
- `canvas-confetti` for the success burst
- Fonts: Syne 800 (display) + Space Grotesk (body) loaded via Google Fonts
- Theme: bg `#03010a`, primary `#c084fc`, gold `#f5c842` — wired into `styles.css` as oklch tokens

---

### Pages / Routes

- `/` — landing (hero, about, club, schedule, registration, FAQ, sponsors, footer all on one scrolling page with smooth-scroll nav)
- `/admin` — password-gated registrant table with CSV export
- Per-route `head()` metadata; OG title "Dublin Hacx — September 2026"

---

### Sections

**1. Hero** — Fullscreen `<Canvas>` starfield (drei `Stars`) + slowly rotating dark sphere with purple emissive material, fixed behind all content. "DUBLIN" / "HACKS" in massive Syne, eyebrow "Dublin, CA · September 2026 · Overnight", four animated badges, two CTAs (Apply / Learn More), animated scroll indicator. Staggered Framer Motion fade-up.

**2. About** — Three animated counter cards (170 / 24hr / Prizes TBD), two-column layout with description + organizer cards for Jasraj Tulsi and Rachit Panchal.

**3. Emerald Hacking & Coding Club** — Gold pill badge, club description (placeholder), feature list (workshops, competitions, mentorship, CS prep), trophy box with 4 achievements.

**4. Overnight Schedule (GSAP ScrollTrigger)** — Sticky left column with a 3D sphere "floating clock" (R3F) showing the active event's time. Right column is a vertical glowing line that extends as the user scrolls; each event card transitions through ghost → highlighted → dimmed states tied to scroll position. 11 events from 9AM check-in through 3PM awards, each with title, description, color-coded tag (Food/Event/Fun).

**5. Registration** — Live capacity bar pulling real count from Supabase, "Applications Open" pulsing pill. Full multi-section form (Hacker / Parent-Guardian / Team / Agreements) with all fields specified. On submit a server function (`createServerFn`) re-checks count atomically: if <170 inserts to `registrations` and triggers Resend emails to hacker + parent + fires confetti and shows "🎉 You're in!"; if ≥170 inserts to `waitlist` with auto position and shows "⏳ You're on the waitlist".

**6. FAQ** — Framer Motion accordion with all 10 questions.

**7. Sponsors** — Three tier cards (Gold has glowing gold border), "Current Sponsors" grid with "Your Logo Here" ghost slots, email CTA card.

**8. Footer** — Logo, tagline, link columns, social icons (placeholder hrefs), club attribution.

---

### Global Polish

- Custom glowing purple dot cursor (trails behind mouse, hides on touch devices)
- Page-load intro overlay revealing the logo then dissolving into hero
- Animated SVG grain texture overlay at low opacity
- Smooth-scroll between sections via nav links + sticky translucent header with hamburger on mobile
- Konami code easter egg → modal "🚀 You found the secret!"
- Fully responsive (mobile hamburger nav, single-column form, lighter 3D on small screens)

---

### Backend (Lovable Cloud / Supabase)

Tables created via migration:
- `registrations` — all hacker/parent/team fields, `status` enum, `confirmed` bool, `created_at`
- `waitlist` — same shape + auto-incrementing `position`
- RLS: public can `INSERT` only; counts read via a SECURITY DEFINER function `get_registration_count()`; admin reads gated server-side
- Admin password stored as a runtime secret, validated inside a server function (never client-checked)

Server functions:
- `submitRegistration` — Zod-validates input, atomically counts and inserts, calls Resend, returns `{status, name}`
- `getCapacity` — returns current count for the live bar
- `adminLogin` + `listRegistrations` + `exportRegistrationsCsv` — password-gated server fns for `/admin`

---

### Email (Resend connector)

Server function calls Resend through the Lovable connector gateway to send two templated emails per successful registration: one to the hacker confirming their spot, one to the parent/guardian with event info. Sender: `dublinhacx@gmail.com` (from address noted; user can swap once domain is verified in Resend).

---

### Setup Steps (executed after approval)

1. Install deps: `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `gsap`, `react-hook-form`, `@hookform/resolvers`, `zod`, `canvas-confetti`
2. Connect Resend connector (you'll pick the connection)
3. Enable Lovable Cloud + create migrations for `registrations` & `waitlist` + RLS + count RPC
4. Add `ADMIN_PASSWORD` runtime secret (I'll prompt you)
5. Wire fonts + theme tokens in `styles.css`
6. Build sections, server functions, admin route
7. QA responsive + animation perf

---

### Open items you can fill in later

- Exact September 2026 date, venue, prize amounts, club bio paragraph, real social URLs, organizer photos (currently initials avatars), sponsor logos
