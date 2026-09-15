import { motion } from "framer-motion";

const DISCORD_URL = "https://discord.gg/Xty2HE9Gn";
const INSTAGRAM_URL = "https://www.instagram.com/dublin.hacx/";

export function DiscordSection() {
  return (
    <section id="discord" className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary/[0.06] p-10 text-center backdrop-blur-md md:p-14"
          style={{ boxShadow: "0 0 60px oklch(0.78 0.17 305 / 0.18)" }}
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

          <p className="relative mb-5 font-pixel text-sm uppercase tracking-[0.25em] text-primary">
            Join the community
          </p>

          <h2 className="relative font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Hang out with us on{" "}
            <span
              className="text-primary"
              style={{ textShadow: "0 0 30px oklch(0.78 0.17 305 / 0.6), 0 0 60px oklch(0.78 0.17 305 / 0.3)" }}
            >
              Discord
            </span>
            .
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Registrations are closed — follow our socials to stay updated on
            announcements, team-finding, and everything leading up to the day.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-primary px-8 py-3 font-sans text-sm font-bold text-white transition hover:bg-primary/90"
            >
              Join the Discord
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-primary/40 px-8 py-3 font-sans text-sm font-bold text-primary transition hover:bg-primary/10"
            >
              Follow on Instagram
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
