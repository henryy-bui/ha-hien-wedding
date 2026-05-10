/**
 * RSVP receiver — Google Apps Script Web App.
 *
 * Receives wish submissions from the wedding-invite frontend and appends
 * them as rows to the bound Google Sheet. The sheet must have a tab named
 * SHEET_NAME (created automatically on first submission if missing).
 *
 * The frontend posts JSON as text/plain (a "simple" CORS content-type)
 * so Apps Script doesn't have to handle a preflight — the script reads
 * e.postData.contents and parses it.
 *
 * Setup: see apps-script/README.md.
 */

const SHEET_NAME = "RSVP";

// 5-column schema. The form was simplified from {name, attending, guests,
// phone, note} to {name, note} — those three fields are no longer
// captured. If your sheet still has the legacy 8-column layout, run
// `migrate_dropLegacyColumns` from the editor once to convert it.
//
// Header labels are in Vietnamese so the sheet reads naturally for the
// hosts. Position is what matters at runtime — appendRow writes by index,
// so changing the labels here is purely cosmetic for new sheets. To
// update an EXISTING sheet's header row, run `rename_headers` once.
const HEADERS = [
  'Thời Gian',     // server timestamp (when the row was recorded)
  'Bên',           // groom / bride (auto-detected from ?side= query)
  'Họ và Tên',     // guest's name — matches the form label
  'Lời Chúc',      // wish message — matches the form label
  'Khách Gửi Lúc', // client-side ISO timestamp from the guest's browser
];

const LEGACY_HEADERS = [
  "Timestamp",
  "Side",
  "Name",
  "Note",
  "Submitted At (client)",
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    const sheet = getOrCreateSheet_();
    sheet.appendRow([
      new Date(),
      payload.side || "",
      payload.name || "",
      payload.note || "",
      payload.submittedAt || "",
    ]);

    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

/**
 * GET handler.
 *   ?action=wishes → returns the public wishes feed (name + side + note).
 *                    Used by the live overlay on the invite site.
 *   anything else  → liveness message for sanity-checking the deployment.
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "";

  if (action === "wishes") {
    return jsonOut_({ ok: true, wishes: readWishes_() });
  }

  return ContentService.createTextOutput(
    "RSVP endpoint is live. POST JSON to record a response."
  ).setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Public-safe projection of the RSVP sheet — includes only fields suitable
 * for display on the live wishes feed.
 */
function readWishes_() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return [];

  const last = sheet.getLastRow();
  if (last < 2) return [];

  // Columns: Timestamp | Side | Name | Note | Submitted At
  const rows = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();

  return rows
    .map((r) => ({
      timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0] || ""),
      side: String(r[1] || ""),
      name: String(r[2] || "").trim(),
      note: String(r[3] || "").trim(),
    }))
    .filter((w) => w.name && w.note) // skip entries with no name or no message
    .reverse(); // newest first
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// ─── Editor-only test helpers ───────────────────────────────────────
//
// These let you exercise each path from inside the Apps Script editor
// without having to make real HTTP calls. Pick the function in the
// dropdown next to ▶ Run, click Run, then check the Execution log.

function test_doGet_wishes() {
  const fakeEvent = { parameter: { action: "wishes" } };
  const out = doGet(fakeEvent);
  Logger.log("doGet(action=wishes) →");
  Logger.log(out.getContent());
}

function test_doGet_liveness() {
  const out = doGet({ parameter: {} });
  Logger.log("doGet(no action) →");
  Logger.log(out.getContent());
}

function test_doPost() {
  const samplePayload = {
    side: "groom",
    name: "Test User",
    note: "Lời chúc thử nghiệm từ editor.",
    submittedAt: new Date().toISOString(),
  };
  const fakeEvent = {
    postData: {
      contents: JSON.stringify(samplePayload),
      type: "text/plain",
    },
  };
  const out = doPost(fakeEvent);
  Logger.log("doPost(sample) →");
  Logger.log(out.getContent());
}

function test_readWishes() {
  const wishes = readWishes_();
  Logger.log("readWishes_() returned %s row(s):", wishes.length);
  Logger.log(JSON.stringify(wishes, null, 2));
}

/**
 * Pull data back into the new 5-column shape for rows that were written
 * by the OLD 8-column doPost (i.e. submissions made between the schema
 * change and the redeploy).
 *
 * Detects the misalignment signature: A–C filled, D–E empty, but G or H
 * has data. Moves G→D and H→E, then clears columns F–H on that row.
 * Skips any row that doesn't match — safe to run multiple times.
 */
function repair_misalignedRows() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('No "%s" tab found.', SHEET_NAME);
    return;
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 7) {
    Logger.log('Nothing to repair (rows=%s, cols=%s).', lastRow, lastCol);
    return;
  }

  // Read everything after the header row, up through col H.
  const width = Math.min(lastCol, 8);
  const rng = sheet.getRange(2, 1, lastRow - 1, width);
  const values = rng.getValues();
  let repaired = 0;

  for (let i = 0; i < values.length; i++) {
    const r = values[i];
    const aFilled = r[0] !== '' && r[0] != null;
    const bFilled = r[1] !== '' && r[1] != null;
    const cFilled = r[2] !== '' && r[2] != null;
    const dEmpty  = r[3] === '' || r[3] == null;
    const eEmpty  = r[4] === '' || r[4] == null;
    const gOrH    = (r[6] !== '' && r[6] != null) || (r[7] !== '' && r[7] != null);

    if (aFilled && bFilled && cFilled && dEmpty && eEmpty && gOrH) {
      // Move G→D and H→E; clear F–H.
      r[3] = r[6] || ''; // note
      r[4] = r[7] || ''; // submittedAt
      r[5] = '';
      r[6] = '';
      r[7] = '';
      repaired++;
    }
  }

  if (repaired > 0) {
    rng.setValues(values);
    Logger.log('✓ Repaired %s row(s).', repaired);
  } else {
    Logger.log('No misaligned rows detected.');
  }
}

/**
 * Rewrite the existing sheet's row 1 to match the current HEADERS values.
 * Only touches the first N cells (where N = HEADERS.length); data in
 * subsequent rows is untouched. Idempotent — running it twice is fine.
 */
function rename_headers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('No "%s" tab found — nothing to rename.', SHEET_NAME);
    return;
  }
  const before = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  Logger.log('Header row updated.');
  Logger.log('  Before: %s', JSON.stringify(before));
  Logger.log('  After:  %s', JSON.stringify(HEADERS));
}

// ─── One-time migration ────────────────────────────────────────────
//
// Drops the Attending, Guests, and Phone columns from the sheet so the
// schema matches the simplified form. Safe to run multiple times — does
// nothing if the headers don't match the legacy layout.
//
// To run: pick `migrate_dropLegacyColumns` in the function dropdown,
// click ▶ Run, watch the Execution log.

function migrate_dropLegacyColumns() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('No "%s" tab found — nothing to migrate.', SHEET_NAME);
    return;
  }

  const lastCol = sheet.getLastColumn();
  if (lastCol < LEGACY_HEADERS.length) {
    Logger.log(
      "Sheet has %s columns; legacy schema has %s. Already migrated or empty — nothing to do.",
      lastCol,
      LEGACY_HEADERS.length
    );
    return;
  }

  const headerRow = sheet
    .getRange(1, 1, 1, LEGACY_HEADERS.length)
    .getValues()[0];
  const looksLegacy = LEGACY_HEADERS.every((h, i) => headerRow[i] === h);
  if (!looksLegacy) {
    Logger.log(
      "Header row does not match the legacy 8-column schema — refusing to migrate."
    );
    Logger.log("Current headers: %s", JSON.stringify(headerRow));
    return;
  }

  // Delete columns from right to left so indices stay stable as we go.
  // Legacy order:  A:Timestamp B:Side C:Name D:Attending E:Guests F:Phone G:Note H:Submitted
  sheet.deleteColumn(6); // Phone
  sheet.deleteColumn(5); // Guests
  sheet.deleteColumn(4); // Attending

  // Result: A:Timestamp B:Side C:Name D:Note E:Submitted — matches new HEADERS.
  Logger.log(
    "✓ Migrated to 5-column schema. Old rows preserved; Attending/Guests/Phone columns removed."
  );
}
