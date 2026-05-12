# RSVP backend — Google Apps Script

The wedding-invite RSVP form posts to a Google Apps Script Web App that
appends each submission as a row in a Google Sheet you own. The Sheet
becomes your guest list.

## One-time setup (~5 minutes)

1. **Create the Sheet.** Go to https://sheets.new and name it something like
   `Đám cưới Hà & Hiền — RSVP`. Leave it empty; the script creates the tab
   and headers on first submission.

2. **Open the bound Apps Script editor.** From inside the Sheet:
   `Extensions → Apps Script`. A new tab opens with an empty `Code.gs`.

3. **Paste the script.** Replace the contents of `Code.gs` with the file at
   `apps-script/Code.gs` in this repo. Save (⌘S / Ctrl+S). Name the project
   anything, e.g. `wedding-rsvp`.

4. **Deploy as a Web App.**
   - `Deploy → New deployment`
   - Click the gear ⚙ next to "Select type" → **Web app**
   - Description: `wedding-rsvp v1`
   - Execute as: **Me** (your Google account)
   - Who has access: **Anyone**
   - Click **Deploy**, then **Authorize access** and grant the script
     permission to edit Sheets on your behalf.
   - Copy the resulting **Web app URL** — looks like
     `https://script.google.com/macros/s/AKfyc.../exec`.

5. **Wire it into the site.** In the project root, create a file `.env.local`
   with:

   ```
   VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/AKfyc.../exec
   ```

   `.env.local` is gitignored (via `*.local`), so the URL stays out of the
   repo. Restart `yarn dev` to pick up the new variable.

6. **Test it.** Submit a test RSVP from the site. A new row should appear
   in the `RSVP` tab of your Sheet within a second or two.

## Updating the script later

If you change `Code.gs`, you must redeploy:

- `Deploy → Manage deployments → ✏ Edit`
- Bump the version (the dropdown), keep the same URL, click **Deploy**.

The `/exec` URL is stable across redeploys — no need to update `.env.local`.

## What gets recorded

The form was simplified to a wish-only flow. Each submission writes one
row with these 5 columns:

| Column          | Source |
| --------------- | ------ |
| Thời Gian       | Server time when the row was appended |
| Bên             | `groom` / `bride` (auto-detected from the first path segment, e.g. `/groom`, `/bride`) |
| Họ và Tên       | The "Họ và Tên" field |
| Lời Chúc        | The "Lời chúc" message |
| Khách Gửi Lúc   | ISO timestamp from the guest's browser |

> **Migrating from the old 8-column schema.** Earlier versions of the form
> also collected `Attending`, `Guests`, and `Phone`. If your sheet still
> has those columns, run `migrate_dropLegacyColumns` from the Apps Script
> editor once — it deletes those three columns in place, preserving the
> rest of the data. The function is idempotent: running it again is a
> no-op once the schema is already migrated.

## Public wishes feed (`?action=wishes`)

The site's floating wishes overlay calls
`GET <endpoint>?action=wishes` and renders the returned messages as a
live, infinite-scrolling feed. The endpoint returns a privacy-safe
projection of the sheet:

```json
{
  "ok": true,
  "wishes": [
    { "name": "Nguyễn Văn A", "side": "groom",
      "note": "Chúc hai bạn trăm năm hạnh phúc!",
      "timestamp": "2026-05-10T..." },
    ...
  ]
}
```

The projection is enforced by `readWishes_` in `Code.gs`. Entries with
no name or no note are filtered out (nothing to display). The wishes
feed only exposes `Name`, `Side`, and `Note`.

## Testing from inside the editor (no HTTP needed)

`Code.gs` ships with four editor-only helpers. Pick one from the function
dropdown next to ▶ Run, click Run, then open **Execution log** at the
bottom of the editor.

| Function                     | What it does                                                       |
| ---------------------------- | ------------------------------------------------------------------ |
| `test_doGet_wishes`          | Calls `doGet({parameter:{action:'wishes'}})`, logs the JSON.       |
| `test_doGet_liveness`        | Calls `doGet` with no action — should log the plain-text reply.   |
| `test_doPost`                | Simulates a real POST from the site, appends a sample row.         |
| `test_readWishes`            | Bypasses HTTP entirely; logs the projection only.                  |
| `rename_headers`             | Rewrite row 1 of an existing sheet to the current Vietnamese labels. |
| `migrate_dropLegacyColumns`  | One-shot migration to drop the legacy Attending/Guests/Phone cols. |

> Why these exist: when you click ▶ Run on `doGet` directly, the editor
> calls it with **no** event object — so `e.parameter.action` is
> undefined and the function falls through to the liveness branch. The
> helpers above pass a fake event so each branch can be exercised.

The helpers are never triggered by HTTP — only by manual runs in the
editor — so it's safe to leave them in the deployed script.

## Troubleshooting

- **No rows appear.** Open the Apps Script editor → `Executions` (left
  sidebar) and look for failed `doPost` runs. Common cause: the deployment
  was switched to "Only myself" — set it back to **Anyone**.
- **Test from a browser.** Visit the `/exec` URL directly; you should see
  `RSVP endpoint is live. POST JSON to record a response.` (handled by
  `doGet`). If you see a Google login page instead, your deployment access
  is wrong.
- **CORS error in DevTools.** The frontend sends the body as `text/plain`
  on purpose to avoid CORS preflight. If you change that to
  `application/json`, the browser will preflight with `OPTIONS`, which
  Apps Script can't answer — the request will fail.
