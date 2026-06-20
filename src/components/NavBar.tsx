import { motion } from "framer-motion";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/dublin-hacx-logo.svg";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "theme", label: "Theme" },
  { id: "schedule", label: "Schedule" },
  { id: "faq", label: "FAQ" },
  { id: "sponsors", label: "Sponsors" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { session } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    // Section anchors only exist on the home page. From any other route
    // (login, signup, register, dashboard…), route home and let the router
    // scroll to the section via the hash.
    if (pathname !== "/") {
      navigate({
        to: "/",
        hash: id,
        hashScrollIntoView: { behavior: "smooth", block: "start" },
      });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToAuthArea = () => {
    setOpen(false);
    navigate({ to: session ? "/dashboard" : "/login" });
  };

  // Registration now lives inside the dashboard, so the "Sign Up" CTA routes to
  // the auth area (dashboard if signed in, otherwise the login/sign-up page).
  const goToRegister = goToAuthArea;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" aria-label="Dublin Hacx home" className="flex items-center group">
          <img
            src={logo}
            alt="Dublin Hacx"
            className="h-8 w-auto sm:h-10 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_oklch(0.78_0.17_305_/_0.9)]"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={goToAuthArea}
            className="ml-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm font-medium hover:bg-secondary/60"
          >
            {session ? "Dashboard" : "Log in"}
          </button>
          <button
            onClick={goToRegister}
            className="ml-1 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground purple-glow transition-transform hover:scale-105"
          >
            Sign Up
          </button>
        </nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-full p-2 text-foreground hover:bg-secondary/50"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <>
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="rounded-lg px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={goToAuthArea}
              className="mt-2 rounded-full border border-border bg-secondary/40 px-5 py-3 text-sm font-medium"
            >
              {session ? "Dashboard" : "Log in"}
            </button>
            <button
              onClick={goToRegister}
              className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Sign Up
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
