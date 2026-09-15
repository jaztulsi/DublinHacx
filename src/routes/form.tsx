import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/dublin-hacx-logo.svg";

const INSTAGRAM_URL = "https://www.instagram.com/dublin.hacx/";
const DISCORD_URL = "https://discord.gg/Xty2HE9Gn";

export const Route = createFileRoute("/form")({
  head: () => ({
    meta: [
      { title: "Registrations closed — Dublin Hacx" },
      {
        name: "description",
        content: "Registrations for Dublin Hacx are closed. Follow our socials to stay updated.",
      },
    ],
  }),
  component: FormPage,
});

// Registrations have closed, so this route no longer embeds the form — anyone
// landing here from an old link gets the notice and a way to stay in the loop.
function FormPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-4">
        <Link to="/" aria-label="Dublin Hacx home" className="flex items-center gap-2.5">
          <img src={logo} alt="Dublin Hacx" className="h-8 w-auto sm:h-10" />
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg rounded-3xl border border-primary/30 bg-card/30 p-10 text-center backdrop-blur-md">
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">
            Registrations are closed
          </h1>
          <p className="mt-4 text-muted-foreground">
            Follow our socials to stay updated. Thank you!
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              Follow on Instagram
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-primary/40 px-6 py-3 text-sm font-bold text-primary transition hover:bg-primary/10"
            >
              Join the Discord
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
