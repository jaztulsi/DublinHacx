import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/dublin-hacx-logo.svg";

const REGISTER_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdnmbxMou0EOQ4BbJJEeekJ_B7FVXqV9IioHKOfzYSVIGmKNg/viewform?embedded=true";

export const Route = createFileRoute("/form")({
  head: () => ({
    meta: [
      { title: "Register — Dublin Hacx" },
      { name: "description", content: "Register for Dublin Hacx — October 3, 2026 at the SAP Office in San Ramon." },
    ],
  }),
  component: FormPage,
});

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

      <iframe
        title="Dublin Hacx registration form"
        src={REGISTER_EMBED_URL}
        className="w-full flex-1 border-0"
        style={{ minHeight: "1400px" }}
      >
        Loading…
      </iframe>
    </div>
  );
}
