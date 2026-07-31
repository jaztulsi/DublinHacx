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
          className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gold/[0.06] p-10 text-center backdrop-blur-md md:p-14"
          style={{ boxShadow: "0 0 60px oklch(0.85 0.15 85 / 0.18)" }}
        >
          {/* Gold glow accent */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />

          <img
            src="/ehcc-logo.png"
            alt="Emerald Hacking & Coding Club logo"
            className="relative mx-auto mb-6 h-40 w-auto object-contain drop-shadow-[0_0_40px_oklch(0.85_0.15_85_/_0.5)]"
          />

          <p className="relative mb-5 font-pixel text-sm uppercase tracking-[0.25em] text-gold">
            Officially Backed
          </p>

          <h2 className="relative font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            This is backed by the{" "}
            <span
              className="text-gold"
              style={{ textShadow: "0 0 30px oklch(0.85 0.15 85 / 0.6), 0 0 60px oklch(0.85 0.15 85 / 0.3)" }}
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
