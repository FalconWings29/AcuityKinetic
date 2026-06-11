// Sends a waitlist signup to a Google Apps Script web app backed by a Google
// Sheet. Set VITE_WAITLIST_URL in .env to your deployed web app URL (it must end
// in /exec). If it is unset, signups succeed locally so the demo still works
// without a backend configured.
const WAITLIST_URL = import.meta.env.VITE_WAITLIST_URL;

export async function joinWaitlist(email) {
  if (!WAITLIST_URL) {
    return { ok: true, local: true };
  }

  // Apps Script (ContentService) cannot return CORS headers, so the browser is
  // not allowed to read its response. We send a no-cors POST: the row still
  // records in the sheet, and a completed request counts as success. The email
  // is already validated before this runs. URLSearchParams keeps it a simple
  // request, which is the body shape Apps Script reads via e.parameter.email.
  await fetch(WAITLIST_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: new URLSearchParams({ email }),
  });

  return { ok: true };
}
