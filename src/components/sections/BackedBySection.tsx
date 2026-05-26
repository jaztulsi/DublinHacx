import { motion } from "framer-motion";

export function BackedBySection() {
  return (
    <section id="backed-by" className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-emerald-400/30 bg-emerald-500/[0.06] p-10 text-center backdrop-blur-md md:p-14"
          style={{ boxShadow: "0 0 60px oklch(0.72 0.16 160 / 0.18)" }}
        >
          {/* Emerald glow accent */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

          <p className="relative mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-emerald-300 backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Officially Backed
          </p>

          <h2 className="relative font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            This is backed by the{" "}
            <span
              className="text-emerald-400"
              style={{ textShadow: "0 0 30px oklch(0.72 0.16 160 / 0.6), 0 0 60px oklch(0.72 0.16 160 / 0.3)" }}
            >
              Emerald Hacking &amp; Coding Club
            </span>
            .
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Dublin Hacx is proudly powered and supported by the Emerald Hacking &amp;
            Coding Club — built by students, for students.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
