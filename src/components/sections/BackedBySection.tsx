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

          <img
            src="/ehcc-logo.png"
            alt="Emerald Hacking & Coding Club logo"
            className="relative mx-auto mb-6 h-28 w-28 object-contain drop-shadow-[0_0_30px_oklch(0.72_0.16_160_/_0.45)]"
          />

          <p className="relative mb-5 font-pixel text-sm uppercase tracking-[0.25em] text-emerald-300">
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
            We run the Emerald Hacking &amp; Coding Club. Dublin Hacx is the event we
            kept wishing existed, so we're just building it ourselves. By students,
            for students.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
