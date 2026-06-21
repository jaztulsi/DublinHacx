import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CustomCursor } from "@/components/CustomCursor";
import {
  getRegistrations,
  getWaitlist,
  getSignatures,
  getSignatureStats,
  promoteFromWaitlist,
  createRegistration,
  DOCUMENT_KEYS,
  type AdminRegistration,
  type AdminWaitlist,
  type SignatureRow,
  type SignatureStats,
} from "@/functions/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Dublin Hacx" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "registrations" | "add" | "waitlist" | "signatures" | "export";

const TABS: { key: Tab; label: string }[] = [
  { key: "registrations", label: "Registrations" },
  { key: "add", label: "Add Hacker" },
  { key: "waitlist", label: "Waitlist" },
  { key: "signatures", label: "Signatures" },
  { key: "export", label: "Export" },
];

// Columns shown in the registrations/waitlist tables (in order).
const REG_COLUMNS = [
  "first_name",
  "last_name",
  "email",
  "school",
  "exp_level",
  "tshirt",
  "dietary",
  "team_name",
  "status",
  "confirmed",
  "devpost_url",
  "created_at",
] as const;

function fmt(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join("; ");
  if (typeof value === "boolean") return value ? "yes" : "no";
  return String(value);
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]).filter((k) => k !== "id");
  const escape = (v: unknown) => {
    const s = fmt(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => escape(row[h])).join(","));
  return lines.join("\n");
}

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);
  const [loadingGate, setLoadingGate] = useState(false);

  const [tab, setTab] = useState<Tab>("registrations");
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([]);
  const [waitlist, setWaitlist] = useState<AdminWaitlist[]>([]);
  const [signatures, setSignatures] = useState<SignatureRow[]>([]);
  const [stats, setStats] = useState<SignatureStats | null>(null);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const loadAll = useCallback(async (pw: string) => {
    const [regs, wl, sigs, st] = await Promise.all([
      getRegistrations({ data: { password: pw } }),
      getWaitlist({ data: { password: pw } }),
      getSignatures({ data: { password: pw } }),
      getSignatureStats({ data: { password: pw } }),
    ]);
    setRegistrations(regs);
    setWaitlist(wl);
    setSignatures(sigs);
    setStats(st);
  }, []);

  const submitGate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingGate(true);
    setGateError(null);
    try {
      await loadAll(password);
      setAuthed(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setGateError(msg.includes("Unauthorized") ? "Wrong password." : msg);
    }
    setLoadingGate(false);
  };

  const copyEmail = (email: string) => {
    navigator.clipboard?.writeText(email);
    setNotice(`Copied ${email}`);
    window.setTimeout(() => setNotice(null), 1500);
  };

  const promote = async (id: string) => {
    try {
      const res = await promoteFromWaitlist({ data: { password, waitlistId: id } });
      if (res.ok) {
        setNotice(`Promoted ${res.name ?? "hacker"} to accepted.`);
        await loadAll(password);
      } else {
        setNotice(res.error ?? "Promotion failed.");
      }
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Promotion failed.");
    }
    window.setTimeout(() => setNotice(null), 2500);
  };

  const filteredRegs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return registrations;
    return registrations.filter((r) =>
      [r.first_name, r.last_name, r.email, r.school, r.team_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [registrations, search]);

  const filteredWaitlist = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return waitlist;
    return waitlist.filter((r) =>
      [r.first_name, r.last_name, r.email, r.school]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [waitlist, search]);

  if (!authed) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="pointer-events-none fixed inset-0 z-0">
          <CosmicBackground />
        </div>
        <CustomCursor />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <form
            onSubmit={submitGate}
            className="w-full max-w-sm rounded-3xl border border-border bg-card/40 p-7 backdrop-blur-xl"
          >
            <h1 className="font-display text-2xl font-extrabold">Admin access</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the admin password to continue.
            </p>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-5 w-full rounded-full border border-border bg-input/30 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
            />
            {gateError && <p className="mt-2 text-sm text-destructive">{gateError}</p>}
            <button
              type="submit"
              disabled={loadingGate || !password}
              className="mt-5 w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground purple-glow hover:scale-[1.01] disabled:opacity-60"
            >
              {loadingGate ? "Checking…" : "Unlock"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <CosmicBackground />
      </div>
      <CustomCursor />
      <main className="relative z-10 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-extrabold md:text-4xl">
                Admin <span className="text-gradient-primary">console</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {registrations.length} registered · {waitlist.length} waitlisted ·{" "}
                {stats ? `${stats.fully_signed} fully signed` : "…"}
              </p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === t.key
                    ? "bg-primary text-primary-foreground purple-glow"
                    : "border border-border bg-secondary/40 hover:bg-secondary/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {notice && (
            <div className="mb-4 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary">
              {notice}
            </div>
          )}

          {(tab === "registrations" || tab === "waitlist") && (
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, school…"
              className="mb-4 w-full max-w-sm rounded-full border border-border bg-input/30 px-4 py-2 text-sm outline-none focus:border-primary/50"
            />
          )}

          {tab === "registrations" && (
            <RegistrationsTable rows={filteredRegs} onCopy={copyEmail} />
          )}

          {tab === "add" && (
            <AddHackerForm
              password={password}
              onCreated={(msg) => {
                setNotice(msg);
                loadAll(password);
                window.setTimeout(() => setNotice(null), 2500);
              }}
            />
          )}

          {tab === "waitlist" && (
            <WaitlistTable rows={filteredWaitlist} onCopy={copyEmail} onPromote={promote} />
          )}

          {tab === "signatures" && <SignaturesTable rows={signatures} />}

          {tab === "export" && (
            <div className="rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md">
              <h2 className="font-display text-lg font-bold">Export data</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Download a CSV snapshot of the current data.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => downloadCsv("registrations.csv", registrations)}
                  disabled={registrations.length === 0}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground purple-glow hover:scale-[1.02] disabled:opacity-50"
                >
                  Export Registrations CSV ({registrations.length})
                </button>
                <button
                  onClick={() => downloadCsv("waitlist.csv", waitlist)}
                  disabled={waitlist.length === 0}
                  className="rounded-full border border-border bg-secondary/40 px-5 py-2.5 text-sm font-semibold hover:bg-secondary/60 disabled:opacity-50"
                >
                  Export Waitlist CSV ({waitlist.length})
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TableShell({ children, empty }: { children: React.ReactNode; empty: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card/30 backdrop-blur-md">
      {empty ? (
        <p className="p-6 text-center text-sm text-muted-foreground">No rows.</p>
      ) : (
        <table className="w-full min-w-[900px] text-left text-sm">{children}</table>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap border-b border-border px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`whitespace-nowrap border-b border-border/50 px-3 py-2.5 ${className}`}>
      {children}
    </td>
  );
}

function DevpostCell({ url }: { url: string | null }) {
  if (!url) return <span className="text-muted-foreground">—</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="text-primary underline underline-offset-2 hover:text-primary-glow"
    >
      link
    </a>
  );
}

function RegistrationsTable({
  rows,
  onCopy,
}: {
  rows: AdminRegistration[];
  onCopy: (email: string) => void;
}) {
  return (
    <TableShell empty={rows.length === 0}>
      <thead>
        <tr>
          {REG_COLUMNS.map((c) => (
            <Th key={c}>{c.replace(/_/g, " ")}</Th>
          ))}
          <Th>actions</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            {REG_COLUMNS.map((c) => (
              <Td key={c}>
                {c === "devpost_url" ? (
                  <DevpostCell url={r.devpost_url} />
                ) : c === "created_at" ? (
                  new Date(r.created_at).toLocaleDateString()
                ) : (
                  fmt(r[c]) || <span className="text-muted-foreground">—</span>
                )}
              </Td>
            ))}
            <Td>
              <button
                onClick={() => onCopy(r.email)}
                className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium hover:bg-secondary/60"
              >
                Copy email
              </button>
            </Td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function AddHackerForm({
  password,
  onCreated,
}: {
  password: string;
  onCreated: (msg: string) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"accepted" | "waitlisted">("accepted");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fieldCls =
    "w-full rounded-full border border-border bg-input/30 px-4 py-2 text-sm outline-none focus:border-primary/50";
  const canSubmit = firstName.trim() && lastName.trim() && email.trim() && !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await createRegistration({
        data: { password, first_name: firstName, last_name: lastName, email, status },
      });
      if (res.ok) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setStatus("accepted");
        onCreated(`Added ${res.name ?? "hacker"} as ${status}.`);
      } else {
        setError(res.error ?? "Could not add hacker.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add hacker.");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-xl rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md">
      <h2 className="font-display text-lg font-bold">Add a hacker</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Manually create a registration, matched to the hacker by email. Use this once someone has
        filled out the Google Form. Name, email, and status only — the Google Form stays the source
        of truth for the rest of their details. Setting status to Accepted lets them sign documents
        on their dashboard.
      </p>
      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-foreground/90">First name</span>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={fieldCls}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-foreground/90">Last name</span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={fieldCls}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-foreground/90">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hacker@example.com"
            className={fieldCls}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-foreground/90">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "accepted" | "waitlisted")}
            className={fieldCls}
          >
            <option value="accepted">Accepted</option>
            <option value="waitlisted">Waitlisted</option>
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground purple-glow hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "Adding…" : "Add hacker"}
          </button>
        </div>
      </form>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}

function WaitlistTable({
  rows,
  onCopy,
  onPromote,
}: {
  rows: AdminWaitlist[];
  onCopy: (email: string) => void;
  onPromote: (id: string) => void;
}) {
  return (
    <TableShell empty={rows.length === 0}>
      <thead>
        <tr>
          <Th>position</Th>
          {REG_COLUMNS.filter((c) => c !== "status").map((c) => (
            <Th key={c}>{c.replace(/_/g, " ")}</Th>
          ))}
          <Th>actions</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <Td className="font-semibold text-primary">{r.position}</Td>
            {REG_COLUMNS.filter((c) => c !== "status").map((c) => (
              <Td key={c}>
                {c === "devpost_url" ? (
                  <DevpostCell url={r.devpost_url} />
                ) : c === "created_at" ? (
                  new Date(r.created_at).toLocaleDateString()
                ) : (
                  fmt(r[c]) || <span className="text-muted-foreground">—</span>
                )}
              </Td>
            ))}
            <Td>
              <div className="flex gap-2">
                <button
                  onClick={() => onCopy(r.email)}
                  className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium hover:bg-secondary/60"
                >
                  Copy email
                </button>
                <button
                  onClick={() => onPromote(r.id)}
                  className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:scale-[1.03]"
                >
                  Promote
                </button>
              </div>
            </Td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function SignaturesTable({ rows }: { rows: SignatureRow[] }) {
  return (
    <TableShell empty={rows.length === 0}>
      <thead>
        <tr>
          <Th>email</Th>
          <Th>user id</Th>
          {DOCUMENT_KEYS.map((k) => (
            <Th key={k}>{k.replace(/_/g, " ")}</Th>
          ))}
          <Th>signed</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.user_id}>
            <Td>{r.email ?? <span className="text-muted-foreground">—</span>}</Td>
            <Td className="font-mono text-xs text-muted-foreground">{r.user_id.slice(0, 8)}…</Td>
            {DOCUMENT_KEYS.map((k) => {
              const at = r.signed[k];
              return (
                <Td key={k}>
                  {at ? (
                    <span
                      className="text-primary"
                      title={new Date(at).toLocaleString()}
                    >
                      ✓
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </Td>
              );
            })}
            <Td
              className={
                r.signed_count === DOCUMENT_KEYS.length ? "font-semibold text-primary" : ""
              }
            >
              {r.signed_count}/{DOCUMENT_KEYS.length}
            </Td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}
