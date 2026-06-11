# Dublin Hacx MCP Server — Setup

This is a local MCP (Model Context Protocol) server. Once it's running, you can
ask Claude things like _"How many people registered today?"_ or _"Show me the
waitlist"_ and Claude will query the live Supabase database and answer — no
browser or Supabase dashboard needed.

It runs **on your own machine** and connects to the live database using the
Supabase **service role key**, so keep that key private and never commit it.

## One-time setup

1. Open a terminal in this folder:
   ```
   cd mcp-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create your local env file from the example:
   ```
   cp .env.example .env
   ```

4. Fill in `.env` with values from your Supabase project:
   **Supabase Dashboard → Project Settings → API**
   - `SUPABASE_URL` — the Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — the `service_role` secret key (NOT the anon key)

5. Build the server:
   ```
   npm run build
   ```

6. Open **Claude Desktop → Settings → Developer → Edit Config**. This opens
   `claude_desktop_config.json`.

7. Add this entry inside the `mcpServers` object (replace the path with the real
   absolute path to this folder's `dist/index.js`, and paste your real values):

   ```json
   "dublin-hacx": {
     "command": "node",
     "args": ["/FULL/PATH/TO/mcp-server/dist/index.js"],
     "env": {
       "SUPABASE_URL": "your-url-here",
       "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key-here"
     }
   }
   ```

8. **Restart Claude Desktop** completely (quit and reopen).

9. You should see a **hammer icon** in the chat box — that means the server is
   connected and its tools are available.

10. Try asking:
    > How many people have registered for Dublin Hacx?

## Available tools

- **get_stats** — totals: registrations, waitlist, spots remaining, signing progress
- **list_registrations** — search/filter registered hackers (no PII)
- **list_waitlist** — the waitlist in position order
- **get_registration** — one hacker by email, with their document status
- **get_signature_progress** — who has signed which of the 5 documents
- **get_schedule** — full agenda plus live before/live/ended status
- **get_team_info** — everyone on a given team
- **check_capacity** — current count vs the 170 cap

## Updating after a code change

If you edit `src/index.ts`, rebuild and restart Claude Desktop:

```
npm run build
```

## Notes

- Phone numbers, parent contacts, and emergency contacts are **never** returned
  by any tool.
- All queries use the service role key, which bypasses row-level security so the
  server can read every row.
- If Claude can't see the tools, double-check the absolute path in the config
  and that you fully restarted Claude Desktop.
