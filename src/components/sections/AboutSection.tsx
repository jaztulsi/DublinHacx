import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  { value: 12, suffix: "hr", label: "Build window" },
  { value: 0, suffix: "", label: "Cost — totally free", isText: "$0" },
];

const board: { name: string; role: string; bio: string; img?: string }[] = [
  {
    name: "Jasraj Tulsi",
    role: "Event Manager",
    bio: "Event logistics, the money, judges handling, and outreach.",
    img: "/jasraj-tulsi.png",
  },
  {
    name: "Svanik Thakur",
    role: "Sponsor Outreach",
    bio: "Runs sponsor outreach and partnerships.",
    img: "/svanik-thakur.png",
  },
  {
    name: "Rachit Panchal",
    role: "Social Media",
    bio: "Handles social media — posts, promos, and everything in between.",
    img: "/rachit-panchal.jpg",
  },
  {
    name: "Shaurya",
    role: "Volunteer & Guest Speaker Outreach",
    bio: "Coordinates volunteers and reaches out to guest speakers.",
    img: "/shaurya.jpg",
  },
];

/** Avatar: shows the organizer photo if provided, else falls back to initials. */
function OrganizerAvatar({ name, img }: { name: string; img?: string }) {
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // On a prerendered page the image can 404 before React hydrates, so the
  // onError event is missed. Re-check the loaded state on mount.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setErrored(true);
  }, [img]);

  if (img && !errored) {
    return (
      <img
        ref={imgRef}
        src={img}
        alt={name}
        onError={() => setErrored(true)}
        className="h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-primary/30"
      />
    );
  }

  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow font-display text-2xl font-bold text-primary-foreground">
      {initials}
    </div>
  );
}

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
          <p className="mb-3 font-pixel text-sm uppercase tracking-widest text-primary">About</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
            Made by students who got tired of <span className="text-gradient-primary">waiting</span>
            .
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
              <div className="font-sans text-5xl font-bold text-primary md:text-6xl">
                {s.isText ? s.isText : <Counter to={s.value} suffix={s.suffix} />}
              </div>
              <p className="mt-2 font-pixel text-base text-muted-foreground">{s.label}</p>
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
            "The day I stopped just talking about building stuff and actually built something."
          </p>
          <footer className="mt-3 text-sm not-italic text-muted-foreground">
            — hopefully you, on October 3
          </footer>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h3 className="font-display text-3xl font-bold">One day that actually sticks.</h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            It's Dublin's very first Dublin Hacx — 10am to 10pm, 170 people from around the Bay
            Area, one room. First time touching code or your tenth project, doesn't matter. You
            leave with something you actually built and a few people you didn't know that morning.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Run out of the EHS Hacking & Coding Club at Emerald High. By students, for students.
          </p>
        </motion.div>

        {/* The Board — full-width horizontal roster, no cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-20"
        >
          <div className="mb-12 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="font-pixel text-sm uppercase tracking-widest text-primary">
              The Board
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <div className="flex flex-wrap items-start justify-center gap-x-12 gap-y-10">
            {board.map((o) => (
              <div key={o.name} className="flex w-48 flex-col items-center text-center">
                <OrganizerAvatar name={o.name} img={o.img} />
                <h4 className="mt-4 font-display text-lg font-bold">{o.name}</h4>
                <p className="text-xs uppercase tracking-widest text-primary">{o.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.bio}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
