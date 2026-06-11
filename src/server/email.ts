// Transactional email via Resend. SERVER ONLY — uses RESEND_API_KEY, which must
// never be exposed to the browser (no VITE_ prefix). Imported only from server
// functions in `src/functions/*`.
import { Resend } from "resend";

const EVENT_DATE = "September 1, 2026";
const SIGN_OFF = "— Jasraj & Rachit, Dublin Hacx";

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

Next step: head to your dashboard to read and sign your event documents. You won't be checked in on event day until all of them are signed.

Sign in here: https://dublinhacx.com/dashboard

Can't wait to see what you build.

${SIGN_OFF}`
      : `Hi ${firstName},

Thanks for registering for Dublin Hacx on ${EVENT_DATE}. We've hit capacity, so you're currently on the waitlist.

If a spot opens up, we'll email you right away with instructions to claim it — no action needed from you for now.

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
