import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminListRegistrations } from "@/server/registrations.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Dublin Hacks" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Registration = Record<string, unknown> & {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  school: string;
  grad_year: string;
  exp_level: string;
  dietary: string;
  tshirt: string;
  idea: string | null;
  github: string | null;
  linkedin: string | null;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  emergency_contact: string;
  team_name: string | null;
  teammate_emails: string[];
  code_of_conduct: boolean;
  photo_release: boolean;
  parent_signature: boolean;
  status?: string;
  confirmed?: boolean;
  position?: number;
};

function toCsv(rows: Registration[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = Array.isArray(v) ? v.join("; ") : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape((row as Record<string, unknown>)[h])).join(","));
  }
  return lines.join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function AdminPage() {
  const list = useServerFn(adminListRegistrations);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);
  const [waitlist, setWaitlist] = useState<Registration[] | null>(null);
  const [tab, setTab] = useState<"registrations" | "waitlist">("registrations");

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await list({ data: { password } });
      if (!res.ok) {
        setError(res.error);
      } else {
        setRegistrations(res.registrations as Registration[]);
        setWaitlist(res.waitlist as Registration[]);
      }
    } catch {
      setError("Could not load. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const isAuthed = registrations !== null;
  const rows = tab === "registrations" ? registrations ?? [] : waitlist ?? [];

  if (!isAuthed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm rounded-2xl border border-border bg-card/40 p-8 backdrop-blur-md"
        >
          <h1 className="mb-2 font-display text-2xl font-extrabold">Admin Access</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter the admin password to view registrations.
          </p>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {error && (
            <p className="mt-3 text-xs text-destructive">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground purple-glow disabled:opacity-50"
          >
            {loading ? "Checking…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold">Dublin Hacks Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {registrations?.length ?? 0} registered ·{" "}
              {waitlist?.length ?? 0} waitlisted
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                downloadCsv(
                  `${tab}-${new Date().toISOString().slice(0, 10)}.csv`,
                  toCsv(rows),
                )
              }
              disabled={rows.length === 0}
              className="rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm font-medium hover:bg-secondary/60 disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setTab("registrations")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === "registrations"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60"
            }`}
          >
            Registrations ({registrations?.length ?? 0})
          </button>
          <button
            onClick={() => setTab("waitlist")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === "waitlist"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60"
            }`}
          >
            Waitlist ({waitlist?.length ?? 0})
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card/30 backdrop-blur-md">
          <table className="min-w-full text-sm">
            <thead className="border-b border-border bg-secondary/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">School</th>
                <th className="px-4 py-3">Grad</th>
                <th className="px-4 py-3">Exp</th>
                <th className="px-4 py-3">Shirt</th>
                <th className="px-4 py-3">Diet</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Parent</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-muted-foreground">
                    No entries yet.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">{r.phone}</td>
                  <td className="px-4 py-3">{r.school}</td>
                  <td className="px-4 py-3">{r.grad_year}</td>
                  <td className="px-4 py-3">{r.exp_level}</td>
                  <td className="px-4 py-3">{r.tshirt}</td>
                  <td className="px-4 py-3">{r.dietary}</td>
                  <td className="px-4 py-3">{r.team_name || "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    {r.parent_name}
                    <br />
                    <span className="text-muted-foreground">{r.parent_email}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
