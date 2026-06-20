// Transactional email via Resend. SERVER ONLY — uses RESEND_API_KEY, which must
// never be exposed to the browser (no VITE_ prefix). Imported only from server
// functions in `src/functions/*`.
import { Resend } from "resend";

const EVENT_DATE = "September 1, 2026";
const SIGN_OFF = "— The Dublin Hacx Team";

let _resend: Resend | undefined;
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing server env var: RESEND_API_KEY");
  return (_resend ??= new Resend(key));
}

function fromAddress() {
  return process.env.RESEND_FROM_EMAIL || "Dublin Hacx <noreply@dublinhacx.com>";
}

type ConfirmationArgs = {
  to: string;
  firstName: string;
  status: "accepted" | "waitlisted";
};

export async function sendRegistrationConfirmation({ to, firstName, status }: ConfirmationArgs) {
  const resend = getResend();

  const subject =
    status === "accepted"
      ? "You're in — Dublin Hacx 🎉"
      : "You're on the waitlist — Dublin Hacx";

  const body =
    status === "accepted"
      ? `Hi ${firstName},

You're in — your spot at Dublin Hacx on ${EVENT_DATE} is confirmed! 🎉

Here's what to do next:

1. Sign your documents. Head to your dashboard and read and sign every event document. You won't be checked in on event day until all of them are signed.
   Sign in here: https://dublinhacx.com/dashboard

2. Watch your inbox. We'll send further updates with the schedule, venue details, and event-day logistics as the date gets closer.

3. Pack for the day. Bring your laptop and charger, plus a photo ID for check-in.

Can't wait to see what you build.

${SIGN_OFF}`
      : `Hi ${firstName},

Thanks for registering for Dublin Hacx on ${EVENT_DATE}. We've hit capacity for now, so you're on the waitlist.

There's nothing you need to do — spots open up regularly, and if one becomes available we'll email you right away with instructions to claim it.

We'll be in touch.

${SIGN_OFF}`;

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to,
    subject,
    text: body,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
