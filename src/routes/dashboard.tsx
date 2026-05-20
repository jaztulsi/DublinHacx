import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/sections/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Dublin Hacx" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

type DocKey =
  | "code_of_conduct"
  | "photo_release"
  | "parent_signature"
  | "liability_waiver"
  | "medical_release";

type DocSpec = {
  key: DocKey;
  title: string;
  description: string;
  body: string;
  signerLabel: string;
};

const DOCUMENTS: DocSpec[] = [
  {
    key: "code_of_conduct",
    title: "Code of Conduct",
    description: "Be kind, build cool things, no jerks.",
    signerLabel: "Sign as Hacker",
    body: "I agree to follow the Dublin Hacx Code of Conduct. I will treat fellow hackers, mentors, and organizers with respect. I will not engage in harassment, plagiarism, or unsafe behavior. I understand violations may result in removal from the event.",
  },
  {
    key: "photo_release",
    title: "Photo & Video Release",
    description: "Lets us share event photos.",
    signerLabel: "Sign as Hacker",
    body: "I consent to being photographed and recorded during the event, and grant Dublin Hacx the right to use this media for promotion of future events, social media, and recap materials.",
  },
  {
    key: "parent_signature",
    title: "Parent / Guardian Permission",
    description: "Required for hackers under 18.",
    signerLabel: "Sign as Parent / Guardian",
    body: "I am the parent or legal guardian of the registered hacker. I give permission for them to attend the overnight Dublin Hacx event and acknowledge the schedule and venue described in the registration materials.",
  },
  {
    key: "liability_waiver",
    title: "Liability Waiver",
    description: "Standard event waiver.",
    signerLabel: "Sign as Parent / Guardian",
    body: "I, on behalf of myself and the hacker, release Dublin Hacx, its organizers, and the venue from liability for ordinary risks of attending the event, including travel to and from the venue.",
  },
  {
    key: "medical_release",
    title: "Medical Information & Emergency Release",
    description: "So we can help if something happens.",
    signerLabel: "Sign as Parent / Guardian",
    body: "I authorize Dublin Hacx organizers to seek emergency medical treatment for the hacker if needed during the event, and I have provided accurate emergency contact and allergy information on the registration form.",
  },
];

function DashboardPage() {
  const navigate = useNavigate();
  const { session, user, loading, signOut } = useAuth();
  const [signed, setSigned] = useState<Set<DocKey>>(new Set());
  const [openDoc, setOpenDoc] = useState<DocKey | null>(null);
  const [fetching, setFetching] = useState(true);
  const [busy, setBusy] = useState<DocKey | null>(null);
  const [celebrated, setCelebrated] = useState(false);

  const loadSignatures = useCallback(async (userId: string) => {
    setFetching(true);
    const { data, error } = await supabase
      .from("document_signatures")
      .select("document_key")
      .eq("user_id", userId);
    if (!error && data) {
      setSigned(new Set(data.map((r) => r.document_key as DocKey)));
    }
    setFetching(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    if (user) loadSignatures(user.id);
  }, [loading, session, user, navigate, loadSignatures]);

  const allSigned = signed.size === DOCUMENTS.length;

  useEffect(() => {
    if (allSigned && !celebrated && !fetching) {
      setCelebrated(true);
      confetti({
        particleCount: 220,
        spread: 100,
        origin: { y: 0.55 },
        colors: ["#c084fc", "#f5c842", "#ffffff"],
      });
    }
  }, [allSigned, celebrated, fetching]);

  const sign = async (key: DocKey) => {
    if (!user) return;
    setBusy(key);
    const { error } = await supabase
      .from("document_signatures")
      .upsert({ user_id: user.id, document_key: key });
    if (!error) {
      setSigned((prev) => new Set(prev).add(key));
      setOpenDoc(null);
    }
    setBusy(null);
  };

  const unsign = async (key: DocKey) => {
    if (!user) return;
    setBusy(key);
    const { error } = await supabase
      .from("document_signatures")
      .delete()
      .eq("user_id", user.id)
      .eq("document_key", key);
    if (!error) {
      setSigned((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      setCelebrated(false);
    }
    setBusy(null);
  };

  if (loading || !session) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="pointer-events-none fixed inset-0 z-0">
          <CosmicBackground />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  const progress = Math.round((signed.size / DOCUMENTS.length) * 100);
  const openSpec = openDoc ? DOCUMENTS.find((d) => d.key === openDoc) : null;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <CosmicBackground />
      </div>
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07] grain-overlay" />
      <CustomCursor />
      <NavBar />
      <main className="relative z-10 px-6 pt-28 pb-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
                Hacker Dashboard
              </span>
              <h1 className="mt-3 font-display text-3xl font-extrabold md:text-5xl">
                {user?.email ? user.email.split("@")[0] : "Welcome"},{" "}
                <span className="text-gradient-primary">let's get you set.</span>
              </h1>
            </div>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/login" });
              }}
              className="self-start rounded-full border border-border bg-secondary/40 px-5 py-2 text-sm font-medium hover:bg-secondary/60"
            >
              Log out
            </button>
          </div>

          <div className="mb-8 rounded-2xl border border-border bg-card/30 p-5 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {signed.size} / {DOCUMENTS.length} documents signed
              </span>
              <span className="font-semibold text-primary">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary/50">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-primary-glow purple-glow"
              />
            </div>
          </div>

          <AnimatePresence>
            {allSigned && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 rounded-3xl border border-primary/50 bg-primary/10 p-8 text-center backdrop-blur-md purple-glow"
              >
                <div className="text-5xl">🎉</div>
                <h2 className="mt-3 font-display text-2xl font-extrabold md:text-3xl">
                  You're all set — see you then!
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every document is signed. Watch your email for event-day info.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {fetching ? (
            <p className="text-center text-muted-foreground">Loading your documents…</p>
          ) : (
            <ul className="space-y-3">
              {DOCUMENTS.map((doc) => {
                const isSigned = signed.has(doc.key);
                return (
                  <li
                    key={doc.key}
                    className={`rounded-2xl border p-5 backdrop-blur-md transition ${
                      isSigned
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-card/30 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                            isSigned
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background/40"
                          }`}
                          aria-hidden="true"
                        >
                          {isSigned ? (
                            <svg
                              viewBox="0 0 24 24"
                              width="14"
                              height="14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : null}
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:shrink-0">
                        <button
                          type="button"
                          onClick={() => setOpenDoc(doc.key)}
                          className="rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm font-medium hover:bg-secondary/60"
                        >
                          {isSigned ? "Review" : "View & Sign"}
                        </button>
                        {isSigned && (
                          <button
                            type="button"
                            onClick={() => unsign(doc.key)}
                            disabled={busy === doc.key}
                            className="rounded-full border border-border bg-background/40 px-4 py-2 text-sm font-medium hover:bg-secondary/60 disabled:opacity-50"
                          >
                            Undo
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {openSpec && (
          <motion.div
            key={openSpec.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => setOpenDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl border border-primary/40 bg-card/90 p-7 backdrop-blur-xl"
            >
              <h3 className="font-display text-2xl font-extrabold">{openSpec.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{openSpec.description}</p>
              <div className="mt-5 max-h-60 overflow-y-auto rounded-xl border border-border bg-input/30 p-4 text-sm leading-relaxed">
                {openSpec.body}
              </div>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpenDoc(null)}
                  className="rounded-full border border-border bg-secondary/40 px-5 py-2.5 text-sm font-medium hover:bg-secondary/60"
                >
                  Close
                </button>
                {signed.has(openSpec.key) ? (
                  <div className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/15 px-5 py-2.5 text-sm font-semibold text-primary">
                    <span>✓</span>
                    Signed
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => sign(openSpec.key)}
                    disabled={busy === openSpec.key}
                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground purple-glow hover:scale-[1.02] disabled:opacity-60"
                  >
                    {busy === openSpec.key ? "Signing…" : openSpec.signerLabel}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
