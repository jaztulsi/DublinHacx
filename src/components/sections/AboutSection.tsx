import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 1500, bounce: 0 });
  const display = useTransform(spring, (v) => Math.round(v).toString() + suffix);

  useEffect(() => {
    if (inView) motionVal.set(to);
  }, [inView, to, motionVal]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

const stats = [
  { value: 170, suffix: "", label: "Spots" },
  { value: 24, suffix: "hr", label: "Build window" },
  { value: 0, suffix: "", label: "Cost — totally free", isText: "$0" },
];

const organizers = [
  {
    name: "Jasraj Tulsi",
    role: "Co-Founder · Emerald HS",
    bio: "Builder, organizer, and lead voice behind Dublin Hacx.",
  },
  {
    name: "Rachit Panchal",
    role: "Admin · Co-Founder · Emerald HS",
    bio: "Architect of the experience and the operations behind it.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-widest text-primary">About</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
            Built for the next generation of <span className="text-gradient-primary">builders</span>.
          </h2>
        </motion.div>

        <div className="mb-20 grid gap-6 md:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card/30 p-8 backdrop-blur-md"
            >
              <div className="font-display text-5xl font-extrabold text-primary md:text-6xl">
                {s.isText ? s.isText : <Counter to={s.value} suffix={s.suffix} />}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="my-16 mx-auto max-w-3xl border-l-4 border-gold py-2 pl-6"
        >
          <p className="font-display text-3xl italic text-foreground md:text-4xl">
            "The weekend I started taking building seriously."
          </p>
          <footer className="mt-3 text-sm not-italic text-muted-foreground">
            — A future Dublin Hacx alum
          </footer>
        </motion.blockquote>

        <div className="grid gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-display text-3xl font-bold">A weekend that changes trajectories.</h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Dublin Hacx is the first overnight high school hackathon in Dublin, CA — a 24-hour
              sprint where 170 students from across the Bay Area come together to build, learn,
              and compete. Whether it's your first line of code or your tenth project, you'll
              walk out with new friends, new skills, and something you actually shipped.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Built in respect to the EHS Hacking & Coding Club at Emerald High School — by
              students, for students.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="grid gap-4"
          >
            {organizers.map((o) => (
              <div
                key={o.name}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card/30 p-5 backdrop-blur-md"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow font-display text-lg font-bold text-primary-foreground">
                  {o.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h4 className="font-semibold">{o.name}</h4>
                  <p className="text-xs text-primary">{o.role}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{o.bio}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
