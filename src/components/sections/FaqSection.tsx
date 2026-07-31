import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const FAQS = [
  {
    q: "Who can attend?",
    a: "Any high school student in the Bay Area. You don't need to be from Dublin or Emerald HS — bring your friends from any school.",
  },
  {
    q: "Do I need coding experience?",
    a: "Nope. We have beginner workshops and mentors on hand. About a third of past hackathon attendees write their first line of code at the event.",
  },
  {
    q: "How much does it cost?",
    a: "$0. Dublin Hacx is completely free for hackers thanks to our sponsors. Food, swag, and prizes included.",
  },
  {
    q: "What should I bring?",
    a: "Laptop, charger, any hardware you want to hack on, a water bottle, and a photo ID for check-in.",
  },
  {
    q: "Can I join a team at the event?",
    a: "Yes. We'll run a team-formation session right after the opening ceremony. Solo hackers are welcome too.",
  },
  {
    q: "Where is the venue?",
    a: "The SAP Office at 3001 Bishop Drive, San Ramon, CA 94583 (Bishop Ranch). The whole event runs there on Saturday, October 3, 2026.",
  },
  {
    q: "How long is the event?",
    a: "Dublin Hacx runs a single day, 10am to 10pm — 12 hours of building, workshops, meals, and judging. Doors open at 10am for check-in and the awards ceremony wraps up by 10pm.",
  },
  {
    q: "How are projects judged?",
    a: "Industry mentors evaluate submissions on technical execution, creativity, polish, and presentation. Specific prize categories will be announced closer to the event.",
  },
  {
    q: "Is food provided?",
    a: "Yes — meals plus snacks and drinks throughout the day. Dietary restrictions are accommodated.",
  },
  {
    q: "How do I become a sponsor?",
    a: "Email us at dublinhacx@gmail.com and we'll send over our sponsorship prospectus.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 font-pixel text-sm uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="font-display text-4xl font-extrabold md:text-6xl">Questions, answered.</h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="overflow-hidden rounded-2xl border border-border bg-card/30 backdrop-blur-md"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-sans text-base font-semibold md:text-lg">{item.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
