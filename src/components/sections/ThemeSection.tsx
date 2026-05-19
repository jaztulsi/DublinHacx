import { motion } from "framer-motion";
import { Lightbulb, Rocket, Sparkles } from "lucide-react";

const pillars = [
  {
    icon: Lightbulb,
    title: "Bring any idea",
    desc: "There are no themes, no required tracks, no boxes to fit inside. Whatever you're curious about — that's the brief.",
  },
  {
    icon: Rocket,
    title: "Build it for real",
    desc: "Participants are encouraged to explore any idea they're passionate about and turn it into a real, working prototype over the course of the hackathon.",
  },
  {
    icon: Sparkles,
    title: "Ship in 24 hours",
    desc: "From first commit to live demo, the only constraint is the clock. Mentors and workshops keep you moving.",
  },
];

export function ThemeSection() {
  return (
    <section id="theme" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-widest text-primary">The Theme</p>
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
              className="rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md transition-colors hover:border-primary/40"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <p.icon size={20} />
              </div>
              <h3 className="font-display text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
