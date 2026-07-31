import { motion } from "framer-motion";
import { Lightbulb, Rocket, Sparkles } from "lucide-react";

const pillars = [
  {
    icon: Lightbulb,
    title: "Bring any idea",
    desc: "There are no themes, no required tracks, no boxes to fit inside. Whatever you're curious about — that's the brief.",
    chip: "No themes",
    // wide tile, top-left
    span: "md:col-span-2",
    accent: "purple" as const,
  },
  {
    icon: Rocket,
    title: "Build it for real",
    desc: "Pick something you actually want to make, then make it. By 8pm it should run — not be a slide deck about a thing that could run.",
    chip: "Make it run",
    span: "md:col-span-1",
    accent: "purple" as const,
  },
  {
    icon: Sparkles,
    title: "Ship in 12 hours",
    desc: "From first commit to live demo, the only constraint is the clock. Mentors and workshops keep you moving.",
    chip: "The clock",
    // full-width bottom banner
    span: "md:col-span-3",
    accent: "purple" as const,
  },
];

export function ThemeSection() {
  return (
    <section id="theme" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-6 font-pixel text-center text-base uppercase tracking-widest text-muted-foreground"
        >
          Every great hack starts with a question.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 font-pixel text-sm uppercase tracking-widest text-primary">The Theme</p>
          <h2 className="font-display text-4xl font-extrabold md:text-6xl">
            Open-ended. <span className="text-gradient-primary">On purpose.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Bring any idea. Build it into reality.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md transition-colors hover:border-primary/40 ${p.span}`}
            >
              {/* purple dot-grid wash on hover */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.78_0.17_305_/_0.10)_1px,transparent_1px)] bg-[length:5px_5px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl purple-glow bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-105">
                    <p.icon size={20} />
                  </div>
                  <span className="rounded-full border border-primary/30 px-2.5 py-1 font-pixel text-xs uppercase tracking-widest text-primary">
                    {p.chip}
                  </span>
                </div>
                <h3 className="font-sans text-xl font-bold">{p.title}</h3>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
