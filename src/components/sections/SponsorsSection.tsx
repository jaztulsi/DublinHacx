import { motion } from "framer-motion";
import { Download, Sparkles } from "lucide-react";
import OrbitingCirclesGlobe from "@/components/ui/orbiting-circles-02";

// Tier ladder in progression order (Bronze → Partner) for the horizontal
// scroll-pinned timeline. Copy is preserved verbatim from SITE_AUDIT §5.
type TierVariant = "default" | "silver" | "featured" | "gold";
const ladder: {
  name: string;
  price: string;
  perks: string[];
  variant: TierVariant;
  accent: string;
  tagline?: string;
  badge?: string;
}[] = [
  {
    name: "Bronze",
    price: "$600",
    variant: "default",
    accent: "text-foreground",
    perks: [
      "Logo on the website footer",
      "Swag/stickers in welcome bags",
      "Mention in the opening ceremony",
      "Included in emails",
    ],
  },
  {
    name: "Silver",
    price: "$1,800",
    variant: "silver",
    accent: "text-gold/90",
    perks: [
      "Everything in Bronze, plus:",
      "Small logo on the t-shirt",
      "Dedicated table at the event",
      "Social media shoutouts",
      "Host your own workshop (30m)",
    ],
  },
  {
    name: "Gold",
    price: "$3,500",
    variant: "featured",
    accent: "text-primary",
    perks: [
      "Everything in Silver, plus:",
      "Large logo on the t-shirt",
      "5-min ceremony speaking slot",
      "Judge panel seat",
      "Company-specific track",
    ],
  },
  {
    name: "Partner",
    price: "$6,000",
    variant: "gold",
    accent: "text-gold",
    tagline: "Our top tier — main event co-branding",
    badge: "TOP TIER",
    perks: [
      "Everything in Gold, plus:",
      "Main event co-branding",
      "15-min ceremony speaking slot",
      "XL logo on the t-shirt back",
      "Participant resumes (opt-in)",
      "Participant emails (opt-in)",
    ],
  },
];

const inKind = {
  name: "In-Kind & Community",
  price: "Product / Custom",
  perks: [
    "Donate food, swag, prizes, hardware, or cloud & API credits",
    "Provide mentors, judges, or workshop leaders",
    "Recognition matched to your contribution's value",
    "Perfect for startups, local shops & student orgs",
  ],
};

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className={`mt-0.5 h-4 w-4 shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Tier = (typeof ladder)[number];

/** Perks + heading shared by the timeline card and the mobile stacked card. */
function TierBody({ t }: { t: Tier }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className={`font-display text-2xl font-extrabold ${t.accent}`}>{t.name}</h4>
        {t.badge && (
          <span className="shrink-0 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">
            {t.badge}
          </span>
        )}
      </div>
      <p className="font-sans text-4xl font-bold">{t.price}</p>
      {t.tagline && <p className="text-sm font-medium text-gold/90">{t.tagline}</p>}
      <ul className="mt-1 space-y-2.5 text-sm">
        {t.perks.map((p) => (
          <li key={p} className="flex items-start gap-2 text-muted-foreground">
            <Check className={t.accent} />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const tierClass = (variant: TierVariant) =>
  variant === "gold"
    ? "border-gold/50 bg-gradient-to-br from-gold/15 via-card/40 to-transparent gold-glow"
    : variant === "featured"
      ? "border-primary/60 bg-gradient-to-br from-primary/15 via-card/50 to-transparent purple-glow"
      : variant === "silver"
        ? "border-gold/25 bg-card/40"
        : "border-border bg-card/40";

/**
 * Bento tier layout: Partner (top tier, wide) sits beside a smallish
 * "Build your own" card on top; Bronze / Silver / Gold fill a row below.
 */
function TierLadder() {
  const partner = ladder.find((t) => t.name === "Partner")!;
  const lower = ladder.filter((t) => t.name !== "Partner");
  return (
    <div className="space-y-5">
      {/* Top row: Partner (wide) + Build your own (smallish) */}
      <div className="grid gap-5 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className={`flex overflow-hidden rounded-3xl border backdrop-blur-md md:col-span-2 ${tierClass(partner.variant)}`}
        >
          <TierBody t={partner} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="relative flex flex-col justify-center gap-3 overflow-hidden rounded-3xl border-2 border-primary bg-gradient-to-br from-primary/20 via-card/50 to-transparent p-6 backdrop-blur-md purple-glow"
        >
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
            <Sparkles size={13} /> Most popular
          </span>
          <h4 className="font-display text-2xl font-extrabold text-gradient-primary">Build your own</h4>
          <p className="text-sm text-muted-foreground">
            Mix, match, and dream up your own package — a branded challenge, a custom prize, a
            workshop. We'll tailor it to your goals and budget.
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=dublinhacx@gmail.com&su=Dublin%20Hacx%20Custom%20Sponsorship"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 purple-glow"
          >
            Let's chat over email →
          </a>
        </motion.div>
      </div>

      {/* Lower tiers: Bronze, Silver, Gold */}
      <div className="grid gap-5 sm:grid-cols-3">
        {lower.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`flex overflow-hidden rounded-3xl border backdrop-blur-md ${tierClass(t.variant)}`}
          >
            <TierBody t={t} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function SponsorsSection() {
  return (
    <section id="sponsors" className="relative px-6 pt-24 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 font-pixel text-sm uppercase tracking-widest text-primary">Partner with us</p>
          <h2 className="font-display text-4xl font-extrabold md:text-6xl">
            Back the next <span className="text-gradient-primary">generation</span> of builders.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Dublin Hacx puts your brand in front of 170 of the Bay Area's most driven high-school
            engineers — for a full 12 hours, and in every story they tell afterward. Every dollar
            funds free meals, swag, and prizes.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href="/prospectus.html"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              View our sponsorship prospectus
            </a>
            <a
              href="/prospectus.pdf"
              download="Dublin-Hacx-Sponsorship-Prospectus.pdf"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <Download size={13} aria-hidden />
              Download as PDF
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <p className="font-pixel text-sm uppercase tracking-widest text-primary">Sponsorship tiers</p>
          <h3 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
            Pick your <span className="text-gradient-primary">level</span>.
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Every package is flexible — tell us your goals and we'll tailor the perks to match.
          </p>
        </motion.div>

        {/* Tier ladder — horizontal scroll-pinned timeline (Bronze → Partner) */}
        <TierLadder />

        {/* In-kind / community — full width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-6 rounded-3xl border border-primary/30 bg-card/30 p-8 backdrop-blur-md md:p-10"
        >
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_1.4fr] md:items-center">
            <div>
              <h4 className="font-display text-2xl font-extrabold md:text-3xl">{inKind.name}</h4>
              <p className="mt-2 font-sans text-3xl font-bold text-gradient-primary">
                {inKind.price}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                No budget line? Contribute what you make. We'll match your visibility to the value
                you bring.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {inKind.perks.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="text-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.a
          href="mailto:dublinhacx@gmail.com?subject=Dublin%20Hacx%20Sponsorship"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-card/30 p-6 backdrop-blur-md transition-colors hover:border-primary md:flex-row md:p-8"
        >
          <div>
            <p className="font-pixel text-sm uppercase tracking-widest text-primary">Get in touch</p>
            <p className="mt-1 font-display text-xl font-bold md:text-2xl">dublinhacx@gmail.com</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us your goals and we'll send a tailored package within 48 hours.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground purple-glow">
            Become a sponsor →
          </span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <p className="text-center font-pixel text-sm uppercase tracking-widest text-muted-foreground">
            Current Sponsors
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Venue partner: SAP Office, San Ramon
          </p>
          {/* Headline sponsor — Context66 */}
          <a
            href="https://context66.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Context66"
            className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-primary/40 bg-card/20 p-6 transition-colors hover:border-primary/70 purple-glow md:p-8"
          >
            <span className="flex w-full items-center justify-center rounded-xl bg-white px-6 py-6">
              <img
                src="/context66-logo.png"
                alt="Context66"
                className="mx-auto max-h-24 w-auto max-w-[50%] object-contain"
              />
            </span>
            <span className="font-pixel text-xs uppercase tracking-widest text-primary">
              Headline Sponsor
            </span>
          </a>

          {/* Featured sponsor — Dream College Path (bigger than the grid, smaller than headline) */}
          <a
            href="https://www.dreamcollegepath.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Dream College Path"
            className="mr-auto mt-4 flex w-[calc(50%-0.5rem)] flex-col items-center justify-center gap-2.5 rounded-2xl border border-primary/30 bg-card/20 p-5 transition-colors hover:border-primary/60 md:mx-auto md:w-full md:max-w-md md:p-6"
          >
            <span className="flex items-center justify-center rounded-xl bg-white p-4">
              <img
                src="/dream-college-path-logo.jpg"
                alt="Dream College Path"
                // Featured tier: taller than the grid logos, shorter than the 96px Context66 headline.
                className="h-[88px] w-auto object-contain md:h-[92px]"
              />
            </span>
            <span className="font-pixel text-xs uppercase tracking-widest text-primary">
              Featured Sponsor
            </span>
          </a>

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            <a
              href="https://codecrafters.io/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CodeCrafters"
              className="flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/20 p-4 transition-colors hover:border-primary/50"
            >
              <img
                src="/codecrafters-logo.png"
                alt="CodeCrafters"
                className="w-2/3 max-h-24 object-contain"
              />
              <span className="text-xs text-muted-foreground">CodeCrafters</span>
            </a>
            <a
              href="https://elevenlabs.io/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ElevenLabs"
              className="flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/20 p-4 transition-colors hover:border-primary/50"
            >
              <span className="flex w-2/3 items-center justify-center rounded-lg bg-white px-4 py-3">
                <img
                  src="/elevenlabs-logo.svg"
                  alt="ElevenLabs"
                  className="max-h-16 w-full object-contain"
                />
              </span>
              <span className="text-xs text-muted-foreground">ElevenLabs</span>
            </a>
            <a
              href="https://www.yriscience.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YRI Science"
              className="flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/20 p-4 transition-colors hover:border-primary/50"
            >
              <img
                src="/yri-science-logo.png"
                alt="YRI Science"
                className="max-h-28 w-auto object-contain"
              />
              <span className="text-xs text-muted-foreground">YRI Science</span>
            </a>
            <a
              href="https://medo.dev/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MeDo"
              className="flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/20 p-4 transition-colors hover:border-primary/50"
            >
              <span className="flex items-center justify-center rounded-lg bg-white px-3 py-2">
                <img src="/medo-logo.png" alt="MeDo" className="max-h-20 w-auto object-contain" />
              </span>
              <span className="text-xs text-muted-foreground">MeDo</span>
            </a>
            <a
              href="https://www.pcbway.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PCBWay"
              className="flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/20 p-4 transition-colors hover:border-primary/50"
            >
              <span className="flex items-center justify-center rounded-lg bg-white px-3 py-2">
                <img src="/pcbway-logo.png" alt="PCBWay" className="max-h-16 w-auto object-contain" />
              </span>
              <span className="text-xs text-muted-foreground">PCBWay</span>
            </a>
            <a
              href="https://gen.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label=".xyz"
              className="flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/20 p-4 transition-colors hover:border-primary/50"
            >
              <span className="flex items-center justify-center rounded-lg bg-white px-3 py-2">
                <img src="/xyz-logo.png" alt=".xyz" className="max-h-16 w-auto object-contain" />
              </span>
              <span className="text-xs text-muted-foreground">.xyz</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Orbiting globe — desktop/tablet only; the globe is too congested on
          phones, so mobile gets a compact scrolling logo belt instead. */}
      <div className="mt-16 hidden md:block">
        <OrbitingCirclesGlobe />
      </div>
      <div className="mt-12 md:hidden">
        <SponsorBelt />
      </div>
    </section>
  );
}

// Mobile-only conveyor belt of sponsor logos — duplicated once so the -50%
// translate loops seamlessly.
const beltLogos = [
  { src: "/context66-logo.png", alt: "Context66" },
  { src: "/dream-college-path-logo.jpg", alt: "Dream College Path" },
  { src: "/codecrafters-logo.png", alt: "CodeCrafters" },
  { src: "/elevenlabs-logo.svg", alt: "ElevenLabs" },
  { src: "/yri-science-logo.png", alt: "YRI Science" },
  { src: "/medo-logo.png", alt: "MeDo" },
  { src: "/pcbway-logo.png", alt: "PCBWay" },
  { src: "/xyz-logo.png", alt: ".xyz" },
];

function SponsorBelt() {
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <style>{`@keyframes belt{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div className="flex w-max gap-3" style={{ animation: "belt 25s linear infinite" }}>
        {[...beltLogos, ...beltLogos].map((l, i) => (
          <span
            key={i}
            className="flex h-14 w-24 shrink-0 items-center justify-center rounded-xl bg-white p-2.5"
          >
            <img src={l.src} alt={l.alt} className="max-h-full max-w-full object-contain" />
          </span>
        ))}
      </div>
    </div>
  );
}
