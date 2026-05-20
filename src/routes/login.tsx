import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { NavBar } from "@/components/NavBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Dublin Hacx" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

type Mode = "signin" | "signup";

function LoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: "/dashboard" });
    }
  }, [loading, session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/dashboard" });
        } else {
          setInfo("Check your email to confirm your account, then log in.");
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <CosmicBackground />
      </div>
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07] grain-overlay" />
      <CustomCursor />
      <NavBar />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-3xl border border-primary/40 bg-card/40 p-8 backdrop-blur-md purple-glow"
        >
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
              Hacker Portal
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold md:text-4xl">
              {mode === "signin" ? (
                <>
                  Welcome <span className="text-gradient-primary">back</span>.
                </>
              ) : (
                <>
                  Create your <span className="text-gradient-primary">account</span>.
                </>
              )}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Log in to access your hacker dashboard."
                : "Sign up to view documents you need to sign."}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 rounded-xl border border-primary/40 bg-primary/10 p-3 text-sm">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-foreground/90">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-foreground/90">Password</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground purple-glow transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {submitting
                ? mode === "signin"
                  ? "Logging in…"
                  : "Creating account…"
                : mode === "signin"
                  ? "Log in →"
                  : "Sign up →"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setInfo(null);
                  }}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have one?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                    setInfo(null);
                  }}
                  className="font-semibold text-primary hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need to register for the event first?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Apply here
            </Link>
            .
          </p>
        </motion.div>
      </main>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 backdrop-blur-md";
