import { motion } from "framer-motion";

export function StorySection() {
  return (
    <section className="relative flex min-h-[50vh] items-center justify-center px-6 py-24">
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl text-center font-sans text-2xl font-medium leading-snug text-foreground md:text-3xl"
      >
        Bring an idea, get 12 hours to build it, and show what you made by the
        end of the day. That's it — Dublin Hacx, October 10, 2026 at Emerald High
        School.
      </motion.p>
    </section>
  );
}
