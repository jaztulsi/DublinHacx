import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SEQ = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiEgg() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const expected = SEQ[idx];
      if (!expected) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expected.toLowerCase()) {
        const next = idx + 1;
        if (next === SEQ.length) {
          setOpen(true);
          setIdx(0);
        } else {
          setIdx(next);
        }
      } else {
        setIdx(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 p-6 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="rounded-3xl border border-primary/40 bg-card/60 p-10 text-center backdrop-blur-xl purple-glow"
          >
            <div className="text-6xl">🚀</div>
            <h3 className="mt-4 font-display text-3xl font-extrabold">
              You found the secret!
            </h3>
            <p className="mt-2 text-muted-foreground">Now go build something cosmic.</p>
            <button
              onClick={() => setOpen(false)}
              className="mt-6 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
