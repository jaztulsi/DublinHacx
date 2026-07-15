import { motion } from "framer-motion";

const DISCORD_URL = "https://discord.com/invite/wnwAhkPS3";

export function DiscordSection() {
  return (
    <section id="discord" className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-indigo-400/30 bg-indigo-500/[0.06] p-10 text-center backdrop-blur-md md:p-14"
          style={{ boxShadow: "0 0 60px oklch(0.6 0.19 275 / 0.18)" }}
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

          <p className="relative mb-5 font-pixel text-sm uppercase tracking-[0.25em] text-indigo-300">
            Join the community
          </p>

          <h2 className="relative font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Hang out with us on{" "}
            <span
              className="text-indigo-400"
              style={{ textShadow: "0 0 30px oklch(0.6 0.19 275 / 0.6), 0 0 60px oklch(0.6 0.19 275 / 0.3)" }}
            >
              Discord
            </span>
            .
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Announcements, team-finding, and questions answered fast. Everyone
            coming to Dublin Hacx should be in here.
          </p>

          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-8 inline-block rounded-full bg-indigo-500 px-8 py-3 font-sans text-sm font-bold text-white transition hover:bg-indigo-400"
          >
            Join the Discord
          </a>
        </motion.div>
      </div>
    </section>
  );
}
