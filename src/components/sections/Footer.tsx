import { Link } from "@tanstack/react-router";

const SOCIALS = [
  { name: "Instagram", href: "#", icon: "📷" },
  { name: "Twitter", href: "#", icon: "𝕏" },
  { name: "GitHub", href: "#", icon: "⌨" },
  { name: "LinkedIn", href: "#", icon: "in" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="inline-block h-3 w-3 rounded-full bg-primary purple-glow" />
              <span>
                DUBLIN<span className="text-primary">HACX</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Dublin, CA's first overnight high school hackathon. September 2026.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:col-span-2">
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-primary">Event</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#about" className="hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#theme" className="hover:text-foreground">
                    Theme
                  </a>
                </li>
                <li>
                  <a href="#schedule" className="hover:text-foreground">
                    Schedule
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-foreground">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-primary">Get involved</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/register" className="hover:text-foreground">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <a href="#sponsors" className="hover:text-foreground">
                    Sponsor
                  </a>
                </li>
                <li>
                  <a href="mailto:dublinhacx@gmail.com" className="hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-primary">Social</p>
              <div className="flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/30 text-sm hover:border-primary hover:text-primary"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>In respect to the EHS Hacking & Coding Club · Dublin, CA</p>
          <p>© 2026 Dublin Hacx</p>
        </div>
      </div>
    </footer>
  );
}
