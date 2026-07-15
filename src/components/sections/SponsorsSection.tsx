import { motion } from "framer-motion";
import { Download, Heart, Rocket, Sparkles, Target } from "lucide-react";

const stats = [
  { value: "170", label: "High-school hackers" },
  { value: "12h", label: "Non-stop building" },
  { value: "100%", label: "Of funds fuel the event" },
];

const reasons = [
  {
    icon: Target,
    title: "Recruit early talent",
    body: "Meet motivated builders before anyone else — with opt-in access to their resumes, GitHubs, and projects.",
  },
  {
    icon: Rocket,
    title: "Drive product adoption",
    body: "Put your API, hardware, or platform in 170 hands. Sponsor a challenge and watch students ship with your tools.",
  },
  {
    icon: Sparkles,
    title: "Real brand love",
    body: "Logo on the shirts, the banners, the site. You're in every photo people post and every story they tell their friends after.",
  },
  {
    icon: Heart,
    title: "Invest in community",
    body: "Fund Dublin's very first Dublin Hacx. Your support goes straight to meals, swag, and prizes.",
  },
];

const presenting = {
  name: "Partner",
  price: "$6,000",
  tagline: "Our top tier — main event co-branding",
  perks: [
    "Everything in Gold, plus:",
    "Main event co-branding",
    "15-min ceremony speaking slot",
    "XL logo on the t-shirt back",
    "Participant resumes (opt-in)",
    "Participant emails (opt-in)",
  ],
};

const tiers: {
  name: string;
  price: string;
  perks: string[];
  featured?: boolean;
  accent?: boolean;
  badge?: string;
}[] = [
  {
    name: "Gold",
    price: "$3,500",
    featured: true,
    perks: [
      "Everything in Silver, plus:",
      "Large logo on the t-shirt",
      "5-min ceremony speaking slot",
      "Judge panel seat",
      "Company-specific track",
    ],
  },
  {
    name: "Silver",
    price: "$1,800",
    accent: true,
    perks: [
      "Everything in Bronze, plus:",
      "Small logo on the t-shirt",
      "Dedicated table at the event",
      "Social media shoutouts",
      "Host your own workshop (30m)",
    ],
  },
  {
    name: "Bronze",
    price: "$600",
    perks: [
      "Logo on the website footer",
      "Swag/stickers in welcome bags",
      "Mention in the opening ceremony",
      "Included in emails",
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

export function SponsorsSection() {
  return (
    <section id="sponsors" className="relative px-6 py-24 md:py-32">
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
          <a
            href="/prospectus.pdf"
            download="Dublin-Hacx-Sponsorship-Prospectus.pdf"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            <Download size={16} aria-hidden />
            Download our sponsorship prospectus
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 grid grid-cols-2 gap-4 rounded-3xl border border-border bg-card/30 p-6 backdrop-blur-md md:grid-cols-4 md:p-8"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-sans text-4xl font-bold text-gradient-primary md:text-5xl">
                {s.value}
              </p>
              <p className="mt-1 font-pixel text-sm text-muted-foreground md:text-base">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Why sponsor */}
        <div className="mb-20 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md transition-colors hover:border-primary/50"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <r.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
            </motion.div>
          ))}
        </div>

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

        {/* Presenting sponsor — full width hero card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative mb-6 overflow-hidden rounded-3xl border border-gold/50 bg-gradient-to-br from-gold/15 via-card/40 to-transparent p-8 backdrop-blur-md gold-glow md:p-10"
        >
          <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">
            TOP TIER
          </span>
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_1.4fr] md:items-center">
            <div>
              <h4 className="font-display text-3xl font-extrabold text-gold md:text-4xl">
                {presenting.name}
              </h4>
              <p className="mt-3 font-sans text-5xl font-bold">{presenting.price}</p>
              <p className="mt-3 text-sm font-medium text-gold/90">{presenting.tagline}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {presenting.perks.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="text-gold" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Custom package — most popular, full-width hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative mb-6 overflow-hidden rounded-3xl border-2 border-primary bg-gradient-to-br from-primary/20 via-card/50 to-transparent p-8 backdrop-blur-md purple-glow md:p-12"
        >
          <span className="absolute right-6 top-6 flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary-foreground">
            <Sparkles size={14} /> Most popular
          </span>
          <div className="text-center md:text-left">
            <h4 className="font-display text-4xl font-extrabold text-gradient-primary md:text-6xl">
              Build your own
            </h4>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Our most-loved option. Don't see the perfect fit above? Mix, match, and dream up your
              own package — a branded challenge, a custom prize, a workshop, whatever moves your
              brand. We'll chat it through over email and tailor everything to your goals and budget.
            </p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=dublinhacx@gmail.com&su=Dublin%20Hacx%20Custom%20Sponsorship"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-transform hover:scale-105 purple-glow"
            >
              Let's chat over email →
            </a>
          </div>
        </motion.div>

        {/* Core tiers */}
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-3xl border p-7 backdrop-blur-md ${
                t.featured
                  ? "border-primary/60 bg-gradient-to-b from-primary/15 to-transparent purple-glow"
                  : t.accent
                    ? "border-gold/30 bg-card/30"
                    : "border-border bg-card/30"
              }`}
            >
              {t.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {t.badge}
                </span>
              )}
              <h4
                className={`font-display text-2xl font-extrabold ${
                  t.featured ? "text-primary" : t.accent ? "text-gold" : ""
                }`}
              >
                {t.name}
              </h4>
              <p className="mt-2 font-sans text-4xl font-bold">{t.price}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-muted-foreground">
                    <Check
                      className={t.featured ? "text-primary" : t.accent ? "text-gold" : "text-primary"}
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

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
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
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
            {Array.from({ length: 1 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-[3/2] items-center justify-center rounded-xl border border-dashed border-border bg-card/20 text-xs text-muted-foreground"
              >
                Your Logo Here
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
