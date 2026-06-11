import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Config & constants
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Fail loudly on stderr (never stdout — stdout is the MCP transport).
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in mcp-server/.env"
  );
  process.exit(1);
}

/** Registration cap for the event. */
const CAPACITY = 170;

/** The five documents every hacker must sign, keyed as stored in document_signatures. */
const DOCUMENT_KEYS = [
  "code_of_conduct",
  "photo_release",
  "parent_signature",
  "liability_waiver",
  "medical_release",
] as const;

/**
 * Columns that are safe to return. PII (phone, parent_phone, parent_email,
 * emergency_contact) is intentionally excluded everywhere.
 */
const SAFE_REGISTRATION_COLUMNS =
  "id, first_name, last_name, email, school, exp_level, tshirt, dietary, team_name, status, confirmed, created_at";

// Service role key bypasses RLS so the server can read every row.
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ---------------------------------------------------------------------------
// Schedule (copied from src/lib/schedule.ts — do NOT import across packages)
// ---------------------------------------------------------------------------

type ScheduleTag = "Food" | "Event" | "Fun";

interface ScheduleItem {
  offsetMin: number;
  time: string;
  title: string;
  description: string;
  tag: ScheduleTag;
}

/** Event start: Saturday, September 12, 2026 at 9:00 AM Pacific. */
const EVENT_START = new Date("2026-09-12T09:00:00-07:00");

const SCHEDULE: ScheduleItem[] = [
  { offsetMin: 0, time: "9:00 AM", title: "Check-In", description: "Arrive, sign in, grab your badge & swag bag.", tag: "Event" },
  { offsetMin: 60, time: "10:00 AM", title: "Waitlist Check-In", description: "Last call for waitlisted hackers if spots open up.", tag: "Event" },
  { offsetMin: 120, time: "11:00 AM", title: "Opening Ceremony", description: "Sponsors intro, judging criteria, and the green light.", tag: "Event" },
  { offsetMin: 180, time: "12:00 PM", title: "Hacking Begins", description: "24 hours start now. Build, ship, repeat.", tag: "Event" },
  { offsetMin: 300, time: "2:00 PM", title: "Workshops", description: "Beginner-friendly sessions on web, AI, and hardware.", tag: "Fun" },
  { offsetMin: 540, time: "6:00 PM", title: "Dinner", description: "Hot meal to keep you fueled through the long haul.", tag: "Food" },
  { offsetMin: 780, time: "10:00 PM", title: "Mini-Events", description: "Trivia, smash tournaments, and surprise activities.", tag: "Fun" },
  { offsetMin: 1080, time: "3:00 AM", title: "Late Night Snacks", description: "Pizza, energy drinks, and cosmic vibes.", tag: "Food" },
  { offsetMin: 1500, time: "10:00 AM", title: "Day 2 Submissions", description: "Final commits, demo prep, and devpost uploads.", tag: "Event" },
  { offsetMin: 1620, time: "12:00 PM", title: "Judging", description: "Show your project to industry mentors.", tag: "Event" },
  { offsetMin: 1800, time: "3:00 PM", title: "Awards Ceremony", description: "Winners announced. Prizes handed out. Confetti.", tag: "Event" },
];

const EVENT_END_MIN = 1800 + 60; // ~4:00 PM Sunday

function computeLiveStatus(now: Date = new Date()) {
  const startMs = EVENT_START.getTime();
  const elapsedMin = (now.getTime() - startMs) / 60000;
  if (elapsedMin < 0) {
    return { phase: "before" as const, currentIdx: 0, msToStart: startMs - now.getTime() };
  }
  if (elapsedMin > EVENT_END_MIN) {
    return { phase: "ended" as const, currentIdx: SCHEDULE.length - 1, msToStart: 0 };
  }
  let idx = 0;
  for (let i = 0; i < SCHEDULE.length; i++) {
    if (SCHEDULE[i].offsetMin <= elapsedMin) idx = i;
    else break;
  }
  return { phase: "live" as const, currentIdx: idx, msToStart: 0 };
}

function humanizeMs(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count rows in a table, optionally filtered. Returns 0 on a null count. */
async function countTable(
  table: string,
  filter?: (q: any) => any
): Promise<number> {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) query = filter(query);
  const { count, error } = await query;
  if (error) throw new Error(`Count of ${table} failed: ${error.message}`);
  return count ?? 0;
}

/**
 * Pull every document_signatures row (user_id + document_key) and aggregate
 * per-user signing progress. Returns a map of user_id -> set of signed keys
 * plus rollups across all users.
 */
async function aggregateSignatures() {
  const { data, error } = await supabase
    .from("document_signatures")
    .select("user_id, document_key");
  if (error) throw new Error(`Reading signatures failed: ${error.message}`);

  const byUser = new Map<string, Set<string>>();
  const perDoc: Record<string, number> = Object.fromEntries(
    DOCUMENT_KEYS.map((k) => [k, 0])
  );

  for (const row of data ?? []) {
    if (!row.user_id || !row.document_key) continue;
    let set = byUser.get(row.user_id);
    if (!set) {
      set = new Set();
      byUser.set(row.user_id, set);
    }
    // Only count each (user, doc) once toward the per-doc tally.
    if (DOCUMENT_KEYS.includes(row.document_key) && !set.has(row.document_key)) {
      perDoc[row.document_key] += 1;
    }
    set.add(row.document_key);
  }

  let allFive = 0;
  let atLeastOne = 0;
  for (const set of byUser.values()) {
    const signedCount = DOCUMENT_KEYS.filter((k) => set.has(k)).length;
    if (signedCount >= 1) atLeastOne += 1;
    if (signedCount === DOCUMENT_KEYS.length) allFive += 1;
  }

  return { byUser, perDoc, allFive, atLeastOne };
}

function jsonResult(payload: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
  };
}

// ---------------------------------------------------------------------------
// Tool definitions (JSON Schema for the protocol)
// ---------------------------------------------------------------------------

const TOOLS: Tool[] = [
  {
    name: "get_stats",
    description:
      "Get a high-level snapshot of Dublin Hacx registrations. Returns total registrations, waitlist count, spots remaining against the 170 cap, and how many users have signed all 5 documents vs at least 1. Use this when asked for an overview, totals, or 'how are we doing'.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_registrations",
    description:
      "List registered hackers (non-PII fields only). Use when asked to see, search, or filter registrations. Supports a search string (matches first name, last name, or email) and a status filter (accepted or waitlisted).",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max rows to return (default 50, max 200)." },
        search: { type: "string", description: "Case-insensitive match against first_name, last_name, or email." },
        status: { type: "string", enum: ["accepted", "waitlisted"], description: "Filter by registration status." },
      },
    },
  },
  {
    name: "list_waitlist",
    description:
      "List people on the waitlist, ordered by their position (earliest first). Use when asked who is waiting or how the waitlist looks.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max rows to return (default 50)." },
      },
    },
  },
  {
    name: "get_registration",
    description:
      "Look up a single hacker by their exact email (case-insensitive) and return their non-PII registration details plus which of the 5 documents they have signed. Use when asked about one specific person.",
    inputSchema: {
      type: "object",
      properties: {
        email: { type: "string", description: "The hacker's email address." },
      },
      required: ["email"],
    },
  },
  {
    name: "get_signature_progress",
    description:
      "Get document-signing progress across all hackers: how many have signed each of the 5 documents, and how many have all 5 / some / none. Use when asked about waivers, paperwork, or who still needs to sign.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_schedule",
    description:
      "Get the full event schedule plus the live status (before / live / ended), the current or next event, and time until start. Use when asked about the agenda, timing, or what's happening now.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_team_info",
    description:
      "Look up everyone registered under a given team name, including each member's listed teammate emails, so you can tell whether a team is fully registered. Use when asked about a specific team.",
    inputSchema: {
      type: "object",
      properties: {
        team_name: { type: "string", description: "The exact team name to look up." },
      },
      required: ["team_name"],
    },
  },
  {
    name: "check_capacity",
    description:
      "Check event capacity: current registration count, the 170 cap, spots remaining, whether the waitlist is active, and how many people are waitlisted. Use when asked if there is room or whether the event is full.",
    inputSchema: { type: "object", properties: {} },
  },
];

// ---------------------------------------------------------------------------
// Tool handlers
// ---------------------------------------------------------------------------

async function handleGetStats() {
  const [registrations, waitlist, sig] = await Promise.all([
    countTable("registrations"),
    countTable("waitlist"),
    aggregateSignatures(),
  ]);
  return jsonResult({
    registrations,
    waitlist,
    capacity: CAPACITY,
    spots_remaining: Math.max(0, CAPACITY - registrations),
    signed_all_5: sig.allFive,
    signed_at_least_1: sig.atLeastOne,
  });
}

const ListRegistrationsArgs = z.object({
  limit: z.number().int().positive().max(200).optional(),
  search: z.string().min(1).optional(),
  status: z.enum(["accepted", "waitlisted"]).optional(),
});

async function handleListRegistrations(rawArgs: unknown) {
  const args = ListRegistrationsArgs.parse(rawArgs ?? {});
  const limit = Math.min(args.limit ?? 50, 200);

  let query = supabase
    .from("registrations")
    .select(SAFE_REGISTRATION_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (args.status) query = query.eq("status", args.status);
  if (args.search) {
    const term = `%${args.search}%`;
    query = query.or(
      `first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term}`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(`Listing registrations failed: ${error.message}`);
  return jsonResult({ count: data?.length ?? 0, registrations: data ?? [] });
}

const ListWaitlistArgs = z.object({
  limit: z.number().int().positive().max(500).optional(),
});

async function handleListWaitlist(rawArgs: unknown) {
  const args = ListWaitlistArgs.parse(rawArgs ?? {});
  const limit = args.limit ?? 50;

  const { data, error } = await supabase
    .from("waitlist")
    .select("id, position, first_name, last_name, email, school, exp_level, created_at")
    .order("position", { ascending: true })
    .limit(limit);
  if (error) throw new Error(`Listing waitlist failed: ${error.message}`);
  return jsonResult({ count: data?.length ?? 0, waitlist: data ?? [] });
}

const GetRegistrationArgs = z.object({ email: z.string().min(1) });

async function handleGetRegistration(rawArgs: unknown) {
  const { email } = GetRegistrationArgs.parse(rawArgs ?? {});

  const { data, error } = await supabase
    .from("registrations")
    .select(`${SAFE_REGISTRATION_COLUMNS}, user_id`)
    .ilike("email", email)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Lookup failed: ${error.message}`);
  if (!data) return jsonResult({ found: false, email });

  // Pull this user's signed documents (if their row is linked to an auth user).
  const signed: string[] = [];
  const row = data as Record<string, unknown>;
  const userId = row.user_id as string | null;
  if (userId) {
    const { data: sigs, error: sigErr } = await supabase
      .from("document_signatures")
      .select("document_key")
      .eq("user_id", userId);
    if (sigErr) throw new Error(`Reading signatures failed: ${sigErr.message}`);
    for (const s of sigs ?? []) {
      if (s.document_key) signed.push(s.document_key);
    }
  }

  // Drop user_id from the returned row (internal identifier, not useful output).
  delete row.user_id;

  const documents = Object.fromEntries(
    DOCUMENT_KEYS.map((k) => [k, signed.includes(k)])
  );

  return jsonResult({
    found: true,
    registration: row,
    documents,
    signed_count: DOCUMENT_KEYS.filter((k) => signed.includes(k)).length,
  });
}

async function handleGetSignatureProgress() {
  const sig = await aggregateSignatures();
  const totalSigners = sig.byUser.size;
  return jsonResult({
    per_document: sig.perDoc,
    all_5: sig.allFive,
    partial: Math.max(0, sig.atLeastOne - sig.allFive),
    // Users who have a row but no recognized doc, plus this is "at least 1" framing.
    at_least_1: sig.atLeastOne,
    total_users_with_any_signature: totalSigners,
  });
}

async function handleGetSchedule() {
  const now = new Date();
  const status = computeLiveStatus(now);
  return jsonResult({
    event_start: EVENT_START.toISOString(),
    live_status: {
      phase: status.phase,
      current_event_index: status.currentIdx,
      current_event: SCHEDULE[status.currentIdx]?.title ?? null,
      ms_to_start: status.msToStart,
      time_until_start: status.phase === "before" ? humanizeMs(status.msToStart) : null,
    },
    schedule: SCHEDULE,
  });
}

const GetTeamInfoArgs = z.object({ team_name: z.string().min(1) });

async function handleGetTeamInfo(rawArgs: unknown) {
  const { team_name } = GetTeamInfoArgs.parse(rawArgs ?? {});

  const { data, error } = await supabase
    .from("registrations")
    .select(
      "id, first_name, last_name, email, school, exp_level, team_name, teammate_emails, status, confirmed, created_at"
    )
    .eq("team_name", team_name)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Team lookup failed: ${error.message}`);

  return jsonResult({
    team_name,
    registered_members: data?.length ?? 0,
    members: data ?? [],
  });
}

async function handleCheckCapacity() {
  const [registrations, waitlist] = await Promise.all([
    countTable("registrations"),
    countTable("waitlist"),
  ]);
  return jsonResult({
    current_count: registrations,
    capacity: CAPACITY,
    spots_remaining: Math.max(0, CAPACITY - registrations),
    waitlist_active: registrations >= CAPACITY,
    waitlist_length: waitlist,
  });
}

// ---------------------------------------------------------------------------
// Server wiring
// ---------------------------------------------------------------------------

const server = new Server(
  { name: "dublin-hacx-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    switch (name) {
      case "get_stats":
        return await handleGetStats();
      case "list_registrations":
        return await handleListRegistrations(args);
      case "list_waitlist":
        return await handleListWaitlist(args);
      case "get_registration":
        return await handleGetRegistration(args);
      case "get_signature_progress":
        return await handleGetSignatureProgress();
      case "get_schedule":
        return await handleGetSchedule();
      case "get_team_info":
        return await handleGetTeamInfo(args);
      case "check_capacity":
        return await handleCheckCapacity();
      default:
        return {
          isError: true,
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
        };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { isError: true, content: [{ type: "text", text: `Error: ${message}` }] };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Logs go to stderr so they never corrupt the stdio protocol on stdout.
  console.error("dublin-hacx MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error starting MCP server:", err);
  process.exit(1);
});
