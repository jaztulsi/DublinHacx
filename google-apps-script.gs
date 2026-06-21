/**
 * Dublin Hacx — Google Form → Supabase webhook bridge.
 *
 * Reference only; NOT part of the app build. Paste this into the bound Apps
 * Script editor of the registration Google Form (Form → ⋮ → Script editor) and
 * add an "On form submit" trigger (see the instructions Claude provided).
 *
 * On each submission it POSTs { secret, first_name, last_name, email } to the
 * site's webhook, which creates the registration (or waitlist) row in Supabase.
 */

// ── Configuration ────────────────────────────────────────────────────────────
// Use your live domain. The custom domain is preferred if it's set up;
// otherwise use the .vercel.app default. Pick ONE:
//   https://dublinhacx.com/api/form-webhook        (custom domain)
//   https://dublin-hacx.vercel.app/api/form-webhook (Vercel default)
var WEBHOOK_URL = 'https://dublin-hacx.vercel.app/api/form-webhook';

// Must exactly match FORM_WEBHOOK_SECRET set in Vercel's environment variables.
var WEBHOOK_SECRET = 'PASTE_FORM_WEBHOOK_SECRET_HERE';

// Exact question titles on the Google Form.
var Q_FIRST_NAME = 'First Name';
var Q_LAST_NAME = 'Last Name';
var Q_EMAIL = 'Email';
// ─────────────────────────────────────────────────────────────────────────────

function onFormSubmit(e) {
  try {
    var values = e && e.namedValues ? e.namedValues : {};

    var firstName = pick(values, Q_FIRST_NAME);
    var lastName = pick(values, Q_LAST_NAME);
    var email = pick(values, Q_EMAIL);

    if (!firstName || !lastName || !email) {
      Logger.log(
        'Skipped: missing required field(s). first="%s" last="%s" email="%s". namedValues=%s',
        firstName, lastName, email, JSON.stringify(values)
      );
      return;
    }

    var payload = {
      secret: WEBHOOK_SECRET,
      first_name: firstName,
      last_name: lastName,
      email: email
    };

    var response = UrlFetchApp.fetch(WEBHOOK_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true // so non-2xx responses are logged, not thrown
    });

    var code = response.getResponseCode();
    var text = response.getContentText();

    if (code >= 200 && code < 300) {
      Logger.log('Webhook OK (%s) for %s: %s', code, email, text);
    } else {
      Logger.log('Webhook FAILED (%s) for %s: %s', code, email, text);
    }
  } catch (err) {
    Logger.log('Webhook ERROR: %s', err && err.stack ? err.stack : err);
  }
}

/**
 * Reads an answer from e.namedValues by question title. Falls back to a
 * case-insensitive, whitespace-trimmed match so minor title differences don't
 * silently drop submissions.
 */
function pick(values, title) {
  if (values[title] && values[title][0] != null) {
    return String(values[title][0]).trim();
  }
  var target = title.toLowerCase().trim();
  for (var key in values) {
    if (key.toLowerCase().trim() === target && values[key] && values[key][0] != null) {
      return String(values[key][0]).trim();
    }
  }
  return '';
}
