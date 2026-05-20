import { motion } from "framer-motion";

const tiers = [
  {
    name: "Gold",
    price: "$2,500",
    perks: [
      "Logo on all banners + shirts",
      "Sponsored prize category",
      "Table + demo slot",
      "Social media features",
      "Resume access",
      "Hero placement on the website",
    ],
    featured: true,
  },
  {
    name: "Silver",
    price: "$1,000",
    perks: [
      "Logo on banner + website",
      "Social media shoutout",
      "Branded swag distribution",
      "Sponsored challenge",
    ],
    featured: false,
  },
  {
    name: "Bronze",
    price: "$500",
    perks: [
      "Website logo placement",
      "Social media mention",
      "Item in hacker bags",
    ],
    featured: false,
  },
];

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
          <p className="mb-3 text-xs uppercase tracking-widest text-primary">Sponsors</p>
          <h2 className="font-display text-4xl font-extrabold md:text-6xl">
            Help build the next <span className="text-gradient-primary">generation</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Your sponsorship directly funds free meals, swag, and prizes for 170 high school
            hackers. Reach motivated, talented young engineers right at the start of their careers.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-3xl border p-8 backdrop-blur-md ${
                t.featured
                  ? "border-gold/50 bg-gradient-to-b from-gold/10 to-transparent gold-glow"
                  : "border-border bg-card/30"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">
                  TOP TIER
                </span>
              )}
              <h3 className={`font-display text-2xl font-extrabold ${t.featured ? "text-gold" : ""}`}>
                {t.name}
              </h3>
              <p className="mt-2 font-display text-4xl font-extrabold">{t.price}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-muted-foreground">
                    <span className={`mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${t.featured ? "bg-gold" : "bg-primary"}`} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.a
          href="mailto:dublinhacx@gmail.com"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-card/30 p-6 backdrop-blur-md transition-colors hover:border-primary md:flex-row md:p-8"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Get in touch</p>
            <p className="mt-1 font-display text-xl font-bold md:text-2xl">
              dublinhacx@gmail.com
            </p>
          </div>
          <span className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
            Email us →
          </span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
            Current Sponsors
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
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
