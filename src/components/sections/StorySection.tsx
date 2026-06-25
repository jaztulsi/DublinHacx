import { motion } from "framer-motion";

const panels = [
  {
    statement: "It starts with an idea.",
    subline: "Doesn't matter how rough. Doesn't matter if it's been done before.",
  },
  {
    statement: "12 hours to make it real.",
    subline: "Free food, mentors, hardware, and 169 other people who get it.",
  },
  {
    statement: "You ship. You present. You remember this weekend forever.",
    subline: "Dublin's very first Dublin Hacx — September 2026 (date TBD).",
  },
];

export function StorySection() {
  return (
    <section className="relative px-6">
      {panels.map((p) => (
        <motion.div
          key={p.statement}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-[60vh] flex-col items-center justify-center text-center"
        >
          <h2 className="text-aurora font-pixel text-6xl leading-[1.05] md:text-8xl">
            {p.statement}
          </h2>
          <p className="mt-6 max-w-2xl text-center text-lg text-muted-foreground md:text-xl">
            {p.subline}
          </p>
        </motion.div>
      ))}
    </section>
  );
}
